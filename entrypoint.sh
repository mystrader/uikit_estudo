#!/bin/bash

echo "Iniciando entrypoint - RUNTIME"

echo "--- Variáveis de ambiente ---"
printenv | sort
echo "-----------------------------"

envsubst < "/usr/share/nginx/html/assets/config/config-docker.json" > "/usr/share/nginx/html/assets/config/config.json"

echo "--- Configurações das variáveis de ambiente utilizadas ---"
cat /usr/share/nginx/html/assets/config/config.json
echo "----------------------------------------------------------"

nginx -g "daemon off;"