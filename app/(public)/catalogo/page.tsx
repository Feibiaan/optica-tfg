'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import ProductCard from '@/components/ProductCard'
import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'

interface Imagen {
  id: string
  url: string
  esPrincipal: boolean
}

interface Product {
  id: string
  marca: string
  modelo: string
  precio: number
  tipo: string
  formaGafa: string
  formasCaraIdeal: string[]
  activo: boolean
  imagenes: Imagen[]
}

const PAGE_SIZE = 6

function CatalogoContent() {
  const searchParams = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)

  const tipo = searchParams.get('tipo') ?? ''
  const formaGafa = searchParams.get('formaGafa') ?? ''
  const cara = searchParams.get('cara') ?? ''
  const busqueda = searchParams.get('q') ?? ''

  useEffect(() => {
    setLoading(true)
    setPage(1)
    const params = new URLSearchParams()
    if (tipo) params.set('tipo', tipo)
    if (formaGafa) params.set('formaGafa', formaGafa)
    if (cara) params.set('cara', cara)
    if (busqueda) params.set('q', busqueda)

    fetch(`/api/products?${params.toString()}`)
      .then((r) => r.json())
      .then((data) => { setProducts(data); setLoading(false) })
  }, [tipo, formaGafa, cara, busqueda])

  const totalPages = Math.ceil(products.length / PAGE_SIZE)
  const paginated = products.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-6xl mx-auto p-6 flex gap-6">
        <Sidebar />

        <div className="flex-1">
          <h1 className="text-2xl font-bold mb-6">Catálogo de gafas</h1>

          {loading ? (
            <p className="text-center text-gray-500 py-12">Cargando productos...</p>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {paginated.map((product) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    marca={product.marca}
                    modelo={product.modelo}
                    precio={product.precio}
                    imagenes={product.imagenes}
                  />
                ))}
              </div>

              {products.length === 0 && (
                <p className="text-center text-gray-500 py-12">
                  No hay productos con los filtros seleccionados.
                </p>
              )}

              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 border rounded disabled:opacity-50 hover:bg-gray-100"
                  >
                    Anterior
                  </button>
                  <span className="px-4 py-2 text-sm text-gray-600">
                    Página {page} de {totalPages}
                  </span>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="px-4 py-2 border rounded disabled:opacity-50 hover:bg-gray-100"
                  >
                    Siguiente
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  )
}

export default function CatalogoPage() {
  return (
    <Suspense>
      <CatalogoContent />
    </Suspense>
  )
}
