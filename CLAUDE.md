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
| `/` | Pública | Inicio: hero, productos destacados, asistente morfológico |
| `/catalogo` | Pública | Catálogo con filtros y paginación |
| `/admin/login` | Pública | Login de administrador |
| `/admin/dashboard` | Protegida (ADMIN) | CRUD de productos |

Las rutas públicas viven en `app/(public)/`. Las rutas de admin en `app/admin/`.

### Autenticación

- `lib/auth.ts` — `signJWT`, `verifyJWT`, `getAdminFromRequest`. Payload: `{ userId, email, rol: 'ADMIN' | 'CLIENTE' }`, expiración 24h.
- `proxy.ts` — **reemplaza al antiguo `middleware.ts`** (renombrado en Next.js 16). Protege `/admin/dashboard/**`. Lee cookie `auth_token`, verifica JWT y comprueba rol `ADMIN`. Redirige a `/admin/login` si no autorizado.
- `app/api/auth/login/route.ts` / `logout/route.ts` — endpoints de autenticación. Login establece cookie `auth_token`.
- Usuario admin inicial: `admin@optica.com` / `Admin1234!` (creado con `seed-admin.ts`).

> En Next.js 16 el fichero se llama `proxy.ts` (no `middleware.ts`) y la función exportada es `proxy`, no `middleware`.

### Base de datos

Schema en `prisma/schema.prisma`. Cliente generado en `app/generated/prisma` (no en `node_modules`). Importar siempre desde `@/app/generated/prisma`, no desde `@prisma/client`. Singleton en `lib/prisma.ts` usando `PrismaPg` adapter.

Modelos principales:
- **User** — email único, passwordHash, rol (`ADMIN` | `CLIENTE`), favoritos
- **Product** — marca, modelo, precio, tipo (`SOL` | `VISTA`), formaGafa, formasCaraIdeal (array `FormaCara[]`), descripcion, activo
- **ImagenProducto** — url, esPrincipal, FK a Product
- **UserFavorites** — tabla junction User↔Product

Enums disponibles: `Rol`, `TipoGafa`, `FormaGafa`, `FormaCara`.

#### Operaciones de productos

- `GET /api/products` — público devuelve solo `activo: true`; admin (JWT válido) devuelve todos. Filtros: `tipo`, `formaGafa`, `cara` (hasSome en array), `q` (búsqueda insensitive en marca/modelo).
- `POST /api/products` — solo admin. Crea producto + imágenes en transacción.
- `PUT /api/products/[id]` — solo admin. Borra imágenes previas y recrea.
- `DELETE /api/products/[id]` — solo admin. **Soft-delete**: marca `activo: false`, no elimina de BD.

### Componentes

- `Navbar.tsx` — barra de navegación sticky con logo NOMA
- `Sidebar.tsx` — filtros del catálogo (tipo, forma gafa, forma cara, búsqueda); actualiza URL con searchParams
- `ProductCard.tsx` — tarjeta de producto con hover de imagen y toggle de favorito
- `ProductForm.tsx` — formulario CRUD de productos con validación Zod
- `MorphologicalWizard.tsx` — asistente 2 pasos (forma cara → tipo gafa) que redirige a `/catalogo?cara=X&tipo=Y`

### Recomendador morfológico

`lib/recommender.ts` — clasifica productos como `ideal / compatible / neutro` según la forma de cara seleccionada y ordena el catálogo en consecuencia.

### Validación

`lib/schemas.ts` contiene todos los schemas Zod: `loginSchema`, `registerSchema`, `productSchema`. Usar siempre estos schemas para validar inputs en API routes.

### Variables de entorno

`DATABASE_URL`, `JWT_SECRET`, `ADMIN_EMAIL` y `ADMIN_PASSWORD` requeridas (ver `.env`). Las dos últimas son usadas por `prisma/seed-admin.ts` para crear el usuario administrador inicial.
