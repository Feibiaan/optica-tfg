import jwt from 'jsonwebtoken'

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
