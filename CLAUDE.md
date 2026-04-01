# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev        # Desarrollo (http://localhost:3000)
npm run build      # Build de producción
npm run lint       # ESLint

# Base de datos
npx prisma migrate dev     # Aplicar migraciones y regenerar cliente
npx prisma generate        # Solo regenerar el cliente Prisma
npx prisma studio          # GUI para explorar la BD
npx tsx prisma/seed-admin.ts  # Crear usuario admin inicial
```

No hay tests configurados actualmente.

## Arquitectura

Aplicación de gestión de óptica (TFG). Next.js 16 con App Router, PostgreSQL vía Prisma 7, autenticación JWT con cookies HttpOnly.

### Autenticación

- `lib/auth.ts` — firma y verifica JWTs (`signJWT`, `verifyJWT`). Payload: `{ userId, email, rol: 'ADMIN' | 'CLIENTE' }`, expiración 24h.
- `middleware.ts` — protege `/admin/dashboard/**`. Lee cookie `auth_token`, verifica JWT y comprueba rol `ADMIN`. Redirige a `/admin/login` si no autorizado.
- `app/api/auth/login/route.ts` / `logout/route.ts` — endpoints de autenticación. Login establece cookie `auth_token`.
- Usuario admin inicial: `admin@optica.com` / `Admin1234!` (creado con `seed-admin.ts`).

### Base de datos

Schema en `prisma/schema.prisma`. Cliente generado en `app/generated/prisma` (no en `node_modules`). Importar siempre desde `@/app/generated/prisma`, no desde `@prisma/client`. Singleton en `lib/prisma.ts` usando `PrismaPg` adapter.

Modelos principales:
- **User** — email único, passwordHash, rol (`ADMIN` | `CLIENTE`), favoritos
- **Product** — marca, modelo, precio, tipo (`SOL` | `VISTA`), formaGafa, formasCaraIdeal (array de `FormaCara`), imagenes, activo
- **ImagenProducto** — url, esPrincipal, FK a Product
- **UserFavorites** — tabla junction User↔Product

### Validación

`lib/schemas.ts` contiene todos los schemas Zod: `loginSchema`, `registerSchema`, `productSchema`. Usar siempre estos schemas para validar inputs en API routes.

### Variables de entorno

`DATABASE_URL`, `JWT_SECRET`, `ADMIN_EMAIL` y `ADMIN_PASSWORD` requeridas (ver `.env`). Las dos últimas son usadas por `prisma/seed-admin.ts` para crear el usuario administrador inicial.
