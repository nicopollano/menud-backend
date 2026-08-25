# Guía de Despliegue

## Visión General

MenuD Backend puede desplegarse de múltiples formas. Esta guía cubre las opciones más comunes y mejores prácticas para cada entorno.

## Entornos

| Entorno | URL | Propósito |
|---------|-----|-----------|
| **Development** | `https://api-menud-develop.pidrive.com.ar` | Desarrollo y pruebas |
| **Staging** | `https://api-menud-staging.pidrive.com.ar` | Pre-producción |
| **Production** | `https://api-menud.pidrive.com.ar` | Producción |

## Despliegue con Docker (Recomendado)

### 1. Construir la Imagen

```bash
# Construir imagen Docker
docker build -t menud-backend:latest .

# Taggear para registry
docker tag menud-backend:latest registry.pidrive.com.ar/menud-backend:latest
```

### 2. Ejecutar Contenedor

```bash
docker run -d \
  --name menud-backend \
  --restart unless-stopped \
  -p 3500:3500 \
  -p 3001:3001 \
  --env-file .env \
  menud-backend:latest
```

### 3. Docker Compose (Producción)

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:14-alpine
    container_name: menud-postgres
    restart: unless-stopped
    environment:
      POSTGRES_DB: ${DATABASE}
      POSTGRES_USER: ${USERNAME_DB}
      POSTGRES_PASSWORD: ${PASSWORD_DB}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${USERNAME_DB} -d ${DATABASE}"]
      interval: 10s
      timeout: 5s
      retries: 5

  backend:
    build: .
    container_name: menud-backend
    restart: unless-stopped
    ports:
      - "3500:3500"
      - "3001:3001"
    env_file: .env
    depends_on:
      postgres:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3500/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  nginx:
    image: nginx:alpine
    container_name: menud-nginx
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./certs:/etc/nginx/certs
    depends_on:
      - backend

volumes:
  postgres_data:
```

### 4. Variables de Entorno para Producción

```env
# Base de datos
HOST=postgres
PORT_DB=5432
USERNAME_DB=menud_prod
PASSWORD_DB=<contraseña-segura>
DATABASE=menud
DB_SSL=true

# Servidor
PORT=3500

# JWT (generar secrets únicos)
TOKENDURATION=30
REFRESHTOKENDURATION=60
TOKENRESETPASSWORDDURATION=15
JWT_SECRET=<jwt-secret-seguro>

# WebSocket
WEBSOCKET_PORT=3001

# Entorno
STAGE=PRODUCTION

# Email
GMAIL_USER=<email>
GMAIL_APP_PASSWORD=<app-password>

# ImageKit
IMAGEKIT_PUBLIC_KEY=<public-key>
IMAGEKIT_PRIVATE_KEY=<private-key>
IMAGEKIT_URL_ENDPOINT=<url-endpoint>

# Dominio
DOMAIN=https://www.menud.com.ar
```

## Despliegue con PM2 (Sin Docker)

### 1. Instalar PM2

```bash
npm install -g pm2
```

### 2. Configurar Ecosystem

```javascript
// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: 'menud-backend',
      script: 'dist/main.js',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3500,
      },
      error_file: './logs/error.log',
      out_file: './logs/out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
    },
  ],
};
```

### 3. Desplegar

```bash
# Build
npm run build

# Iniciar con PM2
pm2 start ecosystem.config.js

# Ver estado
pm2 status

# Ver logs
pm2 logs menud-backend

# Reiniciar
pm2 restart menud-backend
```

### 4. Configurar Inicio Automático

```bash
# Guardar configuración
pm2 save

# Generar script de inicio
pm2 startup
```

## Configuración de Nginx

### reverse Proxy

```nginx
# /etc/nginx/sites-available/menud-backend

upstream backend {
    server 127.0.0.1:3500;
}

upstream websocket {
    server 127.0.0.1:3001;
}

# HTTP → HTTPS redirect
server {
    listen 80;
    server_name api.menud.pidrive.com.ar;
    return 301 https://$server_name$request_uri;
}

