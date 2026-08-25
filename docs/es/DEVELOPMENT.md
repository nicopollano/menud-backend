# Guía de Desarrollo

## Requisitos Previos

### Software Necesario

| Software | Versión Mínima | Versión Recomendada | Propósito |
|----------|----------------|---------------------|-----------|
| Node.js | 18.0.0 | 20 LTS | Runtime de JavaScript |
| npm | 9.0.0 | 10+ | Gestor de paquetes |
| PostgreSQL | 14 | 16 | Base de datos |
| Git | 2.30 | 2.40+ | Control de versiones |
| Docker | 20.10 | 24+ | Containerización (opcional) |

### Herramientas Recomendadas

- **IDE:** Visual Studio Code
- **Extensiones VSCode:**
  - ESLint
  - Prettier
  - Docker
  - PostgreSQL
  - NestJS Language Service
  - Error Lens

## Configuración del Entorno de Desarrollo

### 1. Instalar Dependencias

```bash
# Clonar repositorio
git clone https://github.com/nicolas-pollano/menud-backend.git
cd menud-backend

# Instalar dependencias
npm install
```

### 2. Configurar Variables de Entorno

```bash
# Copiar archivo de ejemplo
cp .env.example .env
```

Editar `.env` con tus configuraciones:

```env
# Base de datos (usar Docker o PostgreSQL local)
HOST=localhost
PORT_DB=5432
USERNAME_DB=menud_dev
PASSWORD_DB=menud_dev123
DATABASE=menud
DB_SSL=false

# Servidor
PORT=3500

# JWT (generar secrets para producción)
TOKENDURATION=30
REFRESHTOKENDURATION=60
TOKENRESETPASSWORDDURATION=15

# WebSocket
WEBSOCKET_PORT=3001

# Entorno
STAGE=DEVELOP

# Email (opcional en desarrollo)
GMAIL_USER=
GMAIL_APP_PASSWORD=

# ImageKit (opcional en desarrollo)
IMAGEKIT_PUBLIC_KEY=
IMAGEKIT_PRIVATE_KEY=
IMAGEKIT_URL_ENDPOINT=

# Dominio
DOMAIN=http://localhost:3500
```

### 3. Configurar Base de Datos

#### Opción A: Docker (Recomendado)

```bash
# Iniciar PostgreSQL en Docker
docker run -d \
  --name menud-postgres-dev \
  -e POSTGRES_DB=menud \
  -e POSTGRES_USER=menud_dev \
  -e POSTGRES_PASSWORD=menud_dev123 \
  -p 5432:5432 \
  postgres:14-alpine
```

#### Opción B: PostgreSQL Local

1. Crear base de datos:
```sql
CREATE DATABASE menud;
CREATE USER menud_dev WITH PASSWORD 'menud_dev123';
GRANT ALL PRIVILEGES ON DATABASE menud TO menud_dev;
```

2. Conectar a la base de datos y crear extensiones:
```sql
\c menud
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

### 4. Iniciar el Servidor

```bash
# Modo desarrollo (con hot-reload)
npm run start:dev
```

El servidor estará disponible en:
- **API:** http://localhost:3500
- **Swagger:** http://localhost:3500/api-docs
- **WebSocket:** ws://localhost:3001

## Estructura del Proyecto

```
menud-backend/
├── src/
│   ├── [module]/           # Módulos de la aplicación
│   │   ├── *.module.ts     # Definición del módulo
│   │   ├── *.controller.ts # Endpoints HTTP
│   │   ├── *.service.ts    # Lógica de negocio
│   │   ├── dtos/           # Data Transfer Objects
│   │   ├── entities/       # Entidades TypeORM
│   │   ├── subscribers/    # Eventos de base de datos
│   │   └── tests/          # Tests unitarios
│   ├── common/             # Código compartido
│   ├── config.ts           # Configuración
│   ├── main.ts             # Punto de entrada
│   └── app.module.ts       # Módulo raíz
├── docs/                   # Documentación
├── scripts/                # Scripts de utilidad
├── test/                   # Tests e2e
├── .env                    # Variables de entorno
├── .env.example            # Ejemplo de variables
├── tsconfig.json           # Configuración TypeScript
├── nest-cli.json           # Configuración NestJS
├── biome.json              # Configuración Biome
└── package.json            # Dependencias
```

## Comandos de Desarrollo

### Servidor

```bash
# Iniciar en modo desarrollo (hot-reload)
npm run start:dev

# Iniciar en modo debug
npm run start:debug

# Build y iniciar
npm run buildstart
```

### Code Quality

```bash
# Ejecutar linter
npm run lint

# Formatear código
npm run format

# Verificar formato (sin modificar)
npx prettier --check "src/**/*.ts"
```

### Testing

```bash
# Tests unitarios
npm run test

# Tests en watch mode
npm run test:watch

# Tests con cobertura
npm run test:cov

