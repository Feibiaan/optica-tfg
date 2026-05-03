# Óptica NOMA — TFG

Aplicación web de gestión para una óptica, desarrollada como Trabajo de Fin de Grado. Permite a los clientes explorar el catálogo con un recomendador morfológico, guardar favoritos y recuperar su contraseña. Los administradores disponen de un panel CRUD completo con soporte móvil.

## Tecnologías

| Capa | Tecnología |
|------|-----------|
| Frontend | Next.js 16 + React 19 + TypeScript |
| Estilos | Tailwind CSS 4 |
| Backend | Next.js API Routes |
| Base de datos | PostgreSQL + Prisma 7 (`PrismaPg` adapter) |
| Autenticación | JWT en cookies HttpOnly (`jose`) |
| Validación | Zod 4 |
| Contraseñas | bcryptjs |
| Email | Nodemailer + Mailtrap |

## Funcionalidades

### Clientes
- **Catálogo** con filtros por tipo (sol/vista), forma de gafa, forma de cara y búsqueda textual
- **Recomendador morfológico** — asistente de 2 pasos que sugiere gafas según la forma de cara del cliente
- **Favoritos** — guardar y gestionar productos favoritos (requiere registro)
- **Autenticación** — registro, login y cierre de sesión
- **Recuperación de contraseña** — envío de enlace por email con token de 1 hora de validez

### Administrador
- **Panel CRUD** de productos con soporte para móvil y escritorio
- **Soft-delete** — ocultar productos del catálogo sin eliminarlos de la BD
- **Eliminación permanente** — borrar productos con confirmación
- **Restaurar** — volver a publicar productos ocultos

## Rutas

| Ruta | Acceso | Descripción |
|------|--------|-------------|
| `/` | Público | Inicio: hero, productos destacados y asistente morfológico |
| `/catalogo` | Público | Catálogo con filtros y paginación (6 por página) |
| `/login` | Público | Login de clientes |
| `/register` | Público | Registro de clientes |
| `/recuperar-contrasena` | Público | Solicitud de reset de contraseña |
| `/reset-password/[token]` | Público | Cambio de contraseña con token |
| `/favoritos` | Protegida (CLIENTE/ADMIN) | Productos favoritos del usuario |
| `/admin/login` | Público | Login de administrador |
| `/admin/dashboard` | Protegida (ADMIN) | Panel de gestión de productos |

## Instalación

### Requisitos previos
- Node.js 18+
- PostgreSQL

### Pasos

```bash
# 1. Clonar el repositorio
git clone <url-del-repo>
cd optica-tfg

# 2. Instalar dependencias (genera el cliente Prisma automáticamente)
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus valores

# 4. Ejecutar migraciones y generar el cliente Prisma
npx prisma migrate dev

# 5. Crear el usuario administrador inicial
npx tsx prisma/seed-admin.ts

# 6. (Opcional) Cargar productos de ejemplo
npx tsx prisma/seed-products.ts

# 7. Iniciar el servidor de desarrollo
npm run dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000).

## Variables de entorno

Crea un fichero `.env` en la raíz con los siguientes valores:

```env
# Base de datos
DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/optica_tfg"

# JWT
JWT_SECRET="tu_secreto_jwt_seguro"

# Credenciales del admin inicial (seed)
ADMIN_EMAIL="admin@optica.com"
ADMIN_PASSWORD="Admin1234!"

# Email (Mailtrap para desarrollo)
MAILTRAP_HOST="sandbox.smtp.mailtrap.io"
MAILTRAP_PORT="2525"
MAILTRAP_USER="tu_usuario_mailtrap"
MAILTRAP_PASS="tu_contraseña_mailtrap"
```

## Comandos útiles

```bash
npm run dev        # Servidor de desarrollo (http://localhost:3000)
npm run build      # Build de producción
npm run lint       # Análisis estático con ESLint

# Prisma
npx prisma migrate dev          # Aplicar migraciones y regenerar cliente
npx prisma generate             # Solo regenerar el cliente Prisma
npx prisma studio               # GUI para explorar la base de datos

# Seeds
npx tsx prisma/seed-admin.ts    # Crear usuario admin inicial
npx tsx prisma/seed-products.ts # Cargar productos de ejemplo
```

## Estructura del proyecto

```
├── app/
│   ├── (public)/            # Páginas públicas (inicio, catálogo)
│   ├── admin/               # Panel de administración
│   ├── api/                 # Endpoints REST
│   │   ├── auth/            # Login, registro, recuperación de contraseña
│   │   ├── products/        # CRUD de productos
│   │   └── favorites/       # Gestión de favoritos
│   ├── favoritos/           # Página de favoritos del cliente
│   ├── generated/prisma/    # Cliente Prisma (auto-generado)
│   └── globals.css
├── components/
│   ├── Navbar.tsx           # Barra de navegación
│   ├── Sidebar.tsx          # Filtros del catálogo
│   ├── ProductCard.tsx      # Tarjeta de producto con toggle favorito
│   ├── ProductForm.tsx      # Formulario CRUD (admin)
│   └── MorphologicalWizard.tsx  # Asistente de recomendación
├── lib/
│   ├── auth.ts              # JWT: sign, verify, helpers de request
│   ├── email.ts             # Envío de email con Nodemailer
│   ├── prisma.ts            # Singleton del cliente Prisma
│   ├── recommender.ts       # Lógica del recomendador morfológico
│   └── schemas.ts           # Schemas de validación Zod
├── prisma/
│   ├── schema.prisma        # Modelo de datos
│   ├── seed-admin.ts        # Seed del administrador
│   └── seed-products.ts     # Seed de productos
└── proxy.ts                 # Protección de rutas (reemplaza middleware.ts en Next.js 16)
```

## Modelo de datos

```
User
├── id, email, passwordHash, rol (ADMIN | CLIENTE)
├── resetToken, resetTokenExpiry
└── favorites → UserFavorites[]

Product
├── id, marca, modelo, precio, descripcion
├── tipo (SOL | VISTA)
├── formaGafa (RECTANGULAR | REDONDA | CUADRADA | ...)
├── formasCaraIdeal (OVALADA | CUADRADA | REDONDA | CORAZON | DIAMANTE)[]
├── activo (soft-delete)
└── imagenes → ImagenProducto[]

ImagenProducto
└── id, url, esPrincipal, productoId

UserFavorites (tabla junction)
└── userId + productId (clave compuesta)
```

## Recomendador morfológico

`lib/recommender.ts` implementa un sistema de compatibilidad entre formas de cara y formas de gafa basado en visagismo. Clasifica cada producto como:

- **ideal** — la forma de cara está en `formasCaraIdeal` del producto
- **compatible** — la forma de la gafa es compatible con la cara según la matriz de compatibilidad
- **neutro** — sin coincidencia específica

El catálogo ordena los productos: ideal → compatible → neutro, mostrando siempre todos los resultados.

## Seguridad

- Contraseñas hasheadas con bcryptjs
- Autenticación mediante JWT almacenado en cookie HttpOnly (no accesible desde JS)
- Protección de rutas en `proxy.ts` con verificación de rol
- Tokens de recuperación de contraseña con expiración de 1 hora
- Validación de entradas con Zod en todos los endpoints

## Credenciales por defecto (desarrollo)

Tras ejecutar `seed-admin.ts`:

| Campo | Valor |
|-------|-------|
| Email | `admin@optica.com` |
| Contraseña | `*********` |
