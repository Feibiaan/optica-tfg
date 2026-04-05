'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { z } from 'zod'
import { buildCatalogoUrl } from '@/lib/recommender'

type FormaCara = 'OVALADA' | 'CUADRADA' | 'REDONDA' | 'CORAZON' | 'DIAMANTE'
type TipoGafa = 'SOL' | 'VISTA'

const stepOneSchema = z.object({
  formaCara: z.enum(['OVALADA', 'CUADRADA', 'REDONDA', 'CORAZON', 'DIAMANTE'], {
    error: 'Debes seleccionar una forma de cara',
  }),
})

const stepTwoSchema = z.object({
  tipoGafa: z.enum(['SOL', 'VISTA'], {
    error: 'Debes seleccionar un tipo de gafa',
  }),
})

const FORMAS_CARA: { value: FormaCara; label: string; descripcion: string }[] = [
  { value: 'OVALADA', label: 'Ovalada', descripcion: 'Frente más ancha, pómulos pronunciados, mandíbula suave' },
  { value: 'CUADRADA', label: 'Cuadrada', descripcion: 'Frente, pómulos y mandíbula de anchura similar' },
  { value: 'REDONDA', label: 'Redonda', descripcion: 'Sin ángulos pronunciados, anchura y longitud similares' },
  { value: 'CORAZON', label: 'Corazón', descripcion: 'Frente ancha y mentón estrecho y puntiagudo' },
  { value: 'DIAMANTE', label: 'Diamante', descripcion: 'Pómulos muy anchos, frente y mentón más estrechos' },
]

export default function MorphologicalWizard() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [formaCara, setFormaCara] = useState<FormaCara | ''>('')
  const [tipoGafa, setTipoGafa] = useState<TipoGafa | ''>('')
  const [error, setError] = useState('')

  function handleNextStep() {
    setError('')
    const parsed = stepOneSchema.safeParse({ formaCara })
    if (!parsed.success) {
      setError(parsed.error.issues[0].message)
      return
    }
    setStep(2)
  }

  function handleFinish() {
    setError('')
    const parsed = stepTwoSchema.safeParse({ tipoGafa })
    if (!parsed.success) {
      setError(parsed.error.issues[0].message)
      return
    }
    const url = buildCatalogoUrl({
      formaCara: formaCara as FormaCara,
      tipoGafa: tipoGafa as TipoGafa,
    })
    router.push(url)
  }

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-8">
        <div className="flex gap-2 mb-8">
          <div className={`flex-1 h-2 rounded-full ${step >= 1 ? 'bg-blue-600' : 'bg-gray-200'}`} />
          <div className={`flex-1 h-2 rounded-full ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`} />
        </div>

        {step === 1 && (
          <>
            <h2 className="text-2xl text-gray-900 font-bold mb-2 text-center">¿Cuál es la forma de tu cara?</h2>
            <p className="text-gray-600 text-center mb-6">Selecciona la opción que mejor te describe</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {FORMAS_CARA.map((fc) => (
                <button
                  key={fc.value}
                  onClick={() => setFormaCara(fc.value)}
                  className={`text-left p-4 rounded-lg border-2 transition-colors cursor-pointer ${
                    formaCara === fc.value
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <div className="font-semibold text-gray-900">{fc.label}</div>
                  <div className="text-sm text-gray-500 mt-1">{fc.descripcion}</div>
                </button>
              ))}
            </div>

            {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

            <button
              onClick={handleNextStep}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 cursor-pointer"
            >
              Siguiente →
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">¿Qué tipo de gafas buscas?</h2>
            <p className="text-gray-600 text-center mb-6">
              Cara seleccionada: <strong>{formaCara}</strong>
            </p>

            <div className="grid grid-cols-2 gap-4 mb-6">
              {(['SOL', 'VISTA'] as TipoGafa[]).map((tipo) => (
                <button
                  key={tipo}
                  onClick={() => setTipoGafa(tipo)}
                  className={`p-6 rounded-lg border-2 transition-colors text-center cursor-pointer ${
                    tipoGafa === tipo
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <div className="text-3xl mb-2">{tipo === 'SOL' ? '☀️' : '👓'}</div>
                  <div className="font-semibold text-gray-900">{tipo === 'SOL' ? 'Gafas de sol' : 'Gafas graduadas'}</div>
                </button>
              ))}
            </div>

            {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

            <div className="flex gap-3">
              <button
                onClick={() => { setStep(1); setError('') }}
                className="flex-1 border border-gray-300 py-3 rounded-lg text-gray-600 hover:bg-gray-50 cursor-pointer"
              >
                ← Atrás
              </button>
              <button
                onClick={handleFinish}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 cursor-pointer"
              >
                Ver recomendaciones
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  )
}
