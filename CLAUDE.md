# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev        # Desarrollo (http://localhost:3000)
npm run build      # Build de producción
npm run lint       # ESLint

# Base de datos
npx prisma migrate dev          # Aplicar migraciones y regenerar cliente
npx prisma generate             # Solo regenerar el cliente Prisma
npx prisma studio               # GUI para explorar la BD
npx tsx prisma/seed-admin.ts    # Crear usuario admin inicial
npx tsx prisma/seed-products.ts # Seed de productos de ejemplo
```

No hay tests configurados actualmente.

## Arquitectura

Aplicación de gestión de óptica (TFG). Next.js 16 con App Router, PostgreSQL vía Prisma 7, autenticación JWT con cookies HttpOnly.

### Stack

- **Frontend**: Next.js 16 + React 19 + TypeScript + Tailwind CSS 4
- **Backend**: Next.js API Routes
- **BD**: PostgreSQL con Prisma 7 (`PrismaPg` adapter)
- **Autenticación**: JWT en cookies HttpOnly (`jose`)
- **Validación**: Zod 4
- **Passwords**: bcryptjs

### Rutas

| Ruta | Tipo | Descripción |
|------|------|-------------|
| `/` | Pública | Inicio: hero, 4 productos destacados aleatorios, asistente morfológico |
| `/catalogo` | Pública | Catálogo con filtros, búsqueda y paginación (6 por página) |
| `/login` | Pública | Login de clientes; soporta `?redirect=/path` |
| `/register` | Pública | Registro de clientes; redirige a `/favoritos` tras éxito |
| `/recuperar-contrasena` | Pública | Solicitud de reset de contraseña |
| `/reset-password/[token]` | Pública | Cambio de contraseña con token (1h de validez) |
| `/favoritos` | Protegida (CLIENTE/ADMIN) | Productos favoritos del usuario |
| `/admin/login` | Pública | Login de administrador |
| `/admin/dashboard` | Protegida (ADMIN) | CRUD de productos |

Solo `/` y `/catalogo` viven en `app/(public)/`. El resto de rutas públicas (`/login`, `/register`, `/recuperar-contrasena`, `/reset-password/[token]`) y la ruta protegida `/favoritos` viven directamente en `app/`. Las rutas de admin viven en `app/admin/`. `/favoritos` y `/admin/dashboard` están protegidas por `proxy.ts`.

### Autenticación

- `lib/auth.ts` — `signJWT`, `verifyJWT`, `getAdminFromRequest`, `getUserFromRequest`. Payload: `{ userId, email, rol: 'ADMIN' | 'CLIENTE' }`, expiración 24h.
- `proxy.ts` — **reemplaza al antiguo `middleware.ts`** (renombrado en Next.js 16). Protege `/admin/dashboard/**` y `/favoritos`. Lee cookie `auth_token`, verifica JWT y comprueba rol. Redirige a `/admin/login` o `/login?redirect=...` si no autorizado.
- `app/api/auth/login/route.ts` — valida credenciales (bcryptjs), establece cookie `auth_token`. Devuelve `{ ok, rol }`.
- `app/api/auth/register/route.ts` — crea usuario CLIENTE con hash de contraseña. Error 409 si email existe.
- `app/api/auth/logout/route.ts` — limpia cookie `auth_token`.
- `app/api/auth/forgot-password/route.ts` — genera token aleatorio (32 bytes hex, 1h de validez), lo guarda en BD y envía email con enlace `/reset-password/{token}`. Siempre responde genéricamente para no revelar si el email existe.
- `app/api/auth/reset-password/route.ts` — valida token y expiry, actualiza contraseña con nuevo hash, limpia token.
- Usuario admin inicial: `admin@optica.com` / `Admin1234!` (creado con `seed-admin.ts`).

> En Next.js 16 el fichero se llama `proxy.ts` (no `middleware.ts`) y la función exportada es `proxy`, no `middleware`.

### Base de datos

Schema en `prisma/schema.prisma`. Cliente generado en `app/generated/prisma` (no en `node_modules`). Importar siempre desde `@/app/generated/prisma`, no desde `@prisma/client`. Singleton en `lib/prisma.ts` usando `PrismaPg` adapter.

Modelos principales:
- **User** — id (uuid), email único, passwordHash, rol (`ADMIN` | `CLIENTE`), resetToken, resetTokenExpiry, favoritos
- **Product** — id (uuid), marca, modelo, precio (Decimal), tipo (`SOL` | `VISTA`), formaGafa, formasCaraIdeal (array `FormaCara[]`), descripcion, activo (default true), imagenes
- **ImagenProducto** — id (uuid), url, esPrincipal, FK productoId
- **UserFavorites** — clave compuesta (userId, productId); tabla junction User↔Product

Enums disponibles: `Rol`, `TipoGafa`, `FormaGafa`, `FormaCara`.

#### Operaciones de productos

- `GET /api/products` — siempre filtra por `activo: true` salvo que el admin pase `?includeInactive=true`. Filtros: `tipo`, `formaGafa`, `cara` (hasSome en array), `q` (búsqueda insensitive en marca/modelo).
- `POST /api/products` — solo admin. Crea producto + imágenes en transacción.
- `PUT /api/products/[id]` — solo admin. Borra imágenes previas y recrea.
- `DELETE /api/products/[id]` — solo admin. **Soft-delete**: marca `activo: false`, no elimina de BD.
- `POST /api/products/[id]/restore` — solo admin. **Soft-restore**: marca `activo: true`.

> **Importante**: el catálogo público nunca debe pasar `?includeInactive=true`. El dashboard admin sí lo pasa para ver todos los productos. Esto evita que productos ocultos se muestren en el catálogo cuando el admin tiene sesión activa (la cookie `auth_token` se envía en todas las peticiones del mismo origen).

#### Operaciones de favoritos

- `GET /api/favorites` — requiere auth (cualquier rol). Devuelve array de `productId` del usuario autenticado.
- `POST /api/favorites` — requiere auth. Body: `{ productId }`. Toggle: si existe lo elimina (`{ action: 'removed' }`), si no lo crea (`{ action: 'added' }`).

### Componentes

- `Navbar.tsx` — barra de navegación sticky con logo NOMA. Links a catálogo por tipo, `/favoritos`, `/login`, `/register`.
- `Sidebar.tsx` — filtros del catálogo (tipo, forma gafa, forma cara, búsqueda); actualiza URL con searchParams. Modo drawer en móvil.
- `ProductCard.tsx` — tarjeta de producto con hover de imagen y toggle de favorito (corazón). Requiere `isLoggedIn` para mostrar botón.
- `ProductForm.tsx` — formulario CRUD de productos (admin). Campos: marca, modelo, precio, tipo, formaGafa, formasCaraIdeal (checkboxes), descripcion, URL imagen principal y secundaria. Valida con `productSchema`.
- `MorphologicalWizard.tsx` — asistente 2 pasos (forma cara → tipo gafa) que redirige a `/catalogo?cara=X&tipo=Y`.

### Recomendador morfológico

`lib/recommender.ts` — clasifica productos como `ideal / compatible / neutro` según la forma de cara seleccionada y ordena el catálogo en consecuencia. Funciones: `clasificarProducto`, `ordenarPorCompatibilidad`, `buildCatalogoUrl`.

### Email

`lib/email.ts` — envía email de reset de contraseña con Nodemailer + Mailtrap. Variables de entorno requeridas: `MAILTRAP_HOST`, `MAILTRAP_PORT`, `MAILTRAP_USER`, `MAILTRAP_PASS`.

### Validación

`lib/schemas.ts` contiene todos los schemas Zod: `loginSchema`, `registerSchema`, `productSchema`. Usar siempre estos schemas para validar inputs en API routes.

**Zod 4 — breaking changes relevantes:**
- `errorMap` → `error` en opciones de `z.enum()` y similares
- `ZodError.errors` → `ZodError.issues`

### Variables de entorno

| Variable | Uso |
|----------|-----|
| `DATABASE_URL` | Conexión PostgreSQL |
| `JWT_SECRET` | Firma de tokens JWT |
| `ADMIN_EMAIL` | Seed admin (`seed-admin.ts`) |
| `ADMIN_PASSWORD` | Seed admin (`seed-admin.ts`) |
| `MAILTRAP_HOST` | Servidor SMTP (reset password) |
| `MAILTRAP_PORT` | Puerto SMTP |
| `MAILTRAP_USER` | Usuario SMTP |
| `MAILTRAP_PASS` | Contraseña SMTP |
