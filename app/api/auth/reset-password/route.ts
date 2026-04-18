import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { resetPasswordSchema } from '@/lib/schemas'

export async function POST(req: NextRequest) {
  const body = await req.json()

  const parsed = resetPasswordSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 }
    )
  }

  const { token, password } = parsed.data

  const user = await prisma.user.findFirst({
    where: {
      resetToken: token,
      resetTokenExpiry: { gt: new Date() },
    },
  })

  if (!user) {
    return NextResponse.json(
      { error: 'El enlace de recuperación no es válido o ha expirado.' },
      { status: 400 }
    )
  }

  const passwordHash = await bcrypt.hash(password, 12)

  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash, resetToken: null, resetTokenExpiry: null },
  })

  return NextResponse.json({ ok: true })
}
