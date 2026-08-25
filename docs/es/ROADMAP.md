# Roadmap del Proyecto

## Visión General

Este documento describe la hoja de ruta de MenuD Backend, incluyendo funcionalidades completadas, en desarrollo y planificadas.

## Estado Actual: v2.x

**Última actualización:** Enero 2024

---

## Fase 1: Core (Completada) ✅

### Funcionalidades Base

| Funcionalidad | Estado | Versión |
|---------------|--------|---------|
| Sistema de autenticación JWT | ✅ Completado | v1.0 |
| Gestión de usuarios | ✅ Completado | v1.0 |
| CRUD de negocios | ✅ Completado | v1.0 |
| CRUD de sucursales | ✅ Completado | v1.0 |
| Gestión de menús | ✅ Completado | v1.0 |
| Sistema de categorías | ✅ Completado | v1.0 |
| Gestión de productos | ✅ Completado | v1.0 |
| Sistema de pedidos | ✅ Completado | v1.0 |
| Documentación Swagger | ✅ Completado | v1.0 |

### Infraestructura

| Componente | Estado | Notas |
|------------|--------|-------|
| Docker | ✅ Completado | Multi-stage build |
| PostgreSQL | ✅ Completado | TypeORM |
| WebSocket | ✅ Completado | Socket.io |
| Logging | ✅ Completado | Pino |
| CORS | ✅ Completado | Configurado |

---

## Fase 2: Enhanced Features (En Progreso) 🔄

### Q1 2024

| Funcionalidad | Estado | Prioridad |
|---------------|--------|-----------|
| Sistema de permisos granular | 🔄 En Progreso | Alta |
| Gestión de miembros/equipo | 🔄 En Progreso | Alta |
| Sistema de suscripciones | 🔄 En Progreso | Alta |
| Paletas de colores para menús | 🔄 En Progreso | Media |
| Promociones y descuentos | 🔄 En Progreso | Media |
| Horarios de atención | 🔄 En Progreso | Media |
| Gestión de mesas | 🔄 En Progreso | Media |

### Mejoras de UX

| Funcionalidad | Estado | Prioridad |
|---------------|--------|-----------|
| Notificaciones push en tiempo real | 🔄 En Progreso | Alta |
| Enlaces cortos para menús (Linkit) | 🔄 En Progreso | Media |
| Dashboard de analytics | 🔄 En Progreso | Media |
| Exportación de datos | 📋 Pendiente | Baja |

---

## Fase 3: Advanced Features (Planificada) 📋

### Q2 2024

| Funcionalidad | Estado | Prioridad |
|---------------|--------|-----------|
| Sistema de reseñas y calificaciones | 📋 Planificado | Alta |
| Programación de pedidos | 📋 Planificado | Alta |
| Sistema de reservas | 📋 Planificado | Media |
| Gestión de inventario | 📋 Planificado | Media |
| Múltiples idiomas (i18n) | 📋 Planificado | Baja |

### Integraciones

| Integración | Estado | Prioridad |
|-------------|--------|-----------|
| Pasarela de pagos (Mercado Pago) | 📋 Planificado | Alta |
| Google Maps para delivery | 📋 Planificado | Media |
| WhatsApp Business API | 📋 Planificado | Media |
| Integración con POS existentes | 📋 Planificado | Baja |

---

## Fase 4: Enterprise Features (Futuro) 🔮

### Q3-Q4 2024

| Funcionalidad | Estado | Prioridad |
|---------------|--------|-----------|
| Multi-tenancy mejorado | 🔮 Futuro | Alta |
| API pública para terceros | 🔮 Futuro | Alta |
| Webhooks para integraciones | 🔮 Futuro | Media |
| Exportación contable | 🔮 Futuro | Media |
| App móvil nativa (React Native) | 🔮 Futuro | Alta |
| Panel de administración web | 🔮 Futuro | Alta |

### Microservicios

| Servicio | Estado | Prioridad |
|----------|--------|-----------|
| Servicio de pagos | 🔮 Futuro | Alta |
| Servicio de notificaciones | 🔮 Futuro | Media |
| Servicio de reportes | 🔮 Futuro | Media |
| Servicio de analytics | 🔮 Futuro | Baja |

---

## Fase 5: Scalability & Performance (Futuro) 🔮

### 2025

| Iniciativa | Estado | Prioridad |
|------------|--------|-----------|
| Migración a microservicios | 🔮 Futuro | Alta |
| Redis para caché | 🔮 Futuro | Alta |
| Queue system (Bull/BullMQ) | 🔮 Futuro | Alta |
| CDN para assets estáticos | 🔮 Futuro | Media |
| Elasticsearch para búsquedas | 🔮 Futuro | Media |
| GraphQL API | 🔮 Futuro | Baja |
| Event-driven architecture | 🔮 Futuro | Baja |

---

## Technical Debt

### Conocido y Aceptado

