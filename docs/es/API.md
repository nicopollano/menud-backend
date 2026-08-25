# Documentación de la API

## Visión General

La API de MenuD Backend está construida con NestJS y documentada interactivamente con Swagger. La API sigue el estándar RESTful y utiliza JWT para autenticación.

**URL Base:** `https://api.menud.pidrive.com.ar`

**Documentación Swagger:** `http://localhost:3500/api-docs`

## Autenticación

### Headers Requeridos

```http
Authorization: Bearer <token>
Content-Type: application/json
```

### Obtener Token

```http
POST /v1/auth/login
Content-Type: application/json

{
  "email": "usuario@ejemplo.com",
  "password": "tu-password"
}
```

**Respuesta:**
```json
{
  "statusCode": 200,
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "email": "usuario@ejemplo.com",
      "name": "Juan Pérez"
    }
  }
}
```

### Refrescar Token

```http
POST /v1/auth/refresh
Content-Type: application/json

{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## Endpoints por Módulo

---

## Authentication (`/v1/auth`)

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | `/register` | Registrar nuevo usuario | No |
| POST | `/login` | Iniciar sesión | No |
| POST | `/refresh` | Refrescar token de acceso | No |
| POST | `/forgot-password` | Solicitar reset de contraseña | No |
| POST | `/reset-password` | Restablecer contraseña | No |

### Ejemplo: Registro

```http
POST /v1/auth/register
Content-Type: application/json

{
  "email": "nuevo@ejemplo.com",
  "password": "MiPassword123!",
  "name": "Juan Pérez",
  "phoneNumber": "+5493511234567"
}
```

### Ejemplo: Login

```http
POST /v1/auth/login
Content-Type: application/json

{
  "email": "usuario@ejemplo.com",
  "password": "MiPassword123!"
}
```

---

## Users (`/v1/users`)

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/profile` | Obtener perfil del usuario actual | Sí |
| GET | `/:id` | Obtener usuario por ID | Sí |
| PATCH | `/profile` | Actualizar perfil | Sí |
| DELETE | `/:id` | Eliminar usuario | Sí |

### Ejemplo: Obtener Perfil

```http
GET /v1/users/profile
Authorization: Bearer <token>
```

**Respuesta:**
```json
{
  "statusCode": 200,
  "data": {
    "id": 1,
    "email": "usuario@ejemplo.com",
    "name": "Juan Pérez",
    "phoneNumber": "+5493511234567",
    "globalRole": "ADMIN",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

## Business (`/v1/business`)

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/` | Listar negocios del usuario | Sí |
| GET | `/:id` | Obtener negocio por ID | Sí |
| POST | `/` | Crear nuevo negocio | Sí |
| PATCH | `/:id` | Actualizar negocio | Sí |
| DELETE | `/:id` | Eliminar negocio | Sí |
| GET | `/sitemap` | Obtener sitemap de negocios | Sí |

### Ejemplo: Crear Negocio

```http
POST /v1/business
Authorization: Bearer <token>
Content-Type: application/json

{
  "businessName": "Restaurante Italiano",
  "description": "Auténtica cocina italiana",
  "slug": "restaurante-italiano"
}
```

**Respuesta:**
```json
{
  "statusCode": 201,
  "data": {
    "id": 1,
    "businessName": "Restaurante Italiano",
    "description": "Auténtica cocina italiana",
    "slug": "restaurante-italiano",
    "owner": {
      "id": 1,
      "name": "Juan Pérez"
    },
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

## Branch (`/v1/branch`)

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/` | Listar sucursales | Sí |
| GET | `/:id` | Obtener sucursal por ID | Sí |
| POST | `/` | Crear nueva sucursal | Sí |
| PATCH | `/:id` | Actualizar sucursal | Sí |
| DELETE | `/:id` | Eliminar sucursal | Sí |
| POST | `/copy` | Copiar sucursal existente | Sí |
| POST | `/move` | Mover sucursal a otro negocio | Sí |
| GET | `/summary` | Resumen de sucursales | Sí |

### Ejemplo: Crear Sucursal

```http
POST /v1/branch
Authorization: Bearer <token>
Content-Type: application/json

{
  "branchName": "Sucursal Centro",
  "businessId": 1,
  "address": "Av. Principal 1234",
  "phone": "+5493511234567",
  "email": "centro@restaurante.com"
}
```

**Headers Especiales:**
- `businessid`: ID del negocio (requerido para algunas operaciones)

---

