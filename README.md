

<h1 align="center">MenuD Backend</h1>

<p align="center">
  Plataforma de gestión de menús digitales para restaurantes
</p>

<p align="center">
  <a href="./docs/es/">🇪🇸 Español</a> | <a href="./docs/en/">🇺🇸 English</a>
</p>

<p align="center">
  <a href="https://nestjs.com/" target="_blank"><img src="https://img.shields.io/badge/NestJS-v11-red?logo=nestjs" alt="NestJS" /></a>
  <a href="https://www.typescriptlang.org/" target="_blank"><img src="https://img.shields.io/badge/TypeScript-v5-blue?logo=typescript" alt="TypeScript" /></a>
  <a href="https://www.postgresql.org/" target="_blank"><img src="https://img.shields.io/badge/PostgreSQL-v14-336791?logo=postgresql" alt="PostgreSQL" /></a>
  <a href="https://github.com/nicolas-pollano/menud-backend/blob/main/LICENSE" target="_blank"><img src="https://img.shields.io/badge/License-UNLICENSED-lightgrey" alt="License" /></a>
</p>

---

## Descripción

**MenuD Backend** es una plataforma completa de gestión de menús digitales diseñada para restaurantes. Permite a los establecimientos crear, administrar y compartir sus menús de forma digital, gestionar pedidos en tiempo real, controlar inventarios y analizar ventas.

### Características Principales

- **Gestión de Menús Digitales** - Creación y administración de menús con categorías, subcategorías y productos
- **Pedidos en Tiempo Real** - Sistema de pedidos con WebSockets (Socket.io) para actualizaciones instantáneas
- **Multi-Sucursal** - Soporte para múltiples sucursales por negocio
- **Gestión de Personal** - Sistema de miembros con roles y permisos granulares
- **Promociones y Horarios** - Programación de promociones y horarios de atención
- **Dashboard Analítico** - Resumen de ventas, pedidos y métricas en tiempo real
- **Notificaciones** - Sistema de notificaciones push para nuevos pedidos
- **API RESTful** - API completa con documentación Swagger interactiva

## Arquitectura

```
src/
├── auth/              # Autenticación y autorización JWT
├── bootstrap/         # Configuración inicial del sistema
├── branch/            # Gestión de sucursales
├── business/          # Gestión de negocios
├── category/          # Gestión de categorías de productos
├── subcategory/       # Gestión de subcategorías
├── product/           # Gestión de productos
├── menu/              # Gestión de menús
├── palette/           # Paletas de colores para menús
├── orders/            # Sistema de pedidos
├── order-product/     # Detalle de productos en pedidos
├── member/            # Gestión de miembros del equipo
├── permission/        # Sistema de permisos
├── plan/              # Planes de suscripción
├── subscription/      # Suscripciones de usuarios
├── promotion/         # Sistema de promociones
├── schedule/          # Horarios de atención
├── tables/            # Gestión de mesas
├── linkit/            # Enlaces cortos para menús
├── upload/            # Subida de archivos (ImageKit)
├── email/             # Servicio de email (Nodemailer)
├── users/             # Gestión de usuarios
├── websocket/         # Servidor WebSocket
├── summary/           # Resumen y estadísticas
├── shared-palette/    # Paletas compartidas
├── templates/         # Plantillas de email (Handlebars)
├── common/            # Utilidades compartidas
│   ├── decorators/    # Decoradores personalizados
│   ├── guards/        # Guards de autenticación
│   ├── interceptors/  # Interceptores de respuesta
│   ├── filters/       # Filtros de excepciones
│   ├── enums/         # Enums del dominio
│   ├── permissions/   # Definición de permisos
│   ├── tools/         # Herramientas utilitarias
│   └── services/      # Servicios compartidos
├── config.ts          # Configuración global
├── main.ts            # Punto de entrada
└── tracing.ts         # OpenTelemetry tracing
```

## Tecnologías

| Categoría | Tecnología | Propósito |
|-----------|------------|-----------|
| **Framework** | NestJS v11 | Framework backend escalable |
| **Lenguaje** | TypeScript v5 | Type safety y productividad |
| **Base de Datos** | PostgreSQL v14 | Base de datos relacional |
| **ORM** | TypeORM | Mapeo objeto-relacional |
| **Autenticación** | JWT (@nestjs/jwt) | Tokens de acceso |
| **WebSockets** | Socket.io | Comunicación en tiempo real |
| **Validación** | class-validator | Validación de DTOs |
| **Documentación** | Swagger (@nestjs/swagger) | API docs interactiva |
| **Email** | Nodemailer + Mailgun | Envío de correos |
| **Almacenamiento** | ImageKit | Almacenamiento de imágenes |
| **Logging** | Pino (nestjs-pino) | Logging estructurado |
| **Métricas** | prom-client | Métricas Prometheus |
| **Containerización** | Docker | Despliegue consistente |

## Requisitos Previos

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0 o **Bun**
- **PostgreSQL** >= 14
- **Docker** (opcional, para despliegue)

## Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/nicolas-pollano/menud-backend.git
cd menud-backend
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

```bash
cp .env.example .env
```

Edita el archivo `.env` con tus configuraciones:

