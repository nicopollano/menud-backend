# Arquitectura del Proyecto

## Visión General

MenuD Backend sigue la arquitectura modular de NestJS, inspirada en Angular, que promueve la separación de responsabilidades, la escalabilidad y la mantenibilidad del código.

## Principios de Diseño

### 1. Modularidad
Cada funcionalidad principal está encapsulada en su propio módulo, facilitando:
- Aislamiento de código
- Reutilización de componentes
- Testing independiente
- Desarrollo paralelo por equipos

### 2. Inversión de Dependencias
El framework utiliza dependency injection para:
- Desacoplar módulos entre sí
- Facilitar el mocking en tests
- Mejorar la testabilidad
- Permitir intercambio de implementaciones

### 3. Separación de Responsabilidades
Cada capa tiene un rol específico:
- **Controllers**: Manejan peticiones HTTP/WS y validación de entrada
- **Services**: Contienen la lógica de negocio
- **Entities**: Definen la estructura de datos
- **DTOs**: Validan y transforman datos de entrada/salida
- **Guards**: Controlan acceso y autorización
- **Interceptors**: Transforman respuestas y manejan cross-cutting concerns

## Estructura de un Módulo

Cada módulo sigue esta estructura estándar:

```
module/
├── module.module.ts        # Definición del módulo
├── module.controller.ts    # Endpoints HTTP
├── module.service.ts       # Lógica de negocio
├── dtos/                   # Data Transfer Objects
│   ├── create-*.dto.ts
│   ├── update-*.dto.ts
│   └── base-*.dto.ts
├── entities/               # Entidades TypeORM
│   └── *.entity.ts
├── subscribers/            # Eventos de TypeORM
│   └── *.subscriber.ts
└── tests/                  # Tests unitarios
    └── *.spec-module.ts
```

## Módulos Principales

### Authentication (`auth/`)
```
Responsabilidad: Autenticación y autorización de usuarios
Componentes:
  - auth.controller.ts   → Endpoints de login, register, refresh
  - auth.service.ts      → Lógica de JWT y validación
Dependencias: UsersService, JwtService
```

### Users (`users/`)
```
Responsabilidad: Gestión de usuarios del sistema
Componentes:
  - users.controller.ts  → CRUD de usuarios
  - users.service.ts     → Lógica de usuario
Entidades: User, UserPlan
```

### Business (`business/`)
```
Responsabilidad: Gestión de negocios/restaurantes
Componentes:
  - business.controller.ts → CRUD de negocios
  - business.service.ts    → Lógica de negocio
Entidades: Business, BusinessOwner
Relaciones: Un negocio tiene múltiples sucursales
```

### Branch (`branch/`)
```
Responsabilidad: Gestión de sucursales
Componentes:
  - branch.controller.ts → CRUD de sucursales
  - branch.service.ts    → Lógica de sucursal
Entidades: Branch
Relaciones: Una sucursal pertenece a un negocio
```

### Menu (`menu/`)
```
Responsabilidad: Gestión de menús digitales
Componentes:
  - menu.controller.ts → CRUD de menús
  - menu.service.ts    → Lógica de menú
Entidades: Menu
Relaciones: Un menú pertenece a una sucursal
```

### Product (`product/`)
```
Responsabilidad: Gestión de productos del menú
Componentes:
  - product.controller.ts → CRUD de productos
  - product.service.ts    → Lógica de producto
Entidades: Product
Relaciones: Un producto pertenece a una categoría
```

### Category (`category/`)
```
Responsabilidad: Categorización de productos
Componentes:
  - category.controller.ts → CRUD de categorías
  - category.service.ts    → Lógica de categoría
Entidades: Category
Relaciones: Una categoría tiene múltiples subcategorías
```

### Orders (`orders/`)
```
Responsabilidad: Sistema de pedidos
Componentes:
  - orders.controller.ts → Gestión de pedidos
  - orders.service.ts    → Lógica de pedidos
Entidades: Order
Relaciones: Un pedido tiene múltiples productos
```

### Order Product (`order-product/`)
```
Responsabilidad: Detalle de productos en pedidos
Componentes:
  - order-product.controller.ts → CRUD de detalle
  - order-product.service.ts    → Lógica de detalle
  - order-product.gateway.ts    → WebSocket para tiempo real
Entidades: OrderProduct
```

### Member (`member/`)
```
Responsabilidad: Gestión de miembros del equipo
Componentes:
  - member.controller.ts → Gestión de miembros
  - member.service.ts    → Lógica de miembros
Entidades: BranchMember
Relaciones: Un miembro puede pertenecer a múltiples sucursales
```

### Permission (`permission/`)
```
Responsabilidad: Sistema de permisos granular
Componentes:
  - permission.controller.ts → CRUD de permisos
  - permission.service.ts    → Lógica de permisos
Entidades: Permission
```

### Plan & Subscription
```
Responsabilidad: Planes de suscripción y facturación
Módulos:
  - plan/         → Planes disponibles
  - subscription/ → Suscripciones activas
```

### Promotion (`promotion/`)
```
Responsabilidad: Sistema de promociones
Componentes:
  - promotion.controller.ts → CRUD de promociones
  - promotion.service.ts    → Lógica de promociones
Entidades: Promotion
```

