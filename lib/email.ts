import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.MAILTRAP_HOST,
  port: Number(process.env.MAILTRAP_PORT),
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASS,
  },
})

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password/${token}`

  await transporter.sendMail({
    from: '"Óptica NOMA" <noreply@optica-noma.com>',
    to: email,
    subject: 'Recuperación de contraseña — Óptica NOMA',
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color: #1d4ed8;">Recuperar contraseña</h2>
        <p>Hemos recibido una solicitud para restablecer la contraseña de tu cuenta.</p>
        <p>Haz clic en el siguiente enlace para crear una nueva contraseña. El enlace expira en <strong>1 hora</strong>.</p>
        <a href="${resetUrl}"
           style="display:inline-block;margin:16px 0;padding:12px 24px;background:#1d4ed8;color:#fff;border-radius:6px;text-decoration:none;font-weight:bold;">
          Restablecer contraseña
        </a>
        <p style="color:#6b7280;font-size:13px;">Si no solicitaste este cambio, ignora este correo.</p>
      </div>
    `,
  })
}