```env
# Base de datos
HOST=localhost
PORT_DB=5432
USERNAME_DB=tu_usuario
PASSWORD_DB=tu_password
DATABASE=menud
DB_SSL=false

# Servidor
PORT=3000

# JWT
TOKENDURATION=30
REFRESHTOKENDURATION=60
TOKENRESETPASSWORDDURATION=15

# WebSocket
WEBSOCKET_PORT=3001

# Entorno
STAGE=DEVELOP

# Email (Gmail)
GMAIL_USER=tu-email@gmail.com
GMAIL_APP_PASSWORD=tu-password-app

# ImageKit
IMAGEKIT_PUBLIC_KEY=tu-public-key
IMAGEKIT_PRIVATE_KEY=tu-private-key
IMAGEKIT_URL_ENDPOINT=tu-url-endpoint

# Dominio
DOMAIN=https://tu-dominio.com
```

### 4. Iniciar la base de datos

```bash
# Usando Docker
docker run -d \
  --name menud-postgres \
  -e POSTGRES_DB=menud \
  -e POSTGRES_USER=tu_usuario \
  -e POSTGRES_PASSWORD=tu_password \
  -p 5432:5432 \
  postgres:14-alpine
```

### 5. Iniciar el servidor

```bash
# Desarrollo
npm run start:dev

# Producción
npm run build
npm run start:prod
```

## Scripts Disponibles

| Script | Descripción |
|--------|-------------|
| `npm run start:dev` | Iniciar en modo desarrollo con hot-reload |
| `npm run build` | Compilar para producción |
| `npm run start:prod` | Iniciar en modo producción |
| `npm run lint` | Ejecutar linter ESLint |
| `npm run format` | Formatear código con Prettier |
| `npm run test` | Ejecutar tests unitarios |
| `npm run test:e2e` | Ejecutar tests end-to-end |
| `npm run test:cov` | Generar reporte de cobertura |

## API Documentation

Una vez iniciado el servidor, la documentación Swagger está disponible en:

```
http://localhost:3000/api-docs
```

### Endpoints Principales

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/v1/auth/register` | Registrar nuevo usuario |
| POST | `/v1/auth/login` | Iniciar sesión |
| POST | `/v1/auth/refresh` | Refrescar token |
| GET | `/v1/users/profile` | Obtener perfil |
| GET | `/v1/business` | Listar negocios |
| POST | `/v1/business` | Crear negocio |
| GET | `/v1/branch` | Listar sucursales |
| POST | `/v1/branch` | Crear sucursal |
| GET | `/v1/menu` | Listar menús |
| POST | `/v1/menu` | Crear menú |
| GET | `/v1/product` | Listar productos |
| POST | `/v1/product` | Crear producto |
| GET | `/v1/orders` | Listar pedidos |
| POST | `/v1/orders` | Crear pedido |

Para más detalles, consulta la [documentación completa de la API](docs/es/API.md).

## WebSocket

El servidor WebSocket está disponible en el puerto configurado (por defecto: 3001).

### URLs de Conexión

| Entorno | URL |
|---------|-----|
| **Develop** | `wss://websocket-menud-develop.pidrive.com.ar` |
| **Staging** | `wss://websocket-menud-staging.pidrive.com.ar` |
| **Production** | `wss://websocket-menud-production.pidrive.com.ar` |

### Eventos Disponibles

- `findstatus` - Buscar pedidos por estado y tipo
- `findone` - Buscar un pedido por ID
- `notification` - Escuchar notificaciones de nuevos pedidos
- `earning` - Obtener ganancias
- `orders` - Obtener total de pedidos
- `sold` - Obtener total vendido
- `top-seller` - Obtener top 4 productos más vendidos

Para más detalles, consulta la [documentación de WebSockets](docs/es/websocket.md).

## Despliegue

### Docker

```bash
# Construir imagen
docker build -t menud-backend .

# Ejecutar
docker run -d \
  --name menud-backend \
  -p 3000:3000 \
  -p 3001:3001 \
  --env-file .env \
  menud-backend
```

### Docker Compose

```yaml
version: '3.8'
services:
  postgres:
    image: postgres:14-alpine
    environment:
      POSTGRES_DB: menud
      POSTGRES_USER: tu_usuario
      POSTGRES_PASSWORD: tu_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  backend:
    build: .
    ports:
      - "3000:3000"
      - "3001:3001"
    env_file: .env
    depends_on:
      - postgres

volumes:
  postgres_data:
```

Para más detalles, consulta la [guía de despliegue](docs/es/DEPLOYMENT.md).

## Estructura de Permisos

El sistema utiliza un modelo de permisos basado en roles:

### Roles Globales
- **Super Admin** - Acceso total al sistema
- **Admin** - Administrador de negocio
- **Manager** - Gestor de sucursal
- **Employee** - Empleado básico

### Módulos con Permisos
- Business (Negocio)
- Branch (Sucursal)
- Menu (Menú)
- Product (Producto)
- Order (Pedido)
- Member (Miembro)
- Promotion (Promoción)

Para más detalles, consulta la [documentación de arquitectura](docs/es/ARCHITECTURE.md).

## Testing

```bash
# Tests unitarios
npm run test

# Tests end-to-end
npm run test:e2e

# Cobertura de código
npm run test:cov
```

## Contribuir

Las contribuciones son bienvenidas. Por favor lee la [guía de contribución](docs/es/CONTRIBUTING.md) antes de abrir un Pull Request.

## Roadmap

Consulta el [Roadmap del proyecto](docs/es/ROADMAP.md) para ver las funcionalidades planificadas y en desarrollo.

## Licencia

Este proyecto es de uso privado. Todos los derechos reservados.

## Autor

**Nicolas Pollano** - [GitHub](https://github.com/nicolas-pollano)

## Soporte

- **Documentación API**: http://localhost:3000/api-docs
- **Issues**: [GitHub Issues](https://github.com/nicolas-pollano/menud-backend/issues)