## Menu (`/v1/menu`)

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/` | Listar menús | Sí |
| GET | `/:id` | Obtener menú por ID | Sí |
| POST | `/` | Crear nuevo menú | Sí |
| PATCH | `/:id` | Actualizar menú | Sí |
| DELETE | `/:id` | Eliminar menú | Sí |
| POST | `/copy` | Copiar menú existente | Sí |
| POST | `/move` | Mover menú a otra sucursal | Sí |
| PATCH | `/:id/status` | Cambiar estado del menú | Sí |

### Ejemplo: Crear Menú

```http
POST /v1/menu
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Menú Principal",
  "branchId": 1,
  "description": "Nuestro menú principal con las mejores selecciones"
}
```

### Cambiar Estado del Menú

```http
PATCH /v1/menu/1/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "published"
}
```

**Estados disponibles:**
- `draft` - Borrador
- `published` - Publicado
- `archived` - Archivado

---

## Category (`/v1/category`)

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/` | Listar categorías | Sí |
| GET | `/:id` | Obtener categoría por ID | Sí |
| POST | `/` | Crear nueva categoría | Sí |
| PATCH | `/:id` | Actualizar categoría | Sí |
| DELETE | `/:id` | Eliminar categoría | Sí |

### Ejemplo: Crear Categoría

```http
POST /v1/category
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Pizzas",
  "menuId": 1,
  "description": "Nuestras deliciosas pizzas artesanales",
  "order": 1
}
```

---

## Subcategory (`/v1/subcategory`)

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/` | Listar subcategorías | Sí |
| GET | `/:id` | Obtener subcategoría por ID | Sí |
| POST | `/` | Crear nueva subcategoría | Sí |
| PATCH | `/:id` | Actualizar subcategoría | Sí |
| DELETE | `/:id` | Eliminar subcategoría | Sí |

### Ejemplo: Crear Subcategoría

```http
POST /v1/subcategory
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Pizzas Clásicas",
  "categoryId": 1,
  "description": "Nuestras pizzas tradicionales",
  "order": 1
}
```

---

## Product (`/v1/product`)

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/` | Listar productos | Sí |
| GET | `/:id` | Obtener producto por ID | Sí |
| POST | `/` | Crear nuevo producto | Sí |
| PATCH | `/:id` | Actualizar producto | Sí |
| DELETE | `/:id` | Eliminar producto | Sí |
| POST | `/import` | Importar productos desde menú | Sí |

### Ejemplo: Crear Producto

```http
POST /v1/product
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Pizza Margherita",
  "description": "Tomate, mozzarella fresca, albahaca",
  "price": 8500,
  "subcategoryId": 1,
  "image": "https://imagekit.io/...",
  "isAvailable": true
}
```

### Filtrar Productos

```http
GET /v1/product?subcategoryId=1&isAvailable=true&search=pizza
Authorization: Bearer <token>
```

**Parámetros de Query:**
- `subcategoryId` - Filtrar por subcategoría
- `isAvailable` - Filtrar por disponibilidad
- `search` - Buscar por nombre

---

## Orders (`/v1/orders`)

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/` | Listar pedidos | Sí |
| GET | `/:id` | Obtener pedido por ID | Sí |
| POST | `/` | Crear nuevo pedido | Sí |
| PATCH | `/:id` | Actualizar pedido | Sí |
| PATCH | `/:id/status` | Cambiar estado del pedido | Sí |
| POST | `/:id/confirm` | Confirmar pedido | Sí |

### Ejemplo: Crear Pedido

```http
POST /v1/orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "branchId": 1,
  "clientName": "Carlos García",
  "phoneNumber": "+5493511234567",
  "paymentMethod": "cash",
  "tableId": 5,
  "delivery": false,
  "direction": null,
  "postalCode": null,
  "location": null,
  "products": [
    {
      "productId": 1,
      "quantity": 2,
      "unitPrice": 8500
    },
    {
      "productId": 2,
      "quantity": 1,
      "unitPrice": 12000
    }
  ]
}
```

**Respuesta:**
```json
{
  "statusCode": 201,
  "data": {
    "id": 101,
    "clientName": "Carlos García",
    "status": "pending",
    "total": 29000,
    "products": [...],
    "createdAt": "2024-01-15T20:30:00.000Z"
  }
}
```

### Cambiar Estado del Pedido

```http
PATCH /v1/orders/101/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "preparing"
}
```

**Estados disponibles:**
- `pending` - Pendiente
- `confirmed` - Confirmado
- `preparing` - En preparación
- `ready` - Listo para entregar
- `delivered` - Entregado
- `cancelled` - Cancelado

---

## Order Product (`/v1/order-product`)

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/` | Listar detalles de pedidos | Sí |
| GET | `/:id` | Obtener detalle por ID | Sí |
| POST | `/` | Agregar producto a pedido | Sí |
| PATCH | `/:id` | Actualizar cantidad | Sí |
| DELETE | `/:id` | Eliminar producto del pedido | Sí |

---

