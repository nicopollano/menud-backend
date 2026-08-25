# MenuD Backend Architecture

## Overview

MenuD Backend is built on NestJS, a progressive Node.js framework for building efficient, scalable server-side applications. The architecture follows SOLID principles and uses a modular design pattern.

## Design Principles

1. **Modularity**: Each business domain has its own module
2. **Separation of Concerns**: Controllers handle HTTP, Services handle business logic, Repositories handle data access
3. **Dependency Injection**: NestJS IoC container manages all dependencies
4. **DTO Pattern**: Data Transfer Objects for input/output validation
5. **Guard Pattern**: Authentication and authorization through guards
6. **Interceptor Pattern**: Cross-cutting concerns handled by interceptors

## Module Structure

```
src/
├── main.ts                          # Application entry point
├── app.module.ts                    # Root module
├── common/                          # Shared infrastructure
│   ├── decorators/                  # Custom decorators
│   ├── enums/                       # Enumeration types
│   ├── guards/                      # Authentication/authorization guards
│   ├── interceptors/                # Request/response interceptors
│   ├── filters/                     # Exception filters
│   ├── middleware/                   # HTTP middleware
│   └── permissions/                 # Permission system
├── modules/
│   ├── auth/                        # Authentication & JWT
│   ├── bootstrap/                   # App initialization
│   ├── branch/                      # Restaurant branches
│   ├── business/                    # Business management
│   ├── category/                    # Menu categories
│   ├── subcategory/                 # Subcategories
│   ├── product/                     # Products/Items
│   ├── menu/                        # Menu management
│   ├── palette/                     # Color palettes
│   ├── order-product/               # Order items
│   ├── orders/                      # Order management
│   ├── member/                      # Team members
│   ├── permission/                  # Permission system
│   ├── plan/                        # Subscription plans
│   ├── subscription/                # User subscriptions
│   ├── promotion/                   # Promotions & discounts
│   ├── schedule/                    # Business hours
│   ├── tables/                      # Restaurant tables
│   ├── linkit/                      # Short links
│   ├── upload/                      # File uploads (ImageKit)
│   ├── email/                       # Email service (Nodemailer)
│   ├── users/                       # User management
│   ├── websocket/                   # Real-time notifications
│   ├── summary/                     # Dashboard summaries
│   ├── shared-palette/              # Shared color palettes
│   └── templates/                   # Email templates
└── config/                          # Configuration
```

## Module Components

Each module typically contains:

| Component | Responsibility |
|-----------|----------------|
| `*.module.ts` | Module definition, imports, providers |
| `*.controller.ts` | HTTP route handlers |
| `*.service.ts` | Business logic |
| `*.service.ts` | Data access (TypeORM repositories) |
| `dtos/` | Data Transfer Objects for validation |
| `entities/` | TypeORM entity definitions |
| `enums/` | Module-specific enumerations |
| `sub-modules/` | Nested modules |

## Request Flow

### HTTP Request

```
Client Request
     │
     ▼
┌─────────────────┐
│   Middleware     │  ← Prefix validation
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│     Guard       │  ← Authentication (JWT)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Interceptor   │  ← Request transformation
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Controller    │  ← Route handling
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│    Service      │  ← Business logic
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Repository    │  ← Database operations
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Interceptor   │  ← Response transformation
└────────┬────────┘
         │
         ▼
   Client Response
```

### WebSocket Connection

```
Client WebSocket
     │
     ▼
┌─────────────────┐
│  WsGuard        │  ← JWT validation
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  WsInterceptor   │  ← Message validation
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Gateway        │  ← Event handling
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Service        │  ← Business logic
└────────────────┘
```

## Entity Data Model

### Core Entities

```
User
├── id (UUID)
├── email
├── password (hashed)
├── firstName
├── lastName
├── role (USER, ADMIN)
└── business (relation)

Business
├── id (UUID)
├── name
├── slug (unique)
├── description
├── logo
├── owner (User)
├── plan (Plan)
└── branches (relation[])

Branch
├── id (UUID)
├── name
├── address
├── phone
├── business (Business)
├── menus (relation[])
├── members (relation[])
└── tables (relation[])

Menu
├── id (UUID)
├── name
├── description
├── isActive
├── branch (Branch)
├── categories (relation[])
└── palette (Palette)

Category
├── id (UUID)
├── name
├── description
├── order
├── menu (Menu)
└── subcategories (relation[])

Subcategory
├── id (UUID)
├── name
├── description
├── category (Category)
└── products (relation[])

Product
├── id (UUID)
├── name
├── description
├── price
├── image
├── isAvailable
├── subcategory (Subcategory)
└── orderProducts (relation[])

Order
├── id (UUID)
├── status (PENDING, CONFIRMED, PREPARING, READY, COMPLETED, CANCELLED)
├── total
├── branch (Branch)
├── table (Table)
├── orderProducts (relation[])
└── createdAt

OrderProduct
├── id (UUID)
├── quantity
├── price
├── order (Order)
└── product (Product)

Table
├── id (UUID)
├── number
├── capacity
├── isOccupied
├── branch (Branch)
└── orders (relation[])
```

### Supporting Entities

