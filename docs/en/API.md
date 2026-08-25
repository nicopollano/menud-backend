# MenuD API Documentation

## Overview

The MenuD API is a RESTful service built with NestJS. All endpoints return JSON responses and use standard HTTP status codes.

**Base URL:** `https://api.menud.pidrive.com.ar`

**Authentication:** Bearer token (JWT)

**Swagger UI:** `https://api.menud.pidrive.com.ar/api-docs`

---

## Authentication

### Login

```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "USER"
  }
}
```

### Register

```http
POST /auth/register
Content-Type: application/json

{
  "email": "newuser@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

### Refresh Token

```http
POST /auth/refresh
Authorization: Bearer <token>
```

---

## Users

### Get All Users

```http
GET /users
Authorization: Bearer <token>
```

### Get User by ID

```http
GET /users/:id
Authorization: Bearer <token>
```

### Update User

```http
PATCH /users/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "firstName": "Updated Name"
}
```

### Delete User

```http
DELETE /users/:id
Authorization: Bearer <token>
```

---

## Business

### Create Business

```http
POST /business
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "My Restaurant",
  "slug": "my-restaurant",
  "description": "A great restaurant"
}
```

### Get All Businesses

```http
GET /business
Authorization: Bearer <token>
```

### Get Business by ID

```http
GET /business/:id
Authorization: Bearer <token>
```

### Update Business

```http
PATCH /business/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Restaurant Name"
}
```

### Delete Business

```http
DELETE /business/:id
Authorization: Bearer <token>
```

---

## Branch

### Create Branch

```http
POST /branch/:businessId
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Downtown Branch",
  "address": "123 Main St",
  "phone": "+1234567890"
}
```

### Get Branches by Business

```http
GET /branch/:businessId
Authorization: Bearer <token>
```

### Get Branch by ID

```http
GET /branch/:businessId/:id
Authorization: Bearer <token>
```

### Update Branch

```http
PATCH /branch/:businessId/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "phone": "+0987654321"
}
```

### Delete Branch

```http
DELETE /branch/:businessId/:id
Authorization: Bearer <token>
```

---

## Menu

### Create Menu

```http
POST /menu/:branchId
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Lunch Menu",
  "description": "Our delicious lunch options"
}
```

### Get Menus by Branch

```http
GET /menu/:branchId
Authorization: Bearer <token>
```

### Get Menu by ID

```http
GET /menu/:branchId/:id
Authorization: Bearer <token>
```

### Update Menu

```http
PATCH /menu/:branchId/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "isActive": true
}
```

### Delete Menu

```http
DELETE /menu/:branchId/:id
Authorization: Bearer <token>
```

---

## Category

### Create Category

```http
POST /category/:menuId
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Appetizers",
  "description": "Start your meal right",
  "order": 1
}
```

### Get Categories by Menu

```http
GET /category/:menuId
Authorization: Bearer <token>
```

### Update Category

```http
PATCH /category/:menuId/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "order": 2
}
```

### Delete Category

```http
DELETE /category/:menuId/:id
Authorization: Bearer <token>
```

---

## Subcategory

### Create Subcategory

```http
POST /subcategory/:categoryId
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Soups",
  "description": "Hot and cold soups"
}
```

### Get Subcategories by Category

```http
GET /subcategory/:categoryId
Authorization: Bearer <token>
```

### Update Subcategory

```http
PATCH /subcategory/:categoryId/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Subcategory"
}
```

### Delete Subcategory

```http
DELETE /subcategory/:categoryId/:id
Authorization: Bearer <token>
```

---

## Product

### Create Product

```http
POST /product/:subcategoryId
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Caesar Salad",
  "description": "Fresh romaine lettuce with parmesan",
  "price": 12.99,
  "image": "https://imagekit.io/..."
}
```

### Get Products by Subcategory

```http
GET /product/:subcategoryId
Authorization: Bearer <token>
```

### Update Product

```http
PATCH /product/:subcategoryId/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "price": 14.99,
  "isAvailable": true
}
```

### Delete Product

```http
DELETE /product/:subcategoryId/:id
Authorization: Bearer <token>
```

---

## Orders

### Create Order

```http
POST /orders/:branchId
Authorization: Bearer <token>
Content-Type: application/json

{
  "tableId": "uuid",
  "products": [
    {
      "productId": "uuid",
      "quantity": 2
    }
  ]
}
```

### Get Orders by Branch

```http
GET /orders/:branchId
Authorization: Bearer <token>
```

### Get Order by ID

```http
GET /orders/:branchId/:id
Authorization: Bearer <token>
```

### Update Order Status

```http
PATCH /orders/:branchId/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "CONFIRMED"
}
```

### Order Status Flow

```
PENDING → CONFIRMED → PREPARING → READY → COMPLETED
    └──────────────────────────────────→ CANCELLED
```

---

## Order Product

### Get Order Products

```http
GET /order-product/:orderId
Authorization: Bearer <token>
```

### Update Order Product

```http
PATCH /order-product/:orderId/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "quantity": 3
}
```

---

## Tables

### Create Table

```http
POST /tables/:branchId
Authorization: Bearer <token>
Content-Type: application/json

{
  "number": 1,
  "capacity": 4
}
```

### Get Tables by Branch

```http
GET /tables/:branchId
Authorization: Bearer <token>
```

### Update Table

```http
PATCH /tables/:branchId/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "isOccupied": true
}
```

### Delete Table

```http
DELETE /tables/:branchId/:id
Authorization: Bearer <token>
```

---

## Member

### Add Member

```http
POST /member/:branchId
Authorization: Bearer <token>
Content-Type: application/json

