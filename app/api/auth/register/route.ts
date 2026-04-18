import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { signJWT } from '@/lib/auth'
import { registerSchema } from '@/lib/schemas'

export async function POST(req: NextRequest) {
  const body = await req.json()

  const parsed = registerSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 }
    )
  }

  const { email, password } = parsed.data

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    return NextResponse.json({ error: 'El email ya está registrado' }, { status: 409 })
  }

  const passwordHash = await bcrypt.hash(password, 12)
  const user = await prisma.user.create({
    data: { email, passwordHash, rol: 'CLIENTE' },
  })

  const token = signJWT({ userId: user.id, email: user.email, rol: 'CLIENTE' })

  const response = NextResponse.json({ ok: true }, { status: 201 })
  response.cookies.set('auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24,
    path: '/',
  })

  return response
}