```
Plan
├── id (UUID)
├── name
├── price
├── features (JSON)
└── subscriptions (relation[])

Subscription
├── id (UUID)
├── status
├── startDate
├── endDate
├── user (User)
└── plan (Plan)

Member
├── id (UUID)
├── role
├── user (User)
├── branch (Branch)
└── permissions (relation[])

Permission
├── id (UUID)
├── name
├── description
└── member (Member)

Palette
├── id (UUID)
├── name
├── primary
├── secondary
├── accent
└── menu (Menu)

Promotion
├── id (UUID)
├── name
├── discount
├── startDate
├── endDate
├── isActive
└── branch (Branch)

Schedule
├── id (UUID)
├── dayOfWeek
├── openTime
├── closeTime
└── branch (Branch)
```

## Permissions System

### Permission Hierarchy

```
User (authenticated)
    │
    ├── Business Owner
    │   └── Full access to business and branches
    │
    ├── Branch Manager
    │   └── Access to assigned branch
    │
    ├── Staff Member
    │   └── Limited access based on permissions
    │
    └── Customer
        └── Read-only access to menus
```

### Available Permissions

| Module | Permissions |
|--------|-------------|
| Business | CREATE, READ, UPDATE, DELETE |
| Branch | CREATE, READ, UPDATE, DELETE |
| Menu | CREATE, READ, UPDATE, DELETE |
| Category | CREATE, READ, UPDATE, DELETE |
| Product | CREATE, READ, UPDATE, DELETE |
| Order | CREATE, READ, UPDATE, DELETE, STATUS |
| Member | CREATE, READ, UPDATE, DELETE |
| Table | CREATE, READ, UPDATE, DELETE |

### Guard Types

| Guard | Purpose |
|-------|---------|
| `PublicGuard` | Allows unauthenticated access |
| `RolesGuard` | Checks user roles |
| `BusinessGuard` | Validates business ownership |
| `BranchGuard` | Validates branch access |
| `MenuGuard` | Validates menu access |
| `PermissionGuard` | Checks specific permissions |
| `SubscriptionGuard` | Validates subscription status |
| `WsGuard` | WebSocket authentication |

## Design Patterns

### Repository Pattern

TypeORM repositories abstract database operations:

```typescript
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findById(id: string): Promise<User> {
    return this.userRepository.findOne({ where: { id } });
  }
}
```

### DTO Pattern

Data Transfer Objects ensure input validation:

```typescript
export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;
}
```

### Guard Pattern

Guards handle authentication and authorization:

```typescript
@Injectable()
export class BusinessGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const businessId = request.params.businessId;
    return user.businessId === businessId;
  }
}
```

### Interceptor Pattern

Interceptors handle cross-cutting concerns:

```typescript
@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(
      map(data => ({
        success: true,
        data,
        timestamp: new Date().toISOString(),
      })),
    );
  }
}
```

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment | development |
| `PORT` | HTTP port | 3500 |
| `WS_PORT` | WebSocket port | 3001 |
| `DB_HOST` | PostgreSQL host | localhost |
| `DB_PORT` | PostgreSQL port | 5432 |
| `DB_NAME` | Database name | menud |
| `DB_USER` | Database user | - |
| `DB_PASS` | Database password | - |
| `JWT_SECRET` | JWT signing key | - |
| `JWT_EXPIRES` | JWT expiration | 1d |
| `IMAGEKIT_PUBLIC_KEY` | ImageKit public key | - |
| `IMAGEKIT_PRIVATE_KEY` | ImageKit private key | - |
| `SMTP_HOST` | SMTP server | - |
| `SMTP_PORT` | SMTP port | 587 |
| `SMTP_USER` | SMTP username | - |
| `SMTP_PASS` | SMTP password | - |

### Configuration Files

- `ormconfig.ts` - TypeORM configuration
- `src/config/` - App configuration modules

## Logging

### Pino Logger

Structured JSON logging with Pino:

```typescript
// Custom log levels
{
  trace: 10,
  debug: 20,
  info: 30,
  warn: 40,
  error: 50,
  fatal: 60
}
```

### Log Destinations

- **Console**: Development output
- **File**: `logs/app.log` (production)
- **External**: Compatible with ELK stack

### Request Logging

Every request is logged with:
- Method, URL, status code
- Response time
- User ID (if authenticated)
- Request ID (for tracing)

## Metrics

### Prometheus Metrics

Available at `/metrics`:

| Metric | Type | Description |
|--------|------|-------------|
| `http_requests_total` | Counter | Total HTTP requests |
| `http_request_duration` | Histogram | Request duration |
| `http_requests_by_status` | Counter | Requests by status code |
| `websocket_connections` | Gauge | Active WebSocket connections |
| `database_query_duration` | Histogram | DB query duration |

### Health Check

Available at `/health`:

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

## Security

### Authentication Flow

```
1. Client sends credentials
2. Auth service validates
3. JWT token generated
4. Token sent to client
5. Client includes token in Authorization header
6. Guards validate token on each request
```

### Security Measures

- **JWT**: Stateless authentication with expiration
- **Password Hashing**: bcrypt with salt rounds
- **CORS**: Configured for allowed origins
- **Rate Limiting**: Protects against brute force
- **Input Validation**: DTOs with class-validator
- **SQL Injection**: Prevented by TypeORM parameterized queries
- **XSS**: Sanitized outputs
- **CSRF**: Token-based protection

## Scalability

### Horizontal Scaling

- Stateless services (JWT authentication)
- Database connection pooling
- WebSocket adapter (Redis for multi-instance)

### Caching Strategy

- Response caching with TTL
- Database query caching
- Static asset caching (CDN)

### Performance Optimizations

- Lazy loading of modules
- Database indexing on frequent queries
- Pagination for list endpoints
- Image optimization (ImageKit transformations)
- Gzip compression
