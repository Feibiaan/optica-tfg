'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import ProductForm from '@/components/ProductForm'

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
  descripcion: string | null
  activo: boolean
  imagenes: Imagen[]
}

export default function DashboardPage() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  async function fetchProducts() {
    const res = await fetch('/api/products')
    const data = await res.json()
    setProducts(data)
    setLoading(false)
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProducts()
  }, [])

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  async function handleDelete(id: string) {
    await fetch(`/api/products/${id}`, { method: 'DELETE' })
    setConfirmDeleteId(null)
    fetchProducts()
  }

  function getFormInitialData(p: Product) {
    return {
      id: p.id,
      marca: p.marca,
      modelo: p.modelo,
      precio: p.precio,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      tipo: p.tipo as any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      formaGafa: p.formaGafa as any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      formasCaraIdeal: p.formasCaraIdeal as any,
      descripcion: p.descripcion ?? undefined,
      imagenes: p.imagenes.map((img) => ({
        url: img.url,
        esPrincipal: img.esPrincipal,
      })),
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl text-gray-900 font-bold">Panel de Administración — Óptica</h1>
        <button
          onClick={handleLogout}
          className="text-sm text-red-600 hover:underline"
        >
          Cerrar sesión
        </button>
      </header>

      <main className="max-w-6xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg text-gray-900 font-semibold">Productos ({products.length})</h2>
          <button
            onClick={() => { setEditingProduct(null); setShowForm(true) }}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            + Añadir producto
          </button>
        </div>

        {/* Modal formulario */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-screen overflow-y-auto p-6">
              <h3 className="text-lg font-semibold text-gray-500 mb-4">
                {editingProduct ? 'Editar producto' : 'Nuevo producto'}
              </h3>
              <ProductForm
                initialData={editingProduct ? getFormInitialData(editingProduct) : undefined}
                onSuccess={() => { setShowForm(false); setEditingProduct(null); fetchProducts() }}
                onCancel={() => { setShowForm(false); setEditingProduct(null) }}
              />
            </div>
          </div>
        )}

        {/* Modal confirmación borrado */}
        {confirmDeleteId && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full mx-4">
              <h3 className="font-semibold text-gray-700 mb-2">¿Ocultar producto?</h3>
              <p className="text-sm text-gray-600 mb-4">
                El producto no se eliminará, solo dejará de aparecer en el catálogo.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setConfirmDeleteId(null)}
                  className="px-4 py-2 border rounded hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => handleDelete(confirmDeleteId)}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Ocultar
                </button>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <p className="text-center text-gray-500 py-12">Cargando...</p>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="text-left text-gray-900 px-4 py-3">Marca / Modelo</th>
                  <th className="text-left text-gray-900 px-4 py-3">Precio</th>
                  <th className="text-left text-gray-900 px-4 py-3">Tipo</th>
                  <th className="text-left text-gray-900 px-4 py-3">Forma</th>
                  <th className="text-left text-gray-900 px-4 py-3">Estado</th>
                  <th className="text-left text-gray-900 px-4 py-3">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className={`border-t ${!p.activo ? 'opacity-50' : ''}`}>
                    <td className="px-4 py-3 font-medium">{p.marca} {p.modelo}</td>
                    <td className="px-4 py-3">{Number(p.precio).toFixed(2)} €</td>
                    <td className="px-4 py-3">{p.tipo}</td>
                    <td className="px-4 py-3">{p.formaGafa}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs ${p.activo ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                        {p.activo ? 'Activo' : 'Oculto'}
                      </span>
                    </td>
                    <td className="px-4 py-3 flex gap-2">
                      <button
                        onClick={() => { setEditingProduct(p); setShowForm(true) }}
                        className="text-blue-600 hover:underline"
                      >
                        Editar
                      </button>
                      {p.activo && (
                        <button
                          onClick={() => setConfirmDeleteId(p.id)}
                          className="text-red-600 hover:underline"
                        >
                          Ocultar
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {products.length === 0 && (
              <p className="text-center text-gray-500 py-8">No hay productos. Añade el primero.</p>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
