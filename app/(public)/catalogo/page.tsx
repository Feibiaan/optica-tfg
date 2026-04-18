/* eslint-disable react-hooks/set-state-in-effect */
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
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set())
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const tipo = searchParams.get('tipo') ?? ''
  const formaGafa = searchParams.get('formaGafa') ?? ''
  const cara = searchParams.get('cara') ?? ''
  const busqueda = searchParams.get('q') ?? ''

  useEffect(() => {
    fetch('/api/favorites')
      .then((r) => {
        if (r.ok) {
          setIsLoggedIn(true)
          return r.json()
        }
        return []
      })
      .then((ids: string[]) => setFavoriteIds(new Set(ids)))
  }, [])

  async function handleToggleFavorito(productId: string) {
    const res = await fetch('/api/favorites', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId }),
    })
    if (res.status === 401) {
      window.location.href = '/login?redirect=/catalogo'
      return
    }
    const data = await res.json()
    setFavoriteIds((prev) => {
      const next = new Set(prev)
      data.action === 'added' ? next.add(productId) : next.delete(productId)
      return next
    })
  }

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
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Catálogo de gafas</h1>

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
                    isFavorito={favoriteIds.has(product.id)}
                    isLoggedIn={isLoggedIn}
                    onToggleFavorito={handleToggleFavorito}
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
                    className={`px-4 py-2 border text-gray-500 rounded ${
                      page === 1
                      ? "disabled:opacity-50 cursor-not-allowed"
                      : "hover:bg-gray-200 cursor-pointer"
                    } `}
                  >
                    Anterior
                  </button>
                  <span className="px-4 py-2 text-sm text-gray-600">
                    Página {page} de {totalPages}
                  </span>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className={`px-4 py-2 border text-gray-500 rounded ${
                      page === totalPages
                      ? "disabled:opacity-50 cursor-not-allowed"
                      : "hover:bg-gray-200 cursor-pointer"
                    } `}
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