| Item | Prioridad | Esfuerzo Estimado |
|------|-----------|-------------------|
| Migrar a TypeORM migrations | Alta | 2-3 días |
| Agregar tests e2e completos | Alta | 1 semana |
| Refactorizar lógica de pedidos | Media | 3-4 días |
| Optimizar queries N+1 | Media | 2-3 días |
| Agregar rate limiting avanzado | Media | 1-2 días |
| Documentar todos los DTOs | Baja | 2-3 días |

### Mejoras de Código

| Área | Estado | Notas |
|------|--------|-------|
| Separar lógica de negocio de controllers | 🔄 En Progreso | Prioridad alta |
| Implementar CQRS para pedidos | 📋 Pendiente | Reducir complejidad |
| Agregar validación asíncrona | 📋 Pendiente | Mejor UX |
| Optimizar imports | 🔄 En Progreso | Reducir bundle size |

---

## Métricas de Éxito

### Corto Plazo (Q1 2024)

- [ ] 100% cobertura de tests en módulos core
- [ ] Tiempo de respuesta < 200ms (p95)
- [ ] 0 errores críticos en producción
- [ ] Documentación Swagger 100% actualizada

### Mediano Plazo (Q2-Q4 2024)

- [ ] Soporte para 1000+ restaurantes activos
- [ ] Tiempo de respuesta < 100ms (p95)
- [ ] 99.9% uptime
- [ ] 50+ tests e2e

### Largo Plazo (2025)

- [ ] Soporte para 10,000+ restaurantes
- [ ] Tiempo de respuesta < 50ms (p95)
- [ ] Arquitectura de microservicios
- [ ] App móvil lanzada

---

## Changelog Reciente

### v2.1.0 (Enero 2024)

**Added:**
- Sistema de permisos granular
- Gestión de miembros por sucursal
- Paletas de colores para menús
- Enlaces cortos (Linkit)

**Changed:**
- Mejorada estructura de respuestas API
- Optimizadas queries de TypeORM
- Actualizada documentación Swagger

**Fixed:**
- Corregido cálculo de totales en pedidos
- Solucionado timeout en conexiones WebSocket
- Corregido envío de emails con adjuntos

### v2.0.0 (Diciembre 2023)

**Added:**
- Sistema de suscripciones y planes
- Promociones y horarios de atención
- Gestión de mesas
- Notificaciones en tiempo real

**Changed:**
- Migración a NestJS v11
- Actualización a TypeORM v0.3
- Nuevo sistema de logging con Pino

### v1.5.0 (Noviembre 2023)

**Added:**
- Dashboard de analytics básico
- Exportación de pedidos a CSV
- Búsqueda de productos

**Fixed:**
- Corregida autenticación WebSocket
- Solucionados errores de validación

---

## Roadmap Visual

```
2024
│
├─ Q1 ──────────────────────────────────────────────
│  │
│  ├─ ✅ Permisos granulares
│  ├─ ✅ Gestión de miembros
│  ├─ 🔄 Sistema de suscripciones
│  └─ 🔄 Paletas de colores
│
├─ Q2 ──────────────────────────────────────────────
│  │
│  ├─ 📋 Reseñas y calificaciones
│  ├─ 📋 Programación de pedidos
│  ├─ 📋 Sistema de reservas
│  └─ 📋 Integración pagos
│
├─ Q3 ──────────────────────────────────────────────
│  │
│  ├─ 🔮 API pública
│  ├─ 🔮 Webhooks
│  ├─ 🔮 App móvil v1
│  └─ 🔮 Panel admin web
│
└─ Q4 ──────────────────────────────────────────────
   │
   ├─ 🔮 Microservicios core
   ├─ 🔮 Redis caché
   ├─ 🔮 Queue system
   └─ 🔮 GraphQL (evaluation)

2025
│
├─ Q1-Q2 ──────────────────────────────────────────
│  │
│  ├─ 🔮 Event-driven architecture
│  ├─ 🔮 Elasticsearch
│  ├─ 🔮 CDN implementation
│  └─ 🔮 Multi-region support
│
└─ Q3-Q4 ──────────────────────────────────────────
   │
   ├─ 🔮 10K+ restaurantes
   ├─ 🔮 App móvil v2
   ├─ 🔮 Analytics avanzado
   └─ 🔮 Internacionalización completa
```

---

## Cómo Contribuir

Las contribuciones al roadmap son bienvenidas. Si tienes ideas o funcionalidades que te gustaría ver:

1. Abre un [GitHub Issue](https://github.com/nicolas-pollano/menud-backend/issues)
2. Etiqueta como `enhancement`
3. Describe la funcionalidad y su caso de uso
4. Indica si estás dispuesto a contribuir en su implementación

---

## Actualizaciones del Roadmap

Este roadmap se actualiza trimestralmente. Para ver cambios recientes, revisa el historial de commits de este archivo.

**Próxima revisión:** Abril 2024
