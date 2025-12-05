#!/bin/bash

# Detener el script si hay un error
set -e

echo "=================================================="
echo "🚀 INICIANDO DEPLOY QA (RESET DB) - TRIVIA CHALLENGE"
echo "=================================================="
echo "⚠️  ADVERTENCIA: ESTO BORRARÁ TODA LA BASE DE DATOS ⚠️"
echo "=================================================="

# --- PARTE 1: BACKEND (API) ---
echo " "
echo "➡️  1. Actualizando API (Backend)..."
# Asegúrate que esta ruta sea la correcta donde está tu API
cd /var/www/api/TriviasApi 

echo "⬇️  Bajando cambios de Git..."
git pull

echo "📦 Instalando dependencias..."
npm install

echo "🧨 RESETEANDO BASE DE DATOS (RESET + SEED)..."
# --force para evitar la confirmación interactiva
npx prisma migrate reset --force

echo "🔄 Regenerando cliente de Prisma..."
npx prisma generate

echo "🛠️  Compilando TypeScript..."
npm run build

echo "🔄 Reiniciando proceso PM2..."
pm2 restart trivias-api

echo "✅ API Actualizada y DB Reseteada."


# --- PARTE 2: FRONTEND (PWA) ---
echo " "
echo "➡️  2. Actualizando PWA (Frontend)..."
# Ruta donde clonaste el repo del front
cd ~/pwa_trivia_front 

echo "⬇️  Bajando cambios de Git..."
git pull

echo "📦 Instalando dependencias..."
npm install

echo "🛠️  Compilando Angular (Producción)..."
npm run build -- --configuration production

echo "🧹 Limpiando carpeta pública..."
sudo rm -rf /var/www/app/*

echo "🚚 Moviendo archivos nuevos..."
# Ruta corregida con el guion bajo y la carpeta browser
sudo cp -r dist/pwa_trivia/browser/* /var/www/app/

echo "🛡️  Aplicando permisos de Nginx y SELinux..."
sudo chown -R nginx:nginx /var/www/app
sudo chmod -R 755 /var/www/app
# El comando mágico para que no te salga el error 403
sudo chcon -R -t httpd_sys_content_t /var/www/app

echo "✅ PWA Actualizada con éxito."

echo " "
echo "=================================================="
echo "🎉 ¡DEPLOY QA COMPLETADO! DB LIMPIA Y SEEDERS APLICADOS 🎉"
echo "=================================================="
