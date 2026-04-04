export type FormaCara = 'OVALADA' | 'CUADRADA' | 'REDONDA' | 'CORAZON' | 'DIAMANTE'
export type FormaGafa = 'RECTANGULAR' | 'REDONDA' | 'CUADRADA' | 'OVALADA' | 'AVIADOR' | 'POLIGONAL' | 'MARIPOSA' | 'OJOS_DE_GATO' | 'CORAZON' | 'BROWLINE'
export type NivelCompatibilidad = 'ideal' | 'compatible' | 'neutro'

export interface RecommendationInput {
  formaCara: FormaCara
  tipoGafa: 'SOL' | 'VISTA'
}

// Para cada cara, qué formas de gafa sientan bien (usado en clasificarProducto)
const formasCompatibles: Record<FormaCara, FormaGafa[]> = {
  OVALADA:   ['RECTANGULAR', 'CUADRADA', 'BROWLINE', 'AVIADOR', 'POLIGONAL'],
  CUADRADA:  ['REDONDA', 'OVALADA', 'AVIADOR', 'MARIPOSA'],
  REDONDA:   ['RECTANGULAR', 'CUADRADA', 'POLIGONAL', 'BROWLINE'],
  CORAZON:   ['AVIADOR', 'REDONDA', 'OJOS_DE_GATO', 'MARIPOSA', 'BROWLINE'],
  DIAMANTE:  ['OVALADA', 'REDONDA', 'OJOS_DE_GATO', 'BROWLINE', 'MARIPOSA'],
}

/**
 * Clasifica un producto en 3 niveles de compatibilidad para una cara dada.
 * - ideal:      la cara está en formasCaraIdeal del producto (etiquetado explícitamente)
 * - compatible: la forma de gafa del producto favorece esa cara según visagismo
 * - neutro:     el resto — el usuario puede elegirlo igualmente
 */
export function clasificarProducto(
  producto: { formasCaraIdeal: string[]; formaGafa: string },
  formaCara: FormaCara
): NivelCompatibilidad {
  if (producto.formasCaraIdeal.includes(formaCara)) return 'ideal'
  if ((formasCompatibles[formaCara] as string[]).includes(producto.formaGafa)) return 'compatible'
  return 'neutro'
}

/**
 * Ordena productos por nivel de compatibilidad: ideal → compatible → neutro.
 * Todos los productos se muestran; el orden orienta al usuario sin ocultarle opciones.
 */
export function ordenarPorCompatibilidad<T extends { formasCaraIdeal: string[]; formaGafa: string }>(
  productos: T[],
  formaCara: FormaCara
): T[] {
  const orden: Record<NivelCompatibilidad, number> = { ideal: 0, compatible: 1, neutro: 2 }
  return [...productos].sort(
    (a, b) => orden[clasificarProducto(a, formaCara)] - orden[clasificarProducto(b, formaCara)]
  )
}

/**
 * Construye la URL del catálogo con cara y tipo como filtros.
 * El catálogo usará hasSome en la BD para mostrar productos ideales primero.
 */
export function buildCatalogoUrl(input: RecommendationInput): string {
  const params = new URLSearchParams({
    cara: input.formaCara,
    tipo: input.tipoGafa,
  })
  return `/catalogo?${params.toString()}`
}
