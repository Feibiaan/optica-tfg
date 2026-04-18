import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { prisma } from '@/lib/prisma'
import { sendPasswordResetEmail } from '@/lib/email'
import { forgotPasswordSchema } from '@/lib/schemas'

export async function POST(req: NextRequest) {
  const body = await req.json()

  const parsed = forgotPasswordSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 }
    )
  }

  const { email } = parsed.data

  // Respuesta genérica siempre para no revelar si el email existe
  const genericResponse = NextResponse.json({
    ok: true,
    message: 'Si el email está registrado, recibirás un enlace de recuperación.',
  })

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user || user.rol !== 'CLIENTE') return genericResponse

  const token = crypto.randomBytes(32).toString('hex')
  const expiry = new Date(Date.now() + 60 * 60 * 1000) // 1 hora

  await prisma.user.update({
    where: { id: user.id },
    data: { resetToken: token, resetTokenExpiry: expiry },
  })

  await sendPasswordResetEmail(email, token)

  return genericResponse
}
