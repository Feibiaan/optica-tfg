import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { productSchema } from '@/lib/schemas'
import { getAdminFromRequest } from '@/lib/auth'

// GET: público devuelve solo activos; admin con token devuelve todos
export async function GET(req: NextRequest) {
  const admin = getAdminFromRequest(req)
  const where = admin ? {} : { activo: true }

  const products = await prisma.product.findMany({
    where,
    include: { imagenes: true },
    orderBy: { marca: 'asc' },
  })

  return NextResponse.json(products)
}

export async function POST(req: NextRequest) {
  const admin = getAdminFromRequest(req)
  if (!admin) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const body = await req.json()
  const parsed = productSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 }
    )
  }

  const { imagenes, ...productData } = parsed.data

  const product = await prisma.product.create({
    data: {
      ...productData,
      imagenes: {
        create: imagenes,
      },
    },
    include: { imagenes: true },
  })

  return NextResponse.json(product, { status: 201 })
}
