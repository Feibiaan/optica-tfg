'use client'

import { useState } from 'react'

interface Imagen {
  url: string
  esPrincipal: boolean
}

interface ProductCardProps {
  id: string
  marca: string
  modelo: string
  precio: number
  imagenes: Imagen[]
  isFavorito?: boolean
  isLoggedIn?: boolean
  onToggleFavorito?: (id: string) => void
}

export default function ProductCard({
  id,
  marca,
  modelo,
  precio,
  imagenes,
  isFavorito = false,
  isLoggedIn = false,
  onToggleFavorito,
}: ProductCardProps) {
  const principal = imagenes.find((img) => img.esPrincipal)?.url ?? imagenes[0]?.url ?? ''
  const secundaria = imagenes.find((img) => !img.esPrincipal)?.url ?? principal
  const [hovered, setHovered] = useState(false)

  return (
    <div
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative w-full h-48">
        <img
          src={hovered ? secundaria : principal}
          alt={`${marca} ${modelo}`}
          className="w-full h-full object-cover transition-opacity duration-300"
        />
        {isLoggedIn && onToggleFavorito && (
          <button
            onClick={(e) => { e.stopPropagation(); onToggleFavorito(id) }}
            className="absolute top-2 right-2 text-2xl"
            aria-label={isFavorito ? 'Quitar de favoritos' : 'Añadir a favoritos'}
          >
            {isFavorito ? '❤️' : '🤍'}
          </button>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-800">{marca}</h3>
        <p className="text-gray-600 text-sm">{modelo}</p>
        <p className="text-blue-600 font-bold mt-2">{Number(precio).toFixed(2)} €</p>
      </div>
    </div>
  )
}
