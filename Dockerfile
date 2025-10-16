# -------- Etapa de build --------
FROM node:20-alpine AS builder

# Crear usuario sin privilegios
RUN adduser -D appuser
WORKDIR /app

# Instalar dependencias necesarias para construir módulos nativos
RUN apk add --no-cache python3 make g++ bash

# Instalar dependencias de la app
COPY package*.json ./
RUN npm ci --omit=dev=false
RUN npm rebuild --force

# Copiar el código fuente y construir NestJS
COPY . .
RUN npx nest build

# -------- Etapa final --------
FROM node:20-alpine AS runtime

# Instalar solo lo necesario para ejecutar (cliente PostgreSQL, bash)
RUN apk add --no-cache postgresql-client bash curl

# Crear usuario sin privilegios
RUN adduser -D appuser
WORKDIR /app

# Copiar solo artefactos necesarios
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

# Copiar scripts y asegurar permisos mínimos
COPY scripts/init-db.sh /tmp/init-db.sh
COPY scripts/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chown appuser:appuser /usr/local/bin/entrypoint.sh /tmp/init-db.sh \
 && chmod 700 /usr/local/bin/entrypoint.sh /tmp/init-db.sh \
 && chown -R appuser:appuser /app \
 && chmod -R go-rwx /app

# Ejecutar como usuario no root
USER appuser

# Exponer el puerto de la app
EXPOSE 3000

# Hacer que el sistema de archivos sea de solo lectura
VOLUME ["/tmp"]
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
