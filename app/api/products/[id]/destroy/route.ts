import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminFromRequest } from '@/lib/auth'

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = getAdminFromRequest(req)
  if (!admin) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const { id } = await params

  // Eliminar imágenes primero por FK constraint
  await prisma.imagenProducto.deleteMany({ where: { productoId: id } })
  // Eliminar favoritos que referencien el producto
  await prisma.userFavorites.deleteMany({ where: { productId: id } })
  // Eliminación permanente
  await prisma.product.delete({ where: { id } })

  return NextResponse.json({ ok: true })
}
