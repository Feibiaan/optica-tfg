'use client'

import { useState } from 'react'
import { productSchema, ProductInput } from '@/lib/schemas'

interface ProductFormProps {
  initialData?: ProductInput & { id?: string }
  onSuccess: () => void
  onCancel: () => void
}

const TIPOS_GAFA = ['SOL', 'VISTA'] as const
const FORMAS_GAFA = [
  'RECTANGULAR', 'REDONDA', 'CUADRADA', 'OVALADA', 'AVIADOR',
  'POLIGONAL', 'MARIPOSA', 'OJOS_DE_GATO', 'CORAZON', 'BROWLINE',
] as const
const FORMAS_CARA = ['OVALADA', 'CUADRADA', 'REDONDA', 'CORAZON', 'DIAMANTE'] as const

export default function ProductForm({ initialData, onSuccess, onCancel }: ProductFormProps) {
  const [form, setForm] = useState({
    marca: initialData?.marca ?? '',
    modelo: initialData?.modelo ?? '',
    precio: initialData?.precio?.toString() ?? '',
    tipo: initialData?.tipo ?? 'SOL',
    formaGafa: initialData?.formaGafa ?? 'RECTANGULAR',
    formasCaraIdeal: (initialData?.formasCaraIdeal ?? []) as string[],
    descripcion: initialData?.descripcion ?? '',
    imagenPrincipal: initialData?.imagenes?.[0]?.url ?? '',
    imagenSecundaria: initialData?.imagenes?.[1]?.url ?? '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrors({})

    const payload = {
      marca: form.marca,
      modelo: form.modelo,
      precio: Number(form.precio),
      tipo: form.tipo,
      formaGafa: form.formaGafa,
      formasCaraIdeal: form.formasCaraIdeal,
      descripcion: form.descripcion || undefined,
      imagenes: [
        { url: form.imagenPrincipal, esPrincipal: true },
        ...(form.imagenSecundaria
          ? [{ url: form.imagenSecundaria, esPrincipal: false }]
          : []),
      ],
    }

    const parsed = productSchema.safeParse(payload)
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {}
      for (const err of parsed.error.issues) {
        fieldErrors[err.path.join('.')] = err.message
      }
      setErrors(fieldErrors)
      return
    }

    setLoading(true)
    try {
      const url = initialData?.id
        ? `/api/products/${initialData.id}`
        : '/api/products'
      const method = initialData?.id ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        onSuccess()
      } else {
        const data = await res.json()
        setErrors({ general: data.error ?? 'Error al guardar' })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errors.general && (
        <p className="text-red-600 text-sm">{errors.general}</p>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-700 font-medium mb-1">Marca</label>
          <input
            value={form.marca}
            onChange={(e) => setForm({ ...form, marca: e.target.value })}
            className="w-full border rounded text-gray-500 px-3 py-2"
          />
          {errors.marca && <p className="text-red-500 text-xs mt-1">{errors.marca}</p>}
        </div>

        <div>
          <label className="block text-sm text-gray-700 font-medium mb-1">Modelo</label>
          <input
            value={form.modelo}
            onChange={(e) => setForm({ ...form, modelo: e.target.value })}
            className="w-full border rounded text-gray-500 px-3 py-2"
          />
          {errors.modelo && <p className="text-red-500 text-xs mt-1">{errors.modelo}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm text-gray-700 font-medium mb-1">Precio (€)</label>
        <input
          type="number"
          step="0.01"
          value={form.precio}
          onChange={(e) => setForm({ ...form, precio: e.target.value })}
          className="w-full border rounded text-gray-500 px-3 py-2"
        />
        {errors.precio && <p className="text-red-500 text-xs mt-1">{errors.precio}</p>}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm text-gray-700 font-medium mb-1">Tipo</label>
          <select
            value={form.tipo}
            onChange={(e) => setForm({ ...form, tipo: e.target.value as typeof form.tipo })}
            className="w-full border rounded text-gray-500 px-3 py-2"
          >
            {TIPOS_GAFA.map((t) => <option key={t}>{t}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-700 font-medium mb-1">Forma de gafa</label>
          <select
            value={form.formaGafa}
            onChange={(e) => setForm({ ...form, formaGafa: e.target.value as typeof form.formaGafa })}
            className="w-full border rounded text-gray-500 px-3 py-2"
          >
            {FORMAS_GAFA.map((f) => <option key={f}>{f}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-700 font-medium mb-2">Caras compatibles</label>
          <div className="space-y-1">
            {FORMAS_CARA.map((c) => (
              <label key={c} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.formasCaraIdeal.includes(c)}
                  onChange={(e) => {
                    const next = e.target.checked
                      ? [...form.formasCaraIdeal, c]
                      : form.formasCaraIdeal.filter((x) => x !== c)
                    setForm({ ...form, formasCaraIdeal: next })
                  }}
                />
                {c}
              </label>
            ))}
          </div>
          {errors['formasCaraIdeal'] && (
            <p className="text-red-500 text-xs mt-1">{errors['formasCaraIdeal']}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm text-gray-700 font-medium mb-1">URL imagen principal</label>
        <input
          value={form.imagenPrincipal}
          onChange={(e) => setForm({ ...form, imagenPrincipal: e.target.value })}
          className="w-full border rounded text-gray-500 px-3 py-2"
          placeholder="https://..."
        />
        {errors['imagenes'] && <p className="text-red-500 text-xs mt-1">{errors['imagenes']}</p>}
      </div>

      <div>
        <label className="block text-sm text-gray-700 font-medium mb-1">URL imagen secundaria (opcional)</label>
        <input
          value={form.imagenSecundaria}
          onChange={(e) => setForm({ ...form, imagenSecundaria: e.target.value })}
          className="w-full border rounded text-gray-500 px-3 py-2"
          placeholder="https://..."
        />
      </div>

      <div>
        <label className="block text-sm text-gray-700 font-medium mb-1">Descripción (opcional)</label>
        <textarea
          value={form.descripcion}
          onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
          className="w-full border rounded text-gray-500 px-3 py-2"
          rows={3}
        />
      </div>

      <div className="flex gap-3 justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-200 cursor-pointer"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
        >
          {loading ? 'Guardando...' : initialData?.id ? 'Actualizar' : 'Crear'}
        </button>
      </div>
    </form>
  )
}
