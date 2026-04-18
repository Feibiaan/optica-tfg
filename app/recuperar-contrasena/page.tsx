'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function RecuperarContrasenaPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })

    setLoading(false)
    setSent(true)
  }

  if (sent) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-sm text-center">
          <div className="text-4xl mb-4">📧</div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Revisa tu correo</h1>
          <p className="text-gray-600 text-sm">
            Si el email está registrado, recibirás un enlace para restablecer tu contraseña en los próximos minutos.
          </p>
          <Link href="/login" className="inline-block mt-6 text-blue-600 hover:underline text-sm">
            Volver al inicio de sesión
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-sm">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Recuperar contraseña</h1>
        <p className="text-gray-600 text-sm mb-6">
          Introduce tu email y te enviaremos un enlace para restablecer tu contraseña.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoComplete="email"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition-colors disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'Enviando...' : 'Enviar enlace'}
          </button>
        </form>

        <p className="text-sm text-gray-600 mt-4 text-center">
          <Link href="/login" className="text-blue-600 hover:underline">
            Volver al inicio de sesión
          </Link>
        </p>
      </div>
    </div>
  )
}
