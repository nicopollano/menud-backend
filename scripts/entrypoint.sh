#!/bin/sh
set -e

echo "Ejecutando init-db.sh..."
/tmp/init-db.sh

echo "Iniciando la aplicación..."
exec node dist/main.js
