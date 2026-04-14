'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useState } from 'react'

const TIPOS: string[] = ['SOL', 'VISTA']
const FORMAS_GAFA: string[] = [
  'RECTANGULAR', 'REDONDA', 'CUADRADA', 'OVALADA', 'AVIADOR',
  'POLIGONAL', 'MARIPOSA', 'OJOS_DE_GATO', 'CORAZON', 'BROWLINE',
]
const FORMAS_CARA: string[] = ['OVALADA', 'CUADRADA', 'REDONDA', 'CORAZON', 'DIAMANTE']

export default function Sidebar() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const selectedTipo = searchParams.get('tipo') ?? ''
  const selectedFormaGafa = searchParams.get('formaGafa') ?? ''
  const selectedCara = searchParams.get('cara') ?? ''
  const [busqueda, setBusqueda] = useState(searchParams.get('q') ?? '')
  const [mobileOpen, setMobileOpen] = useState(false)

  const activeFilters = [selectedTipo, selectedFormaGafa, selectedCara, busqueda].filter(Boolean).length

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
      router.push(`/catalogo?${params.toString()}`)
    },
    [router, searchParams]
  )

  function handleBusqueda(value: string) {
    setBusqueda(value)
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set('q', value)
    } else {
      params.delete('q')
    }
    router.push(`/catalogo?${params.toString()}`)
  }

  function clearAll() {
    setBusqueda('')
    router.push('/catalogo')
  }

  const filterContent = (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold text-gray-900 mb-2">Buscar</h3>
        <input
          type="text"
          value={busqueda}
          onChange={(e) => handleBusqueda(e.target.value)}
          placeholder="Marca o modelo..."
          className="w-full border text-gray-400 rounded px-3 py-2 text-sm"
        />
      </div>

      <div>
        <h3 className="font-semibold text-gray-700 mb-2">Tipo</h3>
        {TIPOS.map((t) => (
          <label key={t} className="flex items-center gap-2 mb-1 text-sm text-gray-400 cursor-pointer">
            <input
              type="checkbox"
              checked={selectedTipo === t}
              onChange={(e) => updateParam('tipo', e.target.checked ? t : '')}
            />
            {t}
          </label>
        ))}
      </div>

      <div>
        <h3 className="font-semibold text-gray-700 mb-2">Forma de gafa</h3>
        {FORMAS_GAFA.map((f) => (
          <label key={f} className="flex items-center gap-2 mb-1 text-sm text-gray-400 cursor-pointer">
            <input
              type="checkbox"
              checked={selectedFormaGafa === f}
              onChange={(e) => updateParam('formaGafa', e.target.checked ? f : '')}
            />
            {f.replace('_', ' ')}
          </label>
        ))}
      </div>

      <div>
        <h3 className="font-semibold text-gray-700 mb-2">Forma de cara</h3>
        {FORMAS_CARA.map((c) => (
          <label key={c} className="flex items-center gap-2 mb-1 text-sm text-gray-400 cursor-pointer">
            <input
              type="checkbox"
              checked={selectedCara === c}
              onChange={(e) => updateParam('cara', e.target.checked ? c : '')}
            />
            {c}
          </label>
        ))}
      </div>

      <button
        onClick={clearAll}
        className="w-full text-sm text-gray-500 hover:text-red-600 border rounded py-2 hover:border-red-300"
      >
        Limpiar filtros
      </button>
    </div>
  )

  return (
    <>
      {/* Botón flotante de filtros — solo móvil */}
      <div className="md:hidden fixed bottom-5 right-5 z-40">
        <button
          onClick={() => setMobileOpen(true)}
          className="flex items-center gap-2 bg-gray-900 text-white rounded-full px-4 py-3 shadow-lg text-sm font-medium"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
          </svg>
          Filtros
          {activeFilters > 0 && (
            <span className="bg-white text-gray-900 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
              {activeFilters}
            </span>
          )}
        </button>
      </div>

      {/* Drawer móvil */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          {/* Panel */}
          <div className="relative ml-auto w-72 h-full bg-white shadow-xl flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <span className="font-semibold text-gray-900">Filtros</span>
              <button onClick={() => setMobileOpen(false)} className="text-gray-500 hover:text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {filterContent}
            </div>
          </div>
        </div>
      )}

      {/* Sidebar desktop */}
      <aside className="hidden md:block w-64 flex-shrink-0 bg-white rounded-lg shadow p-4 self-start">
        {filterContent}
      </aside>
    </>
  )
}
