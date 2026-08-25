# Guía de Contribución

¡Gracias por tu interés en contribuir a MenuD Backend! Esta guía te ayudará a empezar.

## Tabla de Contenidos

- [Código de Conducta](#código-de-conducta)
- [Cómo Contribuir](#cómo-contribuir)
- [Configuración del Ambiente](#configuración-del-ambiente)
- [Flujo de Trabajo](#flujo-de-trabajo)
- [Convenciones](#convenciones)
- [Pull Requests](#pull-requests)
- [Issues](#issues)
- [Reconocimiento](#reconocimiento)

---

## Código de Conducta

### Nuestros Estándares

- Respetar a todos los participantes
- Aceptar retroalimentación constructiva
- Enfocarse en lo que es mejor para la comunidad
- Mostrar empatía hacia otros miembros

### Comportamiento Aceptable

- Usar lenguaje inclusivo y apropiado
- Respetar diferentes puntos de vista y experiencias
- Aceptar responsabilidad por errores
- Concentrarse en el impacto de la comunidad

---

## Cómo Contribuir

### Tipos de Contribución

| Tipo | Descripción | Dificultad |
|------|-------------|------------|
| Bug Fix | Corregir errores existentes | Baja-Media |
| Feature | Nueva funcionalidad | Media-Alta |
| Docs | Mejorar documentación | Baja |
| Test | Agregar o mejorar tests | Baja-Media |
| Refactor | Reestructurar código existente | Media |
| Performance | Optimizar rendimiento | Media-Alta |
| Security | Corregir vulnerabilidades | Alta |

### Contribuciones Seeking Help

Buscamos ayuda con:

- Tests e2e para módulos existentes
- Documentación de APIs no documentadas
- Optimización de queries N+1
- Internacionalización (i18n)
- Accesibilidad (a11y)

---

## Configuración del Ambiente

### Prerrequisitos

- Node.js 18+ (recomendado: 20 LTS)
- npm 9+
- PostgreSQL 14+
- Git 2.30+
- Docker (opcional)

### Pasos de Instalación

```bash
# 1. Fork el repositorio en GitHub

# 2. Clonar tu fork
git clone https://github.com/TU-USUARIO/menud-backend.git
cd menud-backend

# 3. Agregar upstream
git remote add upstream https://github.com/nicolas-pollano/menud-backend.git

# 4. Instalar dependencias
npm install

# 5. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus configuraciones

# 6. Iniciar base de datos (Docker)
docker run -d \
  --name menud-postgres-dev \
  -e POSTGRES_DB=menud \
  -e POSTGRES_USER=menud_dev \
  -e POSTGRES_PASSWORD=menud_dev123 \
  -p 5432:5432 \
  postgres:14-alpine

# 7. Iniciar servidor
npm run start:dev
```

### Verificar Instalación

```bash
# Ejecutar tests
npm run test

# Verificar linter
npm run lint

# Abrir Swagger
open http://localhost:3500/api-docs
```

---

## Flujo de Trabajo

### 1. Sincronizar con Upstream

```bash
# Fetch upstream
git fetch upstream

# Switch a develop
git checkout develop

# Merge upstream
git merge upstream/develop

# Push a tu fork
git push origin develop
```

### 2. Crear Feature Branch

```bash
# Crear rama desde develop
git checkout develop
git pull origin develop
git checkout -b feature/nombre-descriptivo

# O para bugs
git checkout -b fix/nombre-descriptivo
```

### 3. Hacer Cambios

```bash
# Agregar archivos
git add src/modulo/archivo.ts

# Commit con mensaje descriptivo
git commit -m "feat(modulo): descripción concisa del cambio"

# Push a tu fork
git push origin feature/nombre-descriptivo
```

### 4. Crear Pull Request

1. Ir a GitHub y crear PR desde tu branch hacia `develop`
2. Llenar el template de PR
3. Esperar review del equipo

### 5. Después del Merge

```bash
# Eliminar branch local
git checkout develop
git pull origin develop
git branch -d feature/nombre-descriptivo

# Eliminar branch remoto
git push origin --delete feature/nombre-descriptivo
```

---

## Convenciones

### Convenciones de Código

#### Naming

| Tipo | Convención | Ejemplo |
|------|------------|---------|
| Archivos | `kebab-case` | `user.controller.ts` |
| Clases | `PascalCase` | `UserService` |
| Interfaces | `PascalCase` | `IUserService` |
| Variables | `camelCase` | `userId` |
| Funciones | `camelCase` | `getUserById` |
| Constantes | `SCREAMING_SNAKE` | `MAX_RETRY_COUNT` |
| Enums | `PascalCase` | `UserRole` |
| DTOs | `PascalCase` + `Dto` | `CreateUserDto` |

#### Estructura de Archivos

```typescript
// user.controller.ts
import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto } from './dtos/create-user.dto';

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

  @Post()
  @ApiOperation({ summary: 'Crear usuario' })
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }
}
```

### Convenciones de Commits

#### Formato

```
<tipo>(<alcance>): <descripción corta>

[opcional: cuerpo del commit]

[opcional: footer]
```

#### Tipos

| Tipo | Descripción | Ejemplo |
|------|-------------|---------|
| `feat` | Nueva funcionalidad | `feat(auth): add refresh token` |
| `fix` | Corrección de bug | `fix(orders): calculate total correctly` |
| `docs` | Documentación | `docs(api): update endpoints` |
| `style` | Formato (no afecta lógica) | `style: fix indentation` |
| `refactor` | Refactorización | `refactor(user): extract validation` |
| `test` | Tests | `test(auth): add login tests` |
| `chore` | Tareas de mantenimiento | `chore: update dependencies` |
| `perf` | Mejora de rendimiento | `perf(queries): optimize N+1` |
| `ci` | Integración continua | `ci: add GitHub Actions` |
| `build` | Build system | `build: update webpack config` |

#### Ejemplos

```
feat(orders): add real-time notifications via WebSocket

- Implement WebSocket gateway for order updates
- Add notification service
- Update client connection handling

Closes #123
```

```
fix(auth): prevent token reuse after logout

- Add token to blacklist on logout
- Check blacklist in auth guard
- Add cleanup job for expired tokens

Fixes #456
```

### Convenciones de Branches

| Tipo | Patrón | Ejemplo |
|------|--------|---------|
| Feature | `feature/descripcion` | `feature/add-promotions` |
| Bug Fix | `fix/descripcion` | `fix/order-calculation` |
| Hotfix | `hotfix/descripcion` | `hotfix/security-patch` |
| Release | `release/version` | `release/v2.1.0` |
| Docs | `docs/descripcion` | `docs/api-guide` |

---

## Pull Requests

### Template de PR

```markdown
## Descripción

[Descripción breve de los cambios]

## Tipo de Cambio

- [ ] Bug Fix (corrección de bug)
- [ ] Feature (nueva funcionalidad)
- [ ] Docs (documentación)
- [ ] Test (tests)
- [ ] Refactor (refactorización)
- [ ] Performance (mejora de rendimiento)
- [ ] Security (seguridad)

## Cambios Principales

- [Lista de cambios principales]
- [Detalles técnicos si es necesario]

## Testing

- [ ] Tests unitarios pasan (`npm run test`)
- [ ] Tests e2e pasan (`npm run test:e2e`)
- [ ] Linter sin errores (`npm run lint`)
- [ ] Cobertura de código no disminuye

## Screenshots (si aplica)

[Screenshots de cambios visuales]

## Related Issues

- Fixes #123
- Closes #456

## Checklist

- [ ] Código sigue las convenciones del proyecto
- [ ] No hay console.logs innecesarios
- [ ] Variables de entorno documentadas
- [ ] Swagger actualizado (si aplica)
- [ ] README actualizado (si aplica)
```

### Reglas para PRs

1. **Tamaño:** PRs pequeños y enfocados (máx 500 líneas)
2. **Descripción:** Clara y completa
3. **Tests:** Incluir tests para nuevos features
4. **Documentación:** Actualizar docs si es necesario
5. **Review:** Necesita al menos 1 approval
6. **CI:** Todos los checks deben pasar

### Code Review

#### Como Reviewer

- Ser respetuoso y constructivo
- Enfocarse en el código, no en la persona
- Ofrecer sugerencias claras y accionables
- Agradecer las contribuciones

#### Como Autor

- Responder a todos los comentarios
- Hacer cambios solicitados rápidamente
- Marcar threads como resueltos
- Agradecer el feedback

---

## Issues

### Crear Issues

Al crear una issue, incluir:

1. **Título claro y descriptivo**
2. **Descripción detallada** del problema o feature
3. **Pasos para reproducir** (si es bug)
4. **Comportamiento esperado** vs **comportamiento actual**
5. **Screenshots** (si aplica)
6. **Entorno** (SO, Node.js, npm, etc.)

### Tipos de Issues

| Etiqueta | Descripción |
|----------|-------------|
| `bug` | Error reportado |
| `enhancement` | Nueva funcionalidad solicitada |
| `documentation` | Mejora de documentación |
| `good first issue` | Bueno para nuevos contribuidores |
| `help wanted` | Se necesita ayuda |
| `question` | Pregunta sobre el proyecto |
| `wontfix` | No será arreglado |

### Labels

| Color | Label | Uso |
|-------|-------|-----|
| Verde | `bug` | Errores |
| Azul | `enhancement` | Nuevas features |
| Naranja | `priority: high` | Alta prioridad |
| Amarillo | `priority: medium` | Prioridad media |
| Gris | `priority: low` | Baja prioridad |

---

## Reconocimiento

### Contribuidores

Agradecemos a todos los contribuidores que ayudan a mejorar MenuD Backend.

### Cómo ser Recognizado

- Tu nombre será añadido a la sección de contribuidores del README
- Contribuciones significativas serán mencionadas en el CHANGELOG
- Los mejores contribuidores pueden ser invitados a ser mainteners

---

## Preguntas Frecuentes

### ¿Cómo报告ar un bug?

Crea una issue con la etiqueta `bug` y sigue el template de issue.

### ¿Cómo solicitar una nueva funcionalidad?

Crea una issue con la etiqueta `enhancement` y describe tu idea en detalle.

### ¿Puedo trabajar en múltiples issues a la vez?

Sí, pero es recomendable enfocarse en uno a la vez para mantener la calidad.

### ¿Cuánto tiempo toma revisar un PR?

Normalmente 2-3 días hábiles. PRs complejos pueden tomar más tiempo.

---

## Contacto

- **Issues:** [GitHub Issues](https://github.com/nicolas-pollano/menud-backend/issues)
- **Email:** Nicolas Pollano

---

¡Gracias por contribuir a MenuD Backend!
