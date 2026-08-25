# Deployment Guide

## Table of Contents

- [Docker Deployment](#docker-deployment)
- [Docker Compose](#docker-compose)
- [Environment Variables](#environment-variables)
- [Database Migrations](#database-migrations)
- [Production Setup](#production-setup)
- [Nginx Configuration](#nginx-configuration)
- [SSL/TLS](#ssltls)
- [Monitoring](#monitoring)
- [CI/CD](#cicd)
- [Backup & Recovery](#backup--recovery)

---

## Docker Deployment

### Build Image

```bash
# Build for production
docker build -t menud-backend:latest .

# Build with specific version
docker build -t menud-backend:v2.1.0 .
```

### Run Container

```bash
docker run -d \
  --name menud-backend \
  -p 3500:3500 \
  -p 3001:3001 \
  --env-file .env.production \
  --restart unless-stopped \
  menud-backend:latest
```

### Multi-Stage Build

The Dockerfile uses multi-stage build for optimization:

```dockerfile
# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Production
FROM node:20-alpine AS production
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

# Security: Non-root user
RUN addgroup -g 1001 -S menud && \
    adduser -S menud -u 1001
USER menud

EXPOSE 3500 3001
CMD ["node", "dist/main.js"]
```

---

## Docker Compose

### Production Configuration

```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  menud-backend:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: menud-backend
    ports:
      - "3500:3500"
      - "3001:3001"
    env_file:
      - .env.production
    depends_on:
      postgres:
        condition: service_healthy
    restart: unless-stopped
    networks:
      - menud-network
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 512M
    healthcheck:
      test: ["CMD", "wget", "--spider", "-q", "http://localhost:3500/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  postgres:
    image: postgres:14-alpine
    container_name: menud-postgres
    environment:
      POSTGRES_DB: menud
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASS}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./scripts/init.sql:/docker-entrypoint-initdb.d/init.sql
    ports:
      - "5432:5432"
    restart: unless-stopped
    networks:
      - menud-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER} -d menud"]
      interval: 10s
      timeout: 5s
      retries: 5

  nginx:
    image: nginx:alpine
    container_name: menud-nginx
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./nginx/ssl:/etc/nginx/ssl
    depends_on:
      - menud-backend
    restart: unless-stopped
    networks:
      - menud-network

volumes:
  postgres_data:
    driver: local

networks:
  menud-network:
    driver: bridge
```

### Start Services

```bash
# Production mode
docker-compose -f docker-compose.prod.yml up -d

# View logs
docker-compose -f docker-compose.prod.yml logs -f menud-backend

# Stop services
docker-compose -f docker-compose.prod.yml down
```

---

## Environment Variables

### Production Variables

```env
# Application
NODE_ENV=production
PORT=3500
WS_PORT=3001

# Database
DB_HOST=postgres
DB_PORT=5432
DB_NAME=menud
DB_USER=your_secure_user
DB_PASS=your_secure_password

# JWT (use strong secrets in production)
JWT_SECRET=your-very-long-and-secure-secret-key
JWT_EXPIRES=7d

# ImageKit
IMAGEKIT_PUBLIC_KEY=your_public_key
IMAGEKIT_PRIVATE_KEY=your_private_key
IMAGEKIT_URL_ENDPOINT=your_url_endpoint

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# CORS
CORS_ORIGINS=https://yourdomain.com

# Logging
LOG_LEVEL=info
LOG_FILE=logs/app.log
```

### Security Best Practices

1. **Never commit .env files** to version control
2. **Use secrets management** (Docker secrets, AWS Secrets Manager, etc.)
3. **Rotate secrets** regularly
4. **Use strong passwords** (32+ characters)
5. **Enable HTTPS** in production
6. **Restrict CORS** to specific origins

---

## Database Migrations

### Run on Deploy

```bash
# In container
docker exec menud-backend npm run typeorm:migration:run

# Or add to docker-compose command
command: >
  sh -c "npm run typeorm:migration:run && node dist/main.js"
```

### Migration Best Practices

1. **Always test migrations** in staging first
2. **Back up database** before running migrations
3. **Use transactions** for complex migrations
4. **Keep migrations reversible**
5. **Review migration files** before merging

---

## Production Setup

### System Requirements

| Resource | Minimum | Recommended |
|----------|---------|-------------|
| CPU | 1 core | 2+ cores |
| RAM | 512 MB | 1+ GB |
| Storage | 10 GB | 20+ GB |
| Network | 10 Mbps | 100+ Mbps |

### Process Manager (PM2)

```bash
# Install PM2
npm install -g pm2

# Start application
pm2 start dist/main.js --name menud-backend

# Save PM2 configuration
pm2 save

# Auto-start on boot
pm2 startup

# Monitor
pm2 monit

# Logs
pm2 logs menud-backend

# Restart
pm2 restart menud-backend
```

### PM2 Ecosystem File

```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'menud-backend',
    script: 'dist/main.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3500,
    },
    error_file: 'logs/error.log',
    out_file: 'logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    max_memory_restart: '500M',
  }]
};
```

---

## Nginx Configuration

### Reverse Proxy

```nginx
# /etc/nginx/nginx.conf
events {
    worker_connections 1024;
}

http {
    upstream menud_backend {
        server localhost:3500;
    }

    upstream menud_websocket {
        server localhost:3001;
    }

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;

    # HTTP to HTTPS redirect
    server {
        listen 80;
        server_name api.yourdomain.com;
        return 301 https://$server_name$request_uri;
    }

    # HTTPS server
    server {
        listen 443 ssl http2;
        server_name api.yourdomain.com;

        # SSL certificates
        ssl_certificate /etc/nginx/ssl/cert.pem;
        ssl_certificate_key /etc/nginx/ssl/key.pem;

        # SSL settings
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers HIGH:!aNULL:!MD5;
        ssl_prefer_server_ciphers on;

        # Security headers
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

        # Gzip compression
        gzip on;
        gzip_types text/plain application/json application/javascript text/xml;
        gzip_min_length 1000;

        # API endpoints
        location / {
            limit_req zone=api burst=20 nodelay;
            
            proxy_pass http://menud_backend;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
        }

        # WebSocket endpoints
        location /socket.io {
            proxy_pass http://menud_websocket;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_read_timeout 86400;
        }

        # Swagger documentation
        location /api-docs {
            proxy_pass http://menud_backend;
            proxy_set_header Host $host;
        }

        # Health check
        location /health {
            proxy_pass http://menud_backend;
            access_log off;
        }
    }
}
```

---

## SSL/TLS

### Let's Encrypt (Free)

```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d api.yourdomain.com

# Auto-renewal
sudo certbot renew --dry-run
```

### Manual Certificate

```bash
# Generate self-signed certificate (for testing)
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout /etc/nginx/ssl/key.pem \
  -out /etc/nginx/ssl/cert.pem
```

---

## Monitoring

### Health Check Endpoint

```bash
curl http://localhost:3500/health
```

Response:
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 3600,
  "database": "connected",
  "memory": {
    "rss": 50000000,
    "heapUsed": 30000000
  }
}
```

### Prometheus Metrics

Available at `/metrics`:

```bash
curl http://localhost:3500/metrics
```

### Logging

```bash
# Docker logs
docker logs -f menud-backend

# PM2 logs
pm2 logs menud-backend

# Application logs
tail -f logs/app.log
```

### Monitoring Stack (Optional)

```yaml
# Add to docker-compose.yml
  prometheus:
    image: prom/prometheus
    volumes:
      - ./monitoring/prometheus.yml:/etc/prometheus/prometheus.yml
    ports:
      - "9090:9090"

  grafana:
    image: grafana/grafana
    ports:
      - "3000:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
```

---

## CI/CD

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run lint
      - run: npm run test
      - run: npm run test:e2e

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SERVER_KEY }}
          script: |
            cd /opt/menud-backend
            git pull origin main
            docker-compose -f docker-compose.prod.yml up -d --build
            docker exec menud-backend npm run typeorm:migration:run
```

### Deployment Checklist

- [ ] Tests passing
- [ ] Lint clean
- [ ] Environment variables configured
- [ ] Database backed up
- [ ] Migrations ready
- [ ] SSL certificates valid
- [ ] Monitoring configured
- [ ] Logs accessible

---

## Backup & Recovery

### Database Backup

```bash
# Manual backup
docker exec menud-postgres pg_dump -U menud_user menud > backup_$(date +%Y%m%d).sql

# Automated daily backup (add to crontab)
0 2 * * * docker exec menud-postgres pg_dump -U menud_user menud | gzip > /backups/menud_$(date +\%Y\%m\%d).sql.gz
```

### Database Restore

```bash
# Restore from backup
docker exec -i menud-postgres psql -U menud_user menud < backup_20240115.sql

# Restore from compressed backup
gunzip < backup_20240115.sql.gz | docker exec -i menud-postgres psql -U menud_user menud
```

### Application Backup

```bash
# Backup volumes
docker run --rm -v menud_postgres_data:/data -v $(pwd):/backup alpine tar czf /backup/postgres_data_$(date +%Y%m%d).tar.gz /data
```

### Recovery Procedures

1. **Database Recovery**
   ```bash
   # Stop application
   docker-compose stop menud-backend
   
   # Restore database
   docker exec -i menud-postgres psql -U menud_user menud < backup.sql
   
   # Start application
   docker-compose start menud-backend
   ```

2. **Full Recovery**
   ```bash
   # Pull latest code
   git pull origin main
   
   # Rebuild
   docker-compose -f docker-compose.prod.yml build
   
   # Restore database
   docker exec -i menud-postgres psql -U menud_user menud < backup.sql
   
   # Start services
   docker-compose -f docker-compose.prod.yml up -d
   ```

---

## Scaling

### Horizontal Scaling

```yaml
# docker-compose.yml
services:
  menud-backend:
    deploy:
      replicas: 3
```

### Load Balancer Configuration

```nginx
upstream menud_backend {
    least_conn;
    server menud-backend-1:3500;
    server menud-backend-2:3500;
    server menud-backend-3:3500;
}
```

### Redis for WebSocket (Multi-Instance)

```typescript
// WebSocket adapter
import { IoAdapter } from '@nestjs/platform-socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';

export class RedisIoAdapter extends IoAdapter {
  async createIOServer(port: number, options?: any) {
    const pubClient = createClient({ url: 'redis://localhost:6379' });
    const subClient = pubClient.duplicate();
    
    await Promise.all([pubClient.connect(), subClient.connect()]);
    
    const server = super.createIOServer(port, {
      ...options,
      adapter: createAdapter(pubClient, subClient),
    });
    
    return server;
  }
}
```
