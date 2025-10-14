#!/bin/sh
echo "Ejecutando script dentro del contenedor"

echo "EXTERNAL_DB: $EXTERNAL_DB"
echo "INTERNAL_DB $INTERNAL_DB "
echo "DOKPLOY_DEPLOY_URL $DOKPLOY_DEPLOY_URL;"
echo "HOSTNAME $HOSTNAME"

if [ -z "$DOKPLOY_DEPLOY_URL" ]; then 
    echo "MODO NORMAL, SALIENDO"
    exit 0
fi

echo "" >> .env
echo "HOSTNAME_ENV=PV_$HOSTNAME" >> .env

pg_dump $EXTERNAL_DB -Fc -f dump

psql $INTERNAL_DB -c "CREATE DATABASE \"PV_$HOSTNAME\";"

pg_restore --no-owner --no-privileges -d "$INTERNAL_DB_ADDRESS/PV_$HOSTNAME" dump

rm dump

echo "FINALIZADO"