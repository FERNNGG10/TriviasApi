# Trivias API

Api de trivias para proyecto Igmar 10mo
Fernando Olmos & Miguel Villalpando

## Comandos de Prisma

Lista de comandos útiles de Prisma para el desarrollo y mantenimiento de la base de datos:

### Migraciones

```bash
# Ver el estado actual de las migraciones
npx prisma migrate status

# Crear una nueva migración (desarrollo)
npx prisma migrate dev --name nombre_descriptivo

# Aplicar migraciones existentes (producción)
npx prisma migrate deploy

# Resetear la base de datos (solo desarrollo)
npx prisma migrate reset
```

### Cliente y Esquema

```bash
# Generar el cliente de Prisma después de cambios en el esquema
npx prisma generate

# Validar el esquema de Prisma
npx prisma validate

# Formatear el archivo schema.prisma
npx prisma format
```

### Visualización y Manipulación de Datos

```bash
# Abrir Prisma Studio (interfaz visual para la base de datos)
npx prisma studio

# Sincronizar el esquema con la base de datos sin crear migraciones
npx prisma db push

# Extraer el esquema desde una base de datos existente
npx prisma db pull
```

### Seeders

```bash
#Ejectuar seeder
npx prisma db seed
```
