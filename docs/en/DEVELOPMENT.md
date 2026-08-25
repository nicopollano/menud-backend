# Development Guide

## Table of Contents

- [Prerequisites](#prerequisites)
- [Environment Setup](#environment-setup)
- [Database Setup](#database-setup)
- [Project Structure](#project-structure)
- [Development Commands](#development-commands)
- [Code Conventions](#code-conventions)
- [Testing](#testing)
- [Git Workflow](#git-workflow)

---

## Prerequisites

| Software | Version | Purpose |
|----------|---------|---------|
| Node.js | 18+ (recommended: 20 LTS) | Runtime |
| npm | 9+ | Package manager |
| PostgreSQL | 14+ | Database |
| Docker | latest (optional) | Containerization |
| Git | 2.30+ | Version control |
| VSCode | latest (recommended) | IDE |

---

## Environment Setup

### 1. Clone Repository

```bash
git clone https://github.com/nicolas-pollano/menud-backend.git
cd menud-backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Application
NODE_ENV=development
PORT=3500
WS_PORT=3001

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=menud
DB_USER=your_user
DB_PASS=your_password

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES=1d

# ImageKit (for image uploads)
IMAGEKIT_PUBLIC_KEY=your_public_key
IMAGEKIT_PRIVATE_KEY=your_private_key
IMAGEKIT_URL_ENDPOINT=your_url_endpoint

# Email (Nodemailer)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

---

## Database Setup

### Option 1: Docker (Recommended)

```bash
docker run -d \
  --name menud-postgres \
  -e POSTGRES_DB=menud \
  -e POSTGRES_USER=menud_user \
  -e POSTGRES_PASSWORD=menud_password \
  -p 5432:5432 \
  postgres:14-alpine
```

### Option 2: Local PostgreSQL

1. Install PostgreSQL 14+
2. Create database:
   ```sql
   CREATE DATABASE menud;
   CREATE USER menud_user WITH PASSWORD 'menud_password';
   GRANT ALL PRIVILEGES ON DATABASE menud TO menud_user;
   ```
3. Run migrations:
   ```bash
   npm run typeorm:migration:run
   ```

### Database Commands

```bash
# Generate migration
npm run typeorm:migration:generate -- src/migrations/MigrationName

# Run migrations
npm run typeorm:migration:run

# Revert last migration
npm run typeorm:migration:revert

# Sync schema (development only)
npm run typeorm:schema:sync
```

---

## Project Structure

```
menud-backend/
├── src/
│   ├── main.ts                    # Entry point
│   ├── app.module.ts              # Root module
│   ├── common/                    # Shared infrastructure
│   │   ├── decorators/            # Custom decorators
│   │   ├── enums/                 # Enumerations
│   │   ├── guards/                # Auth guards
│   │   ├── interceptors/          # Request/response interceptors
│   │   ├── filters/               # Exception filters
│   │   ├── middleware/             # HTTP middleware
│   │   └── permissions/           # Permission system
│   ├── modules/                   # Business modules
│   │   ├── auth/
│   │   ├── users/
│   │   ├── business/
│   │   ├── branch/
│   │   ├── menu/
│   │   ├── category/
│   │   ├── subcategory/
│   │   ├── product/
│   │   ├── orders/
│   │   ├── order-product/
│   │   ├── member/
│   │   ├── permission/
│   │   ├── plan/
│   │   ├── subscription/
│   │   ├── promotion/
│   │   ├── schedule/
│   │   ├── tables/
│   │   ├── linkit/
│   │   ├── upload/
│   │   ├── email/
│   │   ├── websocket/
│   │   ├── summary/
│   │   ├── palette/
│   │   ├── shared-palette/
│   │   └── templates/
│   └── config/                    # Configuration
├── scripts/                       # Docker init scripts
├── test/                          # E2E tests
├── documentation/                 # Legacy docs
├── docs/                          # Current documentation
│   ├── en/                        # English docs
│   └── es/                        # Spanish docs
├── docker-compose.yml
├── Dockerfile
├── package.json
├── tsconfig.json
└── .env.example
```

---

## Development Commands

### Start Server

```bash
# Development mode (with hot reload)
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

### Build

```bash
# Build for production
npm run build

# Watch mode
npm run build -- --watch
```

### Database

```bash
# Run migrations
npm run typeorm:migration:run

# Revert migration
npm run typeorm:migration:revert

# Generate migration
npm run typeorm:migration:generate -- MigrationName
```

### Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov

# Watch mode
npm run test:watch
```

### Code Quality

```bash
# Lint
npm run lint

# Fix lint issues
npm run lint -- --fix

# Format (if prettier configured)
npx prettier --write "src/**/*.ts"
```

---

## Code Conventions

### Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Files | `kebab-case` | `user.controller.ts` |
| Classes | `PascalCase` | `UserService` |
| Interfaces | `PascalCase` | `IUserService` |
| Variables | `camelCase` | `userId` |
| Functions | `camelCase` | `getUserById` |
| Constants | `SCREAMING_SNAKE` | `MAX_RETRY_COUNT` |
| Enums | `PascalCase` | `UserRole` |
| DTOs | `PascalCase` + `Dto` | `CreateUserDto` |

### Module Template

```typescript
// module.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Entity } from './entities/entity.entity';
import { Service } from './service.service';
import { Controller } from './controller.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Entity])],
  controllers: [Controller],
  providers: [Service],
  exports: [Service],
})
export class FeatureModule {}
```

### Controller Template

```typescript
import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Service } from './service.service';
import { CreateDto } from './dtos/create.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Feature')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('feature')
export class Controller {
  constructor(private readonly service: Service) {}

  @Get()
  @ApiOperation({ summary: 'Get all items' })
  async findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get item by ID' })
  async findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create item' })
  async create(@Body() createDto: CreateDto) {
    return this.service.create(createDto);
  }
}
```

### Service Template

```typescript
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Entity } from './entities/entity.entity';
import { CreateDto } from './dtos/create.dto';

@Injectable()
export class Service {
  constructor(
    @InjectRepository(Entity)
    private repository: Repository<Entity>,
  ) {}

  async findAll(): Promise<Entity[]> {
    return this.repository.find();
  }

  async findOne(id: string): Promise<Entity> {
    const entity = await this.repository.findOne({ where: { id } });
    if (!entity) {
      throw new NotFoundException(`Entity with ID ${id} not found`);
    }
    return entity;
  }

  async create(createDto: CreateDto): Promise<Entity> {
    const entity = this.repository.create(createDto);
    return this.repository.save(entity);
  }
}
```

### DTO Template

```typescript
import { IsString, IsEmail, IsOptional, IsNumber, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDto {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @MinLength(2)
  name: string;

  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({ example: 'Additional info' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 100 })
  @IsNumber()
  price: number;
}
```

### Entity Template

```typescript
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('table_name')
export class EntityName {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

---

## Testing

### Unit Tests

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { Service } from './service.service';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('Service', () => {
  let service: Service;
  let repository: Repository<Entity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        Service,
        {
          provide: getRepositoryToken(Entity),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<Service>(Service);
    repository = module.get<Repository<Entity>>(getRepositoryToken(Entity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of entities', async () => {
      const result = [{ id: '1', name: 'Test' }];
      jest.spyOn(repository, 'find').mockResolvedValue(result);
      expect(await service.findAll()).toEqual(result);
    });
  });
});
```

### E2E Tests

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/health (GET)', () => {
    return request(app.getHttpServer())
      .get('/health')
      .expect(200)
      .expect((res) => {
        expect(res.body.status).toBe('ok');
      });
  });
});
```

### Running Tests

```bash
# All unit tests
npm run test

# Specific test file
npm run test -- --testFile=user.service.spec.ts

# E2E tests
npm run test:e2e

# Coverage report
npm run test:cov
# Open: coverage/lcov-report/index.html
```

---

## Git Workflow

### Branch Strategy

```
main (production)
  │
  ├── develop (integration)
  │     │
  │     ├── feature/add-promotions
  │     ├── feature/real-time-orders
  │     └── fix/order-calculation
  │
  └── hotfix/security-patch
```

### Commit Convention

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting (no logic change)
- `refactor`: Code restructuring
- `test`: Adding tests
- `chore`: Maintenance tasks
- `perf`: Performance improvement

**Examples:**
```
feat(orders): add real-time notifications via WebSocket
fix(auth): prevent token reuse after logout
docs(api): update authentication endpoints
```

---

## Debugging

### VSCode Launch Configuration

Create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug NestJS",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/src/main.ts",
      "preLaunchTask": "tsc: build - tsconfig.json",
      "restart": true,
      "console": "integratedTerminal",
      "env": {
        "NODE_ENV": "development"
      }
    }
  ]
}
```

### Console Logging

```typescript
// In service/controller
this.logger.debug('Debug message', { context: 'ServiceName' });
this.logger.log('Info message', { context: 'ServiceName' });
this.logger.warn('Warning message', { context: 'ServiceName' });
this.logger.error('Error message', { context: 'ServiceName' });
```

---

## Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| Port in use | Change PORT in .env or kill process: `lsof -i :3500` |
| DB connection refused | Check PostgreSQL is running and credentials are correct |
| JWT invalid | Ensure JWT_SECRET is set and token is not expired |
| Migration errors | Run `npm run typeorm:migration:revert` and retry |
| Module not found | Check imports in module file |

### Reset Development Environment

```bash
# Stop containers
docker-compose down

# Remove volumes
docker-compose down -v

# Rebuild
docker-compose up -d

# Run migrations
npm run typeorm:migration:run

# Seed data (if available)
npm run seed
```

---

## IDE Setup (VSCode)

### Recommended Extensions

- ESLint
- Prettier
- GitLens
- Docker
- PostgreSQL
- REST Client

### Settings

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.preferences.importModuleSpecifier": "relative"
}
```