### Schedule (`schedule/`)
```
Responsabilidad: Horarios de atención
Componentes:
  - schedule.controller.ts → CRUD de horarios
  - schedule.service.ts    → Lógica de horarios
Entidades: Schedule
```

### Upload (`upload/`)
```
Responsabilidad: Subida y gestión de archivos
Componentes:
  - upload.controller.ts → Endpoints de subida
  - upload.service.ts    → Integración con ImageKit
```

### Email (`email/`)
```
Responsabilidad: Envío de correos electrónicos
Componentes:
  - email.service.ts → Integración con Nodemailer
Plantillas: Handlebars templates en templates/email/
```

### WebSocket (`websocket/`)
```
Responsabilidad: Comunicación en tiempo real
Componentes:
  - websocket.controller.ts → Manejo de eventos
  - websocket.service.ts    → Lógica de WebSocket
  - websocker.gateway.ts    → Gateway Socket.io
```

### Summary (`summary/`)
```
Responsabilidad: Estadísticas y métricas
Componentes:
  - summary.controller.ts → Endpoints de estadísticas
  - summary.service.ts    → Cálculos de métricas
```

## Flujo de una Petición HTTP

```
Cliente (Frontend/Móvil)
        │
        ▼
┌─────────────────────────────────────────────────────────┐
│                    NestJS Application                    │
├─────────────────────────────────────────────────────────┤
│  1. Middleware (Prefix)                                  │
│     └─ Añade prefijos de versión (/v1, /v2)            │
│                                                         │
│  2. Guards (Cadena de ejecución)                        │
│     ├─ PublicGuard     → Rutas públicas                │
│     ├─ RolesGuard      → Validación de roles           │
│     ├─ BusinessGuard   → Contexto de negocio           │
│     ├─ BranchGuard     → Contexto de sucursal          │
│     ├─ MenuGuard       → Acceso a menú                 │
│     ├─ PermissionGuard → Permisos granulares           │
│     └─ SubscriptionGuard → Estado de suscripción       │
│                                                         │
│  3. Interceptors                                        │
│     ├─ UserInterceptor  → Inyecta usuario actual       │
│     ├─ ResponseInterceptor → Formatea respuesta        │
│     └─ ErrorsInterceptor → Maneja errores               │
│                                                         │
│  4. Controller                                          │
│     └─ Valida DTOs con class-validator                 │
│                                                         │
│  5. Service                                             │
│     └─ Ejecuta lógica de negocio                       │
│                                                         │
│  6. TypeORM Repository                                  │
│     └─ Consulta/actualiza base de datos                │
│                                                         │
│  7. Filters                                             │
│     └─ HttpExceptionFilter → Maneja errores HTTP       │
└─────────────────────────────────────────────────────────┘
        │
        ▼
    Respuesta JSON
```

## Flujo de una Petición WebSocket

```
Cliente
  │
  ▼
┌─────────────────────────────────────────┐
│         Socket.io Gateway               │
├─────────────────────────────────────────┤
│  1. Conexión                           │
│     └─ Valida token JWT                │
│                                         │
│  2. Autenticación                      │
│     └─ WsJwtGuard valida credenciales  │
│                                         │
│  3. Interceptor                        │
│     └─ WebSocketInterceptor procesa    │
│                                         │
│  4. Handler                            │
│     └─ Procesa evento específico       │
│                                         │
│  5. Respuesta/Notificación             │
│     └─ Emite evento al cliente         │
└─────────────────────────────────────────┘
```

## Modelo de Datos (Entidades Principales)

```
┌─────────────────┐
│      User       │
├─────────────────┤
│ id              │
│ email           │
│ password        │
│ name            │
│ globalRole      │
└────────┬────────┘
         │
         │ 1:N
         ▼
┌─────────────────┐
│   Business      │
├─────────────────┤
│ id              │
│ businessName    │
│ slug            │
│ description     │
└────────┬────────┘
         │
         │ 1:N
         ▼
┌─────────────────┐
│     Branch      │
├─────────────────┤
│ id              │
│ branchName      │
│ address         │
│ phone           │
└────────┬────────┘
         │
         ├─────────────────┬─────────────────┐
         │ 1:N             │ 1:N             │ 1:N
         ▼                 ▼                 ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│      Menu       │ │    Member       │ │    Table        │
├─────────────────┤ ├─────────────────┤ ├─────────────────┤
│ id              │ │ id              │ │ id              │
│ name            │ │ userId          │ │ nroMesa         │
│ status          │ │ branchId        │ │ enabled         │
└────────┬────────┘ │ role            │ └─────────────────┘
         │          └─────────────────┘
         │ 1:N
         ▼
┌─────────────────┐
│    Category     │
├─────────────────┤
│ id              │
│ name            │
│ order           │
└────────┬────────┘
         │
         │ 1:N
         ▼
┌─────────────────┐
│   Subcategory   │
├─────────────────┤
│ id              │
│ name            │
│ categoryId      │
└────────┬────────┘
         │
         │ 1:N
         ▼
┌─────────────────┐
│     Product     │
├─────────────────┤
│ id              │
│ name            │
│ description     │
│ price           │
│ image           │
│ subcategoryId   │
└─────────────────┘
```

