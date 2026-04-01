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

  return (
    <aside className="w-64 flex-shrink-0 bg-white rounded-lg shadow p-4 space-y-6 self-start">
      <div>
        <h3 className="font-semibold mb-2">Buscar</h3>
        <input
          type="text"
          value={busqueda}
          onChange={(e) => handleBusqueda(e.target.value)}
          placeholder="Marca o modelo..."
          className="w-full border rounded px-3 py-2 text-sm"
        />
      </div>

      <div>
        <h3 className="font-semibold mb-2">Tipo</h3>
        {TIPOS.map((t) => (
          <label key={t} className="flex items-center gap-2 mb-1 text-sm cursor-pointer">
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
        <h3 className="font-semibold mb-2">Forma de gafa</h3>
        {FORMAS_GAFA.map((f) => (
          <label key={f} className="flex items-center gap-2 mb-1 text-sm cursor-pointer">
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
        <h3 className="font-semibold mb-2">Forma de cara</h3>
        {FORMAS_CARA.map((c) => (
          <label key={c} className="flex items-center gap-2 mb-1 text-sm cursor-pointer">
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
    </aside>
  )
}
