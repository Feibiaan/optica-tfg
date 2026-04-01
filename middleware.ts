import { NextRequest, NextResponse } from 'next/server'
import { verifyJWT } from '@/lib/auth'

export function middleware(req: NextRequest) {
  const token = req.cookies.get('auth_token')?.value

  if (!token) {
    return NextResponse.redirect(new URL('/admin/login', req.url))
  }

  const payload = verifyJWT(token)
  if (!payload || payload.rol !== 'ADMIN') {
    return NextResponse.redirect(new URL('/admin/login', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/dashboard/:path*'],
}
