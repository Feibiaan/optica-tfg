'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import ProductCard from '@/components/ProductCard'

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
  imagenes: Imagen[]
}

export default function FavoritosPage() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      // Cargar IDs de favoritos
      const favRes = await fetch('/api/favorites')
      if (favRes.status === 401) {
        router.push('/login?redirect=/favoritos')
        return
      }
      const ids: string[] = await favRes.json()
      setFavoriteIds(new Set(ids))

      if (ids.length === 0) {
        setLoading(false)
        return
      }

      // Cargar todos los productos y filtrar los favoritos
      const prodRes = await fetch('/api/products')
      const allProducts: Product[] = await prodRes.json()
      setProducts(allProducts.filter((p) => ids.includes(p.id)))
      setLoading(false)
    }

    load()
  }, [router])

  async function handleToggle(productId: string) {
    await fetch('/api/favorites', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId }),
    })

    setFavoriteIds((prev) => {
      const next = new Set(prev)
      if (next.has(productId)) {
        next.delete(productId)
      } else {
        next.add(productId)
      }
      return next
    })

    setProducts((prev) => prev.filter((p) => favoriteIds.has(p.id) && p.id !== productId))
  }

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-6xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Mis favoritos</h1>
          <button
            onClick={handleLogout}
            className="text-sm text-gray-500 hover:text-gray-800 transition-colors cursor-pointer"
          >
            Cerrar sesión
          </button>
        </div>

        {loading ? (
          <p className="text-center text-gray-500 py-12">Cargando...</p>
        ) : products.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg mb-4">No tienes productos guardados todavía.</p>
            <Link
              href="/catalogo"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded transition-colors"
            >
              Ver catálogo
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                marca={product.marca}
                modelo={product.modelo}
                precio={product.precio}
                imagenes={product.imagenes}
                isFavorito={favoriteIds.has(product.id)}
                isLoggedIn={true}
                onToggleFavorito={handleToggle}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
