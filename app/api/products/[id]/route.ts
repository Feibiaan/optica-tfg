import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { productSchema } from '@/lib/schemas'
import { getAdminFromRequest } from '@/lib/auth'

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = getAdminFromRequest(req)
  if (!admin) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const { id } = await params
  const body = await req.json()
  const parsed = productSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 }
    )
  }

  const { imagenes, ...productData } = parsed.data

  // Borrar imágenes anteriores y recrear
  await prisma.imagenProducto.deleteMany({ where: { productoId: id } })

  const product = await prisma.product.update({
    where: { id },
    data: {
      ...productData,
      imagenes: {
        create: imagenes,
      },
    },
    include: { imagenes: true },
  })

  return NextResponse.json(product)
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = getAdminFromRequest(req)
  if (!admin) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const { id } = await params

  // Soft-delete: solo marca como inactivo
  const product = await prisma.product.update({
    where: { id },
    data: { activo: false },
  })

  return NextResponse.json(product)
}