# HTTPS
server {
    listen 443 ssl http2;
    server_name api.menud.pidrive.com.ar;

    ssl_certificate /etc/letsencrypt/live/api.menud.pidrive.com.ar/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.menud.pidrive.com.ar/privkey.pem;

    # SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # API
    location / {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # WebSocket
    location /socket.io {
        proxy_pass http://websocket;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 86400;
    }
}
```

### Habilitar Sitio

```bash
ln -s /etc/nginx/sites-available/menud-backend /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

## SSL/TLS con Let's Encrypt

### Instalar Certbot

```bash
# Ubuntu/Debian
sudo apt install certbot python3-certbot-nginx

# CentOS/RHEL
sudo dnf install certbot python3-certbot-nginx
```

### Obtener Certificado

```bash
sudo certbot --nginx -d api.menud.pidrive.com.ar
```

### Renovación Automática

```bash
# Probar renovación
sudo certbot renew --dry-run

# Cron job automático
echo "0 0,12 * * * root python -c 'import random; import time; time.sleep(random.random() * 3600)' && sudo certbot renew -q" | sudo tee -a /etc/crontab > /dev/null
```

## Base de Datos

### Migraciones TypeORM

```bash
# Generar migración
npx typeorm migration:generate -n UserMigration -d src/data-source.ts

# Ejecutar migraciones
npx typeorm migration:run -d src/data-source.ts

# Revertir última migración
npx typeorm migration:revert -d src/data-source.ts
```

### Backup de PostgreSQL

```bash
# Backup completo
pg_dump -U menud_prod menud > backup_$(date +%Y%m%d_%H%M%S).sql

# Backup comprimido
pg_dump -U menud_prod menud | gzip > backup_$(date +%Y%m%d_%H%M%S).sql.gz

# Restaurar
psql -U menud_prod menud < backup.sql
```

### Backup Automático (Cron)

```bash
# Editar crontab
crontab -e

# Agregar (backup diario a las 3 AM)
0 3 * * * /usr/bin/pg_dump -U menud_prod menud | gzip > /backups/menud_$(date +\%Y\%m\%d).sql.gz
```

## Monitoreo

### Health Check Endpoint

```typescript
// Agregar en app.module.ts
@Module({
  imports: [
    TerminusModule.forRoot({
      healthIndicators: [
        async () =>
          new TypeOrmHealthIndicator({
            type: 'postgres',
            host: process.env.HOST,
            port: parseInt(process.env.PORT_DB),
            username: process.env.USERNAME_DB,
            password: process.env.PASSWORD_DB,
            database: process.env.DATABASE,
          }),
      ],
    }),
  ],
})
export class AppModule {}
```

### Métricas Prometheus

```typescript
// Métricas disponibles
- http_requests_total        → Total de peticiones
- http_request_duration      → Duración de peticiones
- websocket_connections      → Conexiones WebSocket activas
- orders_created_total       → Total de pedidos
- db_connections_active      → Conexiones activas a DB
```

### Alertas Recomendadas

```yaml
# alertmanager.yml
groups:
  - name: menud-backend
    rules:
      - alert: HighErrorRate
        expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.1
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "Alta tasa de errores HTTP"

      - alert: HighLatency
        expr: histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m])) > 1
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "Alta latencia en respuestas"

      - alert: ServiceDown
        expr: up{job="menud-backend"} == 0
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "Servicio caído"
```

## CI/CD con GitHub Actions

### Workflow de Despliegue

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
          cache: 'npm'
      - run: npm ci
      - run: npm run test
      - run: npm run lint

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Login to Docker Hub
        uses: docker/login-action@v2
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}
      - name: Build and push
        uses: docker/build-push-action@v4
        with:
          push: true
          tags: ${{ secrets.DOCKER_USERNAME }}/menud-backend:${{ github.sha }}

  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to production
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SERVER_SSH_KEY }}
          script: |
            cd /opt/menud-backend
            docker-compose pull
            docker-compose up -d
            docker system prune -f
```

## Seguridad en Producción

### Checklist de Seguridad

- [ ] Variables de entorno seguras (no en repositorio)
- [ ] JWT secrets únicos y fuertes
- [ ] HTTPS habilitado
- [ ] CORS configurado correctamente
- [ ] Rate limiting activo
- [ ] SQL injection prevenido (TypeORM)
- [ ] XSS prevenido (validación de inputs)
- [ ] Logs sanitizados (sin datos sensibles)
- [ ] Backup automatizado
- [ ] Monitoreo y alertas configurados

### Generar Secrets Seguros

```bash
# JWT Secret
openssl rand -base64 32

# O usar Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Rotación de Secrets

```bash
# Generar nuevo secret
NEW_SECRET=$(openssl rand -base64 32)

# Actualizar en .env
sed -i "s/JWT_SECRET=.*/JWT_SECRET=$NEW_SECRET/" .env

# Reiniciar servicios
docker-compose restart backend
```

## Troubleshooting

### Errores Comunes

| Error | Causa | Solución |
|-------|-------|----------|
| `ECONNREFUSED` | PostgreSQL no está corriendo | Verificar servicio de PostgreSQL |
| `EACCES: permission denied` | Permisos de archivos | `chmod -R 755 /app` |
| `ENOMEM` | Memoria insuficiente | Aumentar límites de memoria Docker |
| `ETIMEOUT` | Timeout de conexión | Verificar configuración de red |

### Logs de Producción

```bash
# Ver logs con Docker
docker logs menud-backend -f --tail 100

# Ver logs con PM2
pm2 logs menud-backend --lines 100

# Buscar errores
grep -i error /var/log/menud/*.log
```

### Rendimiento

```bash
# Monitorear recursos
docker stats menud-backend

# Profiling con Node.js
node --inspect dist/main.js

# Verificar conexiones de DB
SELECT count(*) FROM pg_stat_activity;
```

## Rollback

### Docker Rollback

```bash
# Listar versiones anteriores
docker images menud-backend

# Ejecutar versión anterior
docker run -d \
  --name menud-backend-rollback \
  --env-file .env \
  menud-backend:<previous-tag>
```

### PM2 Rollback

```bash
# Verificar historial
pm2 deploy production list

# Rollback
pm2 deploy production 0 revert 1
```

## Contacto Soporte

- **Email:** soporte@menud.com.ar
- **Slack:** #menud-devops
- **PagerDuty:** menud-production-alerts