## Member (`/v1/member`)

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/` | Listar miembros | Sí |
| GET | `/:id` | Obtener miembro por ID | Sí |
| POST | `/` | Agregar miembro a sucursal | Sí |
| PATCH | `/:id` | Actualizar rol de miembro | Sí |
| DELETE | `/:id` | Eliminar miembro | Sí |

### Ejemplo: Agregar Miembro

```http
POST /v1/member
Authorization: Bearer <token>
Content-Type: application/json

{
  "userId": 2,
  "branchId": 1,
  "role": "MANAGER"
}
```

**Roles disponibles:**
- `OWNER` - Propietario
- `ADMIN` - Administrador
- `MANAGER` - Gerente
- `EMPLOYEE` - Empleado

---

## Permission (`/v1/permission`)

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/` | Listar permisos | Sí |
| GET | `/:id` | Obtener permiso por ID | Sí |
| POST | `/` | Crear permiso | Sí |
| PATCH | `/:id` | Actualizar permiso | Sí |
| DELETE | `/:id` | Eliminar permiso | Sí |
| POST | `/role` | Asignar permiso a rol | Sí |

---

## Plan (`/v1/plan`)

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/` | Listar planes | No |
| GET | `/:id` | Obtener plan por ID | No |
| POST | `/` | Crear plan | Sí (Super Admin) |
| PATCH | `/:id` | Actualizar plan | Sí (Super Admin) |
| DELETE | `/:id` | Eliminar plan | Sí (Super Admin) |

### Ejemplo: Plan

```json
{
  "id": 1,
  "name": "Plan Básico",
  "price": 9999,
  "currency": "ARS",
  "billingCycle": "monthly",
  "features": [
    "1 sucursal",
    "Menú ilimitado",
    "Soporte por email"
  ],
  "maxBranches": 1,
  "maxMenus": 3
}
```

---

## Subscription (`/v1/subscription`)

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/` | Listar suscripciones | Sí |
| GET | `/:id` | Obtener suscripción por ID | Sí |
| POST | `/` | Crear suscripción | Sí |
| PATCH | `/:id` | Actualizar suscripción | Sí |

---

## Promotion (`/v1/promotion`)

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/` | Listar promociones | Sí |
| GET | `/:id` | Obtener promoción por ID | Sí |
| POST | `/` | Crear promoción | Sí |
| PATCH | `/:id` | Actualizar promoción | Sí |
| DELETE | `/:id` | Eliminar promoción | Sí |

### Ejemplo: Crear Promoción

```http
POST /v1/promotion
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "2x1 en Pizzas",
  "description": "Todos los martes 2x1 en pizzas seleccionadas",
  "discountPercentage": 50,
  "startDate": "2024-01-15",
  "endDate": "2024-02-15",
  "days": ["tuesday"],
  "branchId": 1,
  "productIds": [1, 2, 3]
}
```

---

## Schedule (`/v1/schedule`)

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/` | Listar horarios | Sí |
| GET | `/:id` | Obtener horario por ID | Sí |
| POST | `/` | Crear horario | Sí |
| PATCH | `/:id` | Actualizar horario | Sí |
| DELETE | `/:id` | Eliminar horario | Sí |

### Ejemplo: Crear Horario

```http
POST /v1/schedule
Authorization: Bearer <token>
Content-Type: application/json

{
  "branchId": 1,
  "day": "monday",
  "openTime": "09:00",
  "closeTime": "22:00",
  "isClosed": false
}
```

**Días disponibles:**
- `monday`, `tuesday`, `wednesday`, `thursday`, `friday`, `saturday`, `sunday`

---

## Tables (`/v1/tables`)

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/` | Listar mesas | Sí |
| GET | `/:id` | Obtener mesa por ID | Sí |
| POST | `/` | Crear mesa | Sí |
| PATCH | `/:id` | Actualizar mesa | Sí |
| DELETE | `/:id` | Eliminar mesa | Sí |

### Ejemplo: Crear Mesa

```http
POST /v1/tables
Authorization: Bearer <token>
Content-Type: application/json

{
  "branchId": 1,
  "nroMesa": 5,
  "capacity": 4,
  "enabled": true
}
```

---

## Upload (`/v1/upload`)

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | `/` | Subir archivo | Sí |

### Ejemplo: Subir Imagen

```http
POST /v1/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data

file: [archivo imagen]
```

**Respuesta:**
```json
{
  "statusCode": 201,
  "data": {
    "url": "https://ik.imagekit.io/...",
    "thumbnail": "https://ik.imagekit.io/.../thumbnail.jpg"
  }
}
```

**Tipos de archivo permitidos:**
- Images: jpg, jpeg, png, webp, gif
- Tamaño máximo: 5MB

---

## Linkit (`/v1/linkit`)

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/` | Listar enlaces | Sí |
| GET | `/:id` | Obtener enlace por ID | Sí |
| POST | `/` | Crear enlace corto | Sí |
| PATCH | `/:id` | Actualizar enlace | Sí |
| DELETE | `/:id` | Eliminar enlace | Sí |

