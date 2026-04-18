import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromRequest } from '@/lib/auth'

// GET /api/favorites — lista IDs de productos favoritos del usuario
export async function GET(req: NextRequest) {
  const user = getUserFromRequest(req)
  if (!user) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  }

  const favorites = await prisma.userFavorites.findMany({
    where: { userId: user.userId },
    select: { productId: true },
  })

  return NextResponse.json(favorites.map((f) => f.productId))
}

// POST /api/favorites — toggle favorito { productId }
export async function POST(req: NextRequest) {
  const user = getUserFromRequest(req)
  if (!user) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  }

  const { productId } = await req.json()
  if (!productId) {
    return NextResponse.json({ error: 'productId requerido' }, { status: 400 })
  }

  const existing = await prisma.userFavorites.findUnique({
    where: { userId_productId: { userId: user.userId, productId } },
  })

  if (existing) {
    await prisma.userFavorites.delete({
      where: { userId_productId: { userId: user.userId, productId } },
    })
    return NextResponse.json({ action: 'removed' })
  }

  await prisma.userFavorites.create({
    data: { userId: user.userId, productId },
  })
  return NextResponse.json({ action: 'added' })
}