{
  "userId": "uuid",
  "role": "STAFF"
}
```

### Get Members by Branch

```http
GET /member/:branchId
Authorization: Bearer <token>
```

### Update Member

```http
PATCH /member/:branchId/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "role": "MANAGER"
}
```

### Remove Member

```http
DELETE /member/:branchId/:id
Authorization: Bearer <token>
```

---

## Permission

### Assign Permission

```http
POST /permission/:memberId
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "ORDERS_CREATE"
}
```

### Get Permissions by Member

```http
GET /permission/:memberId
Authorization: Bearer <token>
```

### Remove Permission

```http
DELETE /permission/:memberId/:id
Authorization: Bearer <token>
```

---

## Plan

### Create Plan

```http
POST /plan
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Premium",
  "price": 29.99,
  "features": ["unlimited_menus", "analytics", "priority_support"]
}
```

### Get All Plans

```http
GET /plan
```

### Update Plan

```http
PATCH /plan/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "price": 39.99
}
```

---

## Subscription

### Create Subscription

```http
POST /subscription
Authorization: Bearer <token>
Content-Type: application/json

{
  "planId": "uuid"
}
```

### Get User Subscription

```http
GET /subscription
Authorization: Bearer <token>
```

### Cancel Subscription

```http
DELETE /subscription/:id
Authorization: Bearer <token>
```

---

## Promotion

### Create Promotion

```http
POST /promotion/:branchId
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Happy Hour",
  "discount": 20,
  "startDate": "2024-01-15T10:00:00Z",
  "endDate": "2024-01-15T18:00:00Z"
}
```

### Get Promotions by Branch

```http
GET /promotion/:branchId
Authorization: Bearer <token>
```

### Update Promotion

```http
PATCH /promotion/:branchId/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "isActive": false
}
```

### Delete Promotion

```http
DELETE /promotion/:branchId/:id
Authorization: Bearer <token>
```

---

## Schedule

### Set Business Hours

```http
POST /schedule/:branchId
Authorization: Bearer <token>
Content-Type: application/json

{
  "dayOfWeek": 1,
  "openTime": "09:00",
  "closeTime": "22:00"
}
```

### Get Schedule by Branch

```http
GET /schedule/:branchId
Authorization: Bearer <token>
```

### Update Schedule

```http
PATCH /schedule/:branchId/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "closeTime": "23:00"
}
```

---

## Upload

### Upload Image

```http
POST /upload
Authorization: Bearer <token>
Content-Type: multipart/form-data

file: <image_file>
```

**Response:**
```json
{
  "url": "https://ik.imagekit.io/...",
  "thumbnail": "https://ik.imagekit.io/.../thumbnail.jpg"
}
```

---

## Linkit

### Create Short Link

```http
POST /linkit
Authorization: Bearer <token>
Content-Type: application/json

{
  "url": "https://api.menud.pidrive.com.ar/menu/branch/uuid",
  "customSlug": "my-menu"
}
```

### Get Link Analytics

```http
GET /linkit/:slug/stats
Authorization: Bearer <token>
```

---

## Summary

### Get Dashboard Summary

```http
GET /summary/:branchId
Authorization: Bearer <token>
```

**Response:**
```json
{
  "totalOrders": 150,
  "totalRevenue": 5420.50,
  "averageOrderValue": 36.14,
  "topProducts": [...],
  "recentOrders": [...]
}
```

---

## WebSocket Events

### Connection

```javascript
const socket = io('https://api.menud.pidrive.com.ar:3001', {
  auth: {
    token: 'your-jwt-token'
  }
});
```

### Events

| Event | Direction | Description |
|-------|-----------|-------------|
| `order:created` | Server → Client | New order placed |
| `order:updated` | Server → Client | Order status changed |
| `order:deleted` | Server → Client | Order cancelled |
| `join:branch` | Client → Server | Join branch room |
| `leave:branch` | Client → Server | Leave branch room |

### Example

```javascript
// Join branch room
socket.emit('join:branch', { branchId: 'uuid' });

// Listen for new orders
socket.on('order:created', (order) => {
  console.log('New order:', order);
});

// Listen for order updates
socket.on('order:updated', (order) => {
  console.log('Order updated:', order);
});
```

---

## Error Responses

### Standard Error Format

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request"
}
```

### Common Error Codes

| Code | Description |
|------|-------------|
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Authentication required |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource doesn't exist |
| 409 | Conflict - Resource already exists |
| 422 | Unprocessable Entity - Validation error |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error |

---

## Rate Limiting

- **Standard endpoints:** 100 requests per minute
- **Authentication endpoints:** 10 requests per minute
- **Upload endpoints:** 20 requests per minute

---

## Pagination

List endpoints support pagination:

```http
GET /users?page=1&limit=20
```

**Response:**
```json
{
  "data": [...],
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 20,
    "totalPages": 5
  }
}
```

---

## Filtering

Some endpoints support filtering:

```http
GET /orders?status=PENDING&startDate=2024-01-01&endDate=2024-01-31
```

---

## Sorting

List endpoints support sorting:

```http
GET /products?sort=price&order=ASC
```

---

For interactive API documentation, visit the [Swagger UI](https://api.menud.pidrive.com.ar/api-docs).
