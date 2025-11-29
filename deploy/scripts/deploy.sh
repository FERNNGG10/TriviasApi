#!/bin/bash
# Script de deployment automático para Trivias API
# Ejecutar en el servidor: bash deploy.sh

set -e

APP_DIR="/var/www/trivia-api"
REPO_URL="https://github.com/YOUR_USERNAME/TriviasApi.git"  # Cambiar por tu repo

echo "🚀 Desplegando Trivias API..."

# Ir al directorio de la app
cd $APP_DIR

# Pull latest changes
echo "📥 Obteniendo últimos cambios..."
git pull origin main

# Instalar dependencias (solo las de producción)
echo "📦 Instalando dependencias..."
npm ci --only=production

# Build TypeScript
echo "🔨 Compilando TypeScript..."
npm run build

# Ejecutar migraciones de Prisma
echo "🗄️  Ejecutando migraciones de base de datos..."
npx prisma migrate deploy

# Regenerar Prisma Client
echo "⚙️  Regenerando Prisma Client..."
npx prisma generate

# Reiniciar PM2
echo "🔄 Reiniciando aplicación..."
pm2 restart trivias-api || pm2 start ecosystem.config.js --env production

# Health check
echo "🏥 Verificando health..."
sleep 3
curl -f http://localhost:3000/health || echo "⚠️  Warning: Health check failed"

# Guardar estado de PM2
pm2 save

echo "✅ Deployment completado!"
echo "📊 Estado de la aplicación:"
pm2 status trivias-api