### Ejemplo: Crear Enlace

```http
POST /v1/linkit
Authorization: Bearer <token>
Content-Type: application/json

{
  "menuId": 1,
  "slug": "mi-restaurante",
  "customUrl": "https://menu.menud.com.ar/mi-restaurante"
}
```

---

## Summary (`/v1/summary`)

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/` | Resumen general | Sí |
| GET | `/orders-sold` | Pedidos y ventas | Sí |

### Ejemplo: Resumen

```http
GET /v1/summary?branchId=1&from=2024-01-01&to=2024-01-31
Authorization: Bearer <token>
```

**Respuesta:**
```json
{
  "statusCode": 200,
  "data": {
    "totalOrders": 156,
    "totalSales": 2450000,
    "averageTicket": 15705,
    "topProducts": [
      { "id": 1, "name": "Pizza Margherita", "count": 45 },
      { "id": 2, "name": "Hamburguesa Clásica", "count": 38 }
    ]
  }
}
```

---

## WebSockets

### Conexión

```javascript
import io from "socket.io-client";

const socket = io("wss://websocket-menud-develop.pidrive.com.ar", {
  auth: {
    token: "tu-token-jwt"
  }
});
```

### Eventos Disponibles

| Evento | Dirección | Descripción |
|--------|-----------|-------------|
| `findstatus` | Cliente → Servidor | Buscar pedidos por estado |
| `findone` | Cliente → Servidor | Buscar pedido por ID |
| `earning` | Cliente → Servidor | Obtener ganancias |
| `orders` | Cliente → Servidor | Total de pedidos |
| `sold` | Cliente → Servidor | Total vendido |
| `soldmargin` | Cliente → Servidor | Ventas por rango de fechas |
| `top-seller` | Cliente → Servidor | Top 4 productos vendidos |
| `notification` | Servidor → Cliente | Notificación de nuevo pedido |

### Ejemplo: Buscar Pedidos por Estado

```javascript
socket.emit("findstatus", JSON.stringify({
  headers: { token: "tu-token-jwt" },
  body: {
    type: "delivery",
    status: "pending"
  }
}));
```

### Ejemplo: Escuchar Notificaciones

```javascript
socket.on("notification", (data) => {
  console.log("Nuevo pedido:", data);
  // data contiene la información del pedido
});
```

Para más detalles de WebSocket, consulta [websocket.md](websocket.md).

---

## Códigos de Respuesta

| Código | Descripción |
|--------|-------------|
| 200 | OK - Éxito |
| 201 | Created - Recurso creado |
| 204 | No Content - Éxito sin contenido |
| 400 | Bad Request - Solicitud inválida |
| 401 | Unauthorized - No autenticado |
| 403 | Forbidden - No autorizado |
| 404 | Not Found - Recurso no encontrado |
| 409 | Conflict - Conflicto (ej: email ya existe) |
| 422 | Unprocessable Entity - Error de validación |
| 429 | Too Many Requests - Rate limit excedido |
| 500 | Internal Server Error - Error del servidor |

---

## Errores Comunes

### Error de Autenticación

```json
{
  "statusCode": 401,
  "message": "Token inválido o expirado",
  "error": "Unauthorized"
}
```

### Error de Validación

```json
{
  "statusCode": 400,
  "message": [
    "email debe ser un correo electrónico válido",
    "password debe tener al menos 8 caracteres"
  ],
  "error": "Bad Request"
}
```

### Error de Permisos

```json
{
  "statusCode": 403,
  "message": "No tienes permisos para realizar esta acción",
  "error": "Forbidden"
}
```

### Error de Recurso No Encontrado

```json
{
  "statusCode": 404,
  "message": "Business with id 999 not found",
  "error": "Not Found"
}
```

---

## Rate Limiting

La API implementa rate limiting para prevenir abusos:

- **Límite general:** 100 peticiones por minuto
- **Límite de autenticación:** 10 peticiones por minuto
- **Límite de upload:** 20 subidas por minuto

Los headers de rate limiting se incluyen en cada respuesta:

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1705312800
```

---

## Versión de la API

La API utiliza versionado URI. La versión actual es `v1`.

```
https://api.menud.pidrive.com.ar/v1/
```

Para cambios mayores, se lanzará `v2` con soporte paralelo temporal.

---

## Soporte

- **Swagger UI:** http://localhost:3500/api-docs
- **Postman Collection:** [MenuD Documentation](https://menuddocumentation.postman.co/workspace/MenuDDocumentation~df154953-cf1f-43f5-8fc9-639daa8e5f6e/overview)
- **Issues:** [GitHub Issues](https://github.com/nicolas-pollano/menud-backend/issues)
