import jwt from 'jsonwebtoken'
import { NextRequest } from 'next/server'

export interface JWTPayload {
  userId: string
  email: string
  rol: 'ADMIN' | 'CLIENTE'
}

export function signJWT(payload: JWTPayload): string {
  const secret = process.env.JWT_SECRET
  if (!secret) throw new Error('JWT_SECRET no está configurado')
  return jwt.sign(payload, secret, { expiresIn: '24h' })
}

export function verifyJWT(token: string): JWTPayload | null {
  const secret = process.env.JWT_SECRET
  if (!secret) throw new Error('JWT_SECRET no está configurado')
  try {
    return jwt.verify(token, secret) as JWTPayload
  } catch {
    return null
  }
}

export function getAdminFromRequest(req: NextRequest): JWTPayload | null {
  const token = req.cookies.get('auth_token')?.value
  if (!token) return null
  const payload = verifyJWT(token)
  if (!payload || payload.rol !== 'ADMIN') return null
  return payload
}
