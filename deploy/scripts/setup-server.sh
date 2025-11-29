#!/bin/bash
# Script de instalación inicial del servidor Rocky Linux para Trivias API
# Ejecutar con: sudo bash setup-server.sh

set -e  # Salir si hay algún error

echo "🚀 Iniciando configuración del servidor Rocky Linux..."

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Función para imprimir con color
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

# Verificar que se está ejecutando como root
if [[ $EUID -ne 0 ]]; then
   print_error "Este script debe ejecutarse como root (sudo)"
   exit 1
fi

print_status "Actualizando sistema..."
dnf update -y

# 1. Instalar Node.js 20.x
print_status "Instalando Node.js 20.x..."
dnf module reset nodejs -y
dnf module enable nodejs:20 -y
dnf install nodejs -y
node --version
npm --version

# 2. Instalar PostgreSQL 16
print_status "Instalando PostgreSQL 16..."
dnf install -y postgresql16-server postgresql16
/usr/pgsql-16/bin/postgresql-16-setup initdb
systemctl enable postgresql-16
systemctl start postgresql-16

# 3. Instalar PM2 globalmente
print_status "Instalando PM2..."
npm install -g pm2
pm2 startup systemd -u root --hp /root
systemctl enable pm2-root

# 4. Instalar NGINX
print_status "Instalando NGINX..."
dnf install -y nginx
systemctl enable nginx

# 5. Instalar Certbot para Let's Encrypt
print_status "Instalando Certbot..."
dnf install -y certbot python3-certbot-nginx

# 6. Instalar Git
print_status "Instalando Git..."
dnf install -y git

# 7. Configurar Firewall
print_status "Configurando Firewall..."
firewall-cmd --permanent --add-service=http
firewall-cmd --permanent --add-service=https
firewall-cmd --permanent --add-port=3000/tcp  # API port (solo para testing, normalmente cerrado)
firewall-cmd --reload

# 8. Crear directorios necesarios
print_status "Creando directorios..."
mkdir -p /var/www/trivia-api
mkdir -p /var/log/trivias-api
mkdir -p /var/www/certbot

# 9. Configurar rate limiting en NGINX
print_status "Configurando NGINX rate limiting..."
if ! grep -q "limit_req_zone" /etc/nginx/nginx.conf; then
    sed -i '/http {/a \    limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;\n    limit_conn_zone $binary_remote_addr zone=addr:10m;' /etc/nginx/nginx.conf
fi

# 10. Configurar PostgreSQL para conexiones locales
print_status "Configurando PostgreSQL..."
sudo -u postgres psql -c "CREATE DATABASE trivias_db;" || print_warning "Database might already exist"
sudo -u postgres psql -c "CREATE USER trivias_user WITH ENCRYPTED PASSWORD 'change_this_password';" || print_warning "User might already exist"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE trivias_db TO trivias_user;"
sudo -u postgres psql -c "ALTER DATABASE trivias_db OWNER TO trivias_user;"

print_status "Configuración inicial completada!"
echo ""
echo "📋 Próximos pasos:"
echo "1. Clonar repositorio en /var/www/trivia-api"
echo "2. Copiar .env.example a .env y configurar variables"
echo "3. Ejecutar: npm ci"
echo "4. Ejecutar: npm run build"
echo "5. Ejecutar: npx prisma migrate deploy"
echo "6. Copiar deploy/nginx/api.conf a /etc/nginx/conf.d/"
echo "7. Obtener certificado SSL: certbot --nginx -d api.triviachallenge.online"
echo "8. Iniciar API: npm run start:prod"
echo ""
print_status "¡Servidor listo para deployment!"
