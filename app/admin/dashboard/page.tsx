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

function TrashIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  )
}

export default function DashboardPage() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
  const [confirmDestroyId, setConfirmDestroyId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  async function fetchProducts() {
    const res = await fetch('/api/products?includeInactive=true')
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

  async function handleDestroy(id: string) {
    await fetch(`/api/products/${id}/destroy`, { method: 'DELETE' })
    setConfirmDestroyId(null)
    fetchProducts()
  }

  async function handleRestore(id: string) {
    await fetch(`/api/products/${id}/restore`, { method: 'POST' })
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
      <header className="bg-white shadow px-4 py-4 flex justify-between items-center">
        <h1 className="text-base sm:text-xl text-gray-900 font-bold leading-tight">
          Panel de Administración
          <span className="hidden sm:inline"> — Óptica</span>
        </h1>
        <button
          onClick={handleLogout}
          className="text-sm text-red-600 hover:underline cursor-pointer shrink-0 ml-4"
        >
          Cerrar sesión
        </button>
      </header>

      <main className="max-w-6xl mx-auto p-4 sm:p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-base sm:text-lg text-gray-900 font-semibold">
            Productos ({products.length})
          </h2>
          <button
            onClick={() => { setEditingProduct(null); setShowForm(true) }}
            className="bg-blue-600 text-white px-3 py-2 sm:px-4 text-sm rounded hover:bg-blue-700 cursor-pointer"
          >
            + Añadir producto
          </button>
        </div>

        {/* Modal formulario */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90dvh] overflow-y-auto p-4 sm:p-6">
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

        {/* Modal confirmación ocultar */}
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
                  className="px-4 py-2 text-gray-600 border rounded hover:bg-gray-50 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => handleDelete(confirmDeleteId)}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 cursor-pointer"
                >
                  Ocultar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal confirmación eliminación permanente */}
        {confirmDestroyId && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full mx-4">
              <h3 className="font-semibold text-red-700 mb-2">¿Eliminar producto permanentemente?</h3>
              <p className="text-sm text-gray-600 mb-4">
                Esta acción <strong>no se puede deshacer</strong>. El producto y todas sus imágenes serán eliminados de la base de datos.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setConfirmDestroyId(null)}
                  className="px-4 py-2 text-gray-600 border rounded hover:bg-gray-50 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => handleDestroy(confirmDestroyId)}
                  className="px-4 py-2 bg-red-700 text-white rounded hover:bg-red-800 cursor-pointer"
                >
                  Eliminar definitivamente
                </button>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <p className="text-center text-gray-500 py-12">Cargando...</p>
        ) : products.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No hay productos. Añade el primero.</p>
        ) : (
          <>
            {/* Vista móvil: tarjetas */}
            <div className="sm:hidden flex flex-col gap-3">
              {products.map((p) => (
                <div
                  key={p.id}
                  className={`bg-white rounded-lg shadow p-4 ${!p.activo ? 'opacity-60' : ''}`}
                >
                  <div className="flex justify-between items-start gap-2">
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900 truncate">{p.marca} {p.modelo}</p>
                      <p className="text-sm text-gray-500">{p.tipo} · {p.formaGafa}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`px-2 py-0.5 rounded text-xs whitespace-nowrap ${p.activo ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                        {p.activo ? 'Activo' : 'Oculto'}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 mt-1 font-medium">{Number(p.precio).toFixed(2)} €</p>
                  <div className="flex gap-3 mt-3 pt-3 border-t items-center">
                    <button
                      onClick={() => { setEditingProduct(p); setShowForm(true) }}
                      className="text-sm text-blue-600 hover:underline cursor-pointer"
                    >
                      Editar
                    </button>
                    {p.activo ? (
                      <button
                        onClick={() => setConfirmDeleteId(p.id)}
                        className="text-sm text-red-600 hover:underline cursor-pointer"
                      >
                        Ocultar
                      </button>
                    ) : (
                      <button
                        onClick={() => handleRestore(p.id)}
                        className="text-sm text-green-600 hover:underline cursor-pointer"
                      >
                        Mostrar
                      </button>
                    )}
                    <button
                      onClick={() => setConfirmDestroyId(p.id)}
                      title="Eliminar permanentemente"
                      className="ml-auto text-gray-400 hover:text-red-700 transition-colors cursor-pointer"
                    >
                      <TrashIcon />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Vista desktop: tabla */}
            <div className="hidden sm:block bg-white rounded-lg shadow overflow-hidden">
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
                      <td className="px-4 text-gray-600 py-3 font-medium">{p.marca} {p.modelo}</td>
                      <td className="px-4 text-gray-600 py-3">{Number(p.precio).toFixed(2)} €</td>
                      <td className="px-4 text-gray-600 py-3">{p.tipo}</td>
                      <td className="px-4 text-gray-600 py-3">{p.formaGafa}</td>
                      <td className="px-4 text-gray-600 py-3">
                        <span className={`px-2 py-1 rounded text-xs ${p.activo ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                          {p.activo ? 'Activo' : 'Oculto'}
                        </span>
                      </td>
                      <td className="px-4 py-3 flex gap-2 items-center">
                        <button
                          onClick={() => { setEditingProduct(p); setShowForm(true) }}
                          className="text-blue-600 hover:underline cursor-pointer"
                        >
                          Editar
                        </button>
                        {p.activo ? (
                          <button
                            onClick={() => setConfirmDeleteId(p.id)}
                            className="text-red-600 hover:underline cursor-pointer"
                          >
                            Ocultar
                          </button>
                        ) : (
                          <button
                            onClick={() => handleRestore(p.id)}
                            className="text-green-600 hover:underline cursor-pointer"
                          >
                            Mostrar
                          </button>
                        )}
                        <button
                          onClick={() => setConfirmDestroyId(p.id)}
                          title="Eliminar permanentemente"
                          className="text-gray-400 hover:text-red-700 transition-colors cursor-pointer"
                        >
                          <TrashIcon />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </main>
    </div>
  )
}