# Tests end-to-end
npm run test:e2e
```

## Convenciones de Código

### Naming Conventions

| Tipo | Convención | Ejemplo |
|------|------------|---------|
| Archivos de módulo | `kebab-case` | `user.controller.ts` |
| Archivos de test | `*.spec.ts` | `user.service.spec.ts` |
| Clases | `PascalCase` | `UserService` |
| Interfaces | `PascalCase` | `IUserService` |
| Enums | `PascalCase` | `UserRole` |
| Constantes | `SCREAMING_SNAKE` | `MAX_RETRY_COUNT` |
| Variables/Funciones | `camelCase` | `getUserById` |
| DTOs | `PascalCase` + `Dto` | `CreateUserDto` |
| Entidades | `PascalCase` + `Entity` | `UserEntity` |

### Estructura de un Módulo

```typescript
// user.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
```

### Estructura de un Controller

```typescript
// user.controller.ts
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todos los usuarios' })
  async findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener usuario por ID' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Crear usuario' })
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar usuario' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar usuario' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.userService.remove(id);
  }
}
```

### Estructura de un Service

```typescript
// user.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    Object.assign(user, updateUserDto);
    return this.userRepository.save(user);
  }

  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
  }
}
```

### Estructura de un DTO

```typescript
// create-user.dto.ts
import { IsString, IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'Juan Pérez' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'juan@ejemplo.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'MiPassword123!' })
  @IsString()
  @MinLength(8)
  password: string;
}
```

### Estructura de una Entidad

```typescript
// user.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: 'USER' })
  globalRole: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

## debugging

### Debug con VSCode

1. Crear archivo `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug NestJS",
      "type": "node",
      "request": "launch",
      "runtimeExecutable": "${workspaceFolder}/node_modules/.bin/nest",
      "runtimeArgs": ["start", "--debug", "--watch"],
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen"
    }
  ]
}
```

2. Presionar F5 para iniciar debug

### Debug con Chrome DevTools

```bash
# Iniciar con inspect
npm run start:debug
```

Abrir Chrome y navegar a:
```
chrome://inspect
```

### Logs

El proyecto usa Pino para logging estructurado. En desarrollo, los logs se muestran en consola con formato legible.

```typescript
// En cualquier servicio
import { Logger } from '@nestjs/common';

@Injectable()
export class MyService {
  private readonly logger = new Logger(MyService.name);

  myMethod() {
    this.logger.log('Mensaje informativo');
    this.logger.warn('Advertencia');
    this.logger.error('Error', error.stack);
    this.logger.debug('Debug info');
  }
}
```

## Testing

### Test Unitario de Service

```typescript
// user.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { User } from './entities/user.entity';

describe('UserService', () => {
  let service: UserService;
  let repository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            find: jest.fn(),
            findOneBy: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const users = [{ id: 1, name: 'Test' }];
      jest.spyOn(repository, 'find').mockResolvedValue(users as User[]);

      expect(await service.findAll()).toEqual(users);
    });
  });
});
```

### Test de Controller

```typescript
// user.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return users', async () => {
      const users = [{ id: 1, name: 'Test' }];
      jest.spyOn(service, 'findAll').mockResolvedValue(users as any);

      expect(await controller.findAll()).toEqual(users);
    });
  });
});
```

### Test E2E

```typescript
// user.e2e-spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Users (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/users (GET)', () => {
    return request(app.getHttpServer())
      .get('/users')
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBe(true);
      });
  });
});
```

## Git Workflow

### Branches

- `main` - Producción estable
- `develop` - Desarrollo integrado
- `feature/*` - Nuevas funcionalidades
- `bugfix/*` - Corrección de bugs
- `hotfix/*` - Correcciones urgentes
- `release/*` - Preparación de release

### Convenciones de Commits

```
<tipo>(<alcance>): <descripción>

[opcional-cuerpo]

[opcional-footer]
```

**Tipos:**
- `feat` - Nueva funcionalidad
- `fix` - Corrección de bug
- `docs` - Documentación
- `style` - Formato (no afecta código)
- `refactor` - Refactorización
- `test` - Tests
- `chore` - Tareas de mantenimiento

**Ejemplos:**
```
feat(users): add email verification
fix(orders): calculate total correctly
docs(api): update authentication section
refactor(product): extract image upload logic
```

### Flujo de Trabajo

1. Crear rama desde `develop`:
```bash
git checkout develop
git pull origin develop
git checkout -b feature/nueva-funcionalidad
```

2. Hacer cambios y commits:
```bash
git add .
git commit -m "feat(module): descripción"
```

3. Push y crear PR:
```bash
git push origin feature/nueva-funcionalidad
```

4. Crear Pull Request en GitHub hacia `develop`

5. Después de review, merge a `develop`

##performance

### Monitoring

El proyecto expone métricas Prometheus:

```typescript
// Métricas disponibles
- http_requests_total
- http_request_duration_seconds
- websocket_connections_active
- orders_created_total
```

### Profiling

```bash
# Node.js profiling
node --inspect dist/main.js

# CPU profiling
node --cpu-prof dist/main.js
```

### Query Performance

TypeORM logging en desarrollo:

```typescript
// En app.module.ts
TypeOrmModule.forRoot({
  // ...
  logging: ['query', 'error'],
})
```

## Solución de Problemas Comunes

### Error: "Cannot find module"

```bash
# Limpiar cache
rm -rf node_modules
npm install
```

### Error: "Connection refused" (PostgreSQL)

```bash
# Verificar que PostgreSQL está corriendo
docker ps | grep postgres

# O verificar servicio local
sudo systemctl status postgresql
```

### Error: "Port already in use"

```bash
# Encontrar proceso usando el puerto
lsof -i :3500

# Matar proceso
kill -9 <PID>
```

### Error de TypeScript

```bash
# Limpiar build
rm -rf dist
npm run build
```

### Error de Linter

```bash
# Auto-fix
npm run lint

# Verificar errores
npx eslint src/**/*.ts
```

## Recursos

- [NestJS Documentation](https://docs.nestjs.com/)
- [TypeORM Documentation](https://typeorm.io/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
