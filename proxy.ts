import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

export async function proxy(req: NextRequest) {
  const token = req.cookies.get('auth_token')?.value
  const { pathname } = req.nextUrl

  const isAdminRoute = pathname.startsWith('/admin/dashboard')
  const isFavoritosRoute = pathname.startsWith('/favoritos')

  if (!token) {
    if (isAdminRoute) return NextResponse.redirect(new URL('/admin/login', req.url))
    if (isFavoritosRoute) return NextResponse.redirect(new URL('/login?redirect=/favoritos', req.url))
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET)
    const { payload } = await jwtVerify(token!, secret)

    if (isAdminRoute && payload.rol !== 'ADMIN') {
      return NextResponse.redirect(new URL('/admin/login', req.url))
    }
  } catch {
    if (isAdminRoute) return NextResponse.redirect(new URL('/admin/login', req.url))
    if (isFavoritosRoute) return NextResponse.redirect(new URL('/login?redirect=/favoritos', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/dashboard/:path*', '/favoritos'],
}