## Sistema de Permisos

### Estructura de Permisos

```typescript
// Cada permiso define:
{
  module: string,      // Módulo al que pertenece
  action: string,      // Acción permitida (CREATE, READ, UPDATE, DELETE)
  roles: string[]      // Roles que tienen este permiso
}
```

### Ejemplo de Permisos por Módulo

```typescript
// Business Module
{
  module: 'business',
  permissions: [
    { action: 'CREATE', roles: ['SUPER_ADMIN'] },
    { action: 'READ',   roles: ['SUPER_ADMIN', 'ADMIN'] },
    { action: 'UPDATE', roles: ['SUPER_ADMIN', 'ADMIN'] },
    { action: 'DELETE', roles: ['SUPER_ADMIN'] }
  ]
}

// Branch Module
{
  module: 'branch',
  permissions: [
    { action: 'CREATE', roles: ['SUPER_ADMIN', 'ADMIN'] },
    { action: 'READ',   roles: ['SUPER_ADMIN', 'ADMIN', 'MANAGER'] },
    { action: 'UPDATE', roles: ['SUPER_ADMIN', 'ADMIN', 'MANAGER'] },
    { action: 'DELETE', roles: ['SUPER_ADMIN', 'ADMIN'] }
  ]
}
```

## Patrones de Diseño Utilizados

### 1. Repository Pattern
TypeORM utiliza repositories para abstraer el acceso a datos:

```typescript
@InjectRepository(Product)
private readonly productRepository: Repository<Product>
```

### 2. DTO Pattern
Data Transfer Objects para validación y transformación:

```typescript
export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @Min(0)
  price: number;
}
```

### 3. Guard Pattern
Guards para control de acceso:

```typescript
@Injectable()
export class RolesGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    // Lógica de autorización
  }
}
```

### 4. Interceptor Pattern
Interceptors para cross-cutting concerns:

```typescript
@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    // Transformar respuesta
  }
}
```

### 5. Subscriber Pattern
Subscribers para eventos de base de datos:

```typescript
@EventSubscriber()
export class ProductSubscriber implements EntitySubscriberInterface<Product> {
  afterInsert(event: InsertEvent<Product>) {
    // Lógica después de insertar
  }
}
```

## Configuración Global

### Variables de Entorno

El proyecto utiliza `@nestjs/config` para manejar variables de entorno:

```typescript
// config.ts
export const config = {
  database: {
    host: process.env.HOST,
    port: parseInt(process.env.PORT_DB),
    username: process.env.USERNAME_DB,
    password: process.env.PASSWORD_DB,
    database: process.env.DATABASE,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.TOKENDURATION,
  },
  // ...
};
```

### TypeORM Configuration

```typescript
TypeOrmModule.forRoot({
  type: 'postgres',
  host: process.env.HOST,
  port: parseInt(process.env.PORT_DB),
  username: process.env.USERNAME_DB,
  password: process.env.PASSWORD_DB,
  database: process.env.DATABASE,
  autoLoadEntities: true,
  synchronize: true, // Solo en desarrollo
})
```

## Logging

El proyecto utiliza Pino para logging estructurado:

```typescript
// Configuración en main.ts
const { Logger: PinoLogger } = await import('nestjs-pino');
const pinoLogger = app.get(PinoLogger);
app.useLogger(pinoLogger);
```

### Niveles de Log

- `error` - Errores críticos
- `warn` - Advertencias
- `info` - Información general
- `debug` - Información de depuración
- `trace` - Traza detallada

## Métricas

El proyecto expone métricas Prometheus mediante `prom-client`:

```typescript
// Métricas disponibles
- http_requests_total        → Total de peticiones HTTP
- http_request_duration      → Duración de peticiones
- websocket_connections      → Conexiones WebSocket activas
- orders_created_total       → Total de pedidos creados
```

## Seguridad

### Autenticación JWT

```typescript
// Estructura del token
{
  sub: userId,
  email: user.email,
  role: user.globalRole,
  iat: timestamp,
  exp: timestamp
}
```

### Rate Limiting

Implementado a nivel de aplicación para prevenir abusos.

### CORS

Configurado para permitir orígenes específicos:

```typescript
app.enableCors({
  origin: '*',
  credentials: true,
});
```

## Escalabilidad

### Horizontal
- Stateless API (sin sesión en servidor)
- Load balancing detrás de nginx/HAProxy
- WebSocket con Redis adapter (futuro)

### Vertical
- Modularidad para desacoplamiento
- Connection pooling de PostgreSQL
- Cache de consultas frecuentes (futuro)

## evolución de la Arquitectura

### Fase Actual (v2.x)
- Arquitectura modular monolítica
- JWT para autenticación
- WebSockets para tiempo real
- TypeORM con PostgreSQL

### Fase Futura (v3.x)
- Microservicios para módulos independientes
- Redis para cache y sesiones
- GraphQL como alternativa a REST
- Event-driven architecture con RabbitMQ/Kafka
