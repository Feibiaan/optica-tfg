import Image from 'next/image'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import MorphologicalWizard from '@/components/MorphologicalWizard'

const FEATURED_PRODUCTS = [
  { src: '/noma/product-1.png', precio: '18,96 €' },
  { src: '/noma/product-2.png', precio: '18,96 €' },
  { src: '/noma/product-3.png', precio: '18,96 €' },
  { src: '/noma/product-4.png', precio: '18,96 €' },
]

const CATEGORIES = [
  { src: '/noma/cat-nuevos.png',   label: 'Nuevos modelos',  href: '/catalogo' },
  { src: '/noma/cat-vendidos.png', label: 'Más vendidos',    href: '/catalogo' },
  { src: '/noma/cat-sol.png',      label: 'Gafas de sol',    href: '/catalogo?tipo=SOL' },
  { src: '/noma/cat-deporte.png',  label: 'Gafas de deporte',href: '/catalogo?tipo=SOL' },
]

export default function HomePage() {
  return (
    <main>
      <Navbar />

      {/* HERO BANNER */}
      <section className="bg-teal-500 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 py-14 flex items-center gap-8">
          <div className="flex-1 text-white z-10">
            <p className="text-sm font-semibold uppercase tracking-widest mb-2 opacity-90">
              Ofertas especiales
            </p>
            <h1 className="text-5xl font-extrabold leading-tight mb-3">
              DESCUENTOS<br />PRIMAVERALES 50%
            </h1>
            <p className="text-xl mb-6">Tus gafas al mejor precio</p>
            <p className="text-sm mb-4">
              USA EL CÓDIGO:{' '}
              <span className="font-bold bg-white/20 px-2 py-0.5 rounded">SPRINGLOW50</span>
            </p>
            <Link
              href="/catalogo"
              className="inline-block bg-yellow-400 text-black font-bold px-6 py-3 rounded-full hover:bg-yellow-300 transition-colors"
            >
              COMPRA AHORA
            </Link>
          </div>

          <div className="hidden md:flex gap-4 flex-shrink-0">
            <div className="w-44 h-52 rounded-2xl overflow-hidden shadow-lg -rotate-3">
              <Image
                src="/noma/hero-model.png"
                alt="Modelo con gafas"
                width={176}
                height={208}
                className="object-cover w-full h-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCTOS DESTACADOS */}
      <section className="bg-gray-900 py-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {FEATURED_PRODUCTS.map((p, i) => (
              <Link
                key={i}
                href="/catalogo"
                className="bg-white rounded-lg overflow-hidden shadow hover:shadow-md transition-shadow"
              >
                <div className="h-36 flex items-center justify-center p-4 bg-gray-50">
                  <Image
                    src={p.src}
                    alt={`Gafas destacadas ${i + 1}`}
                    width={160}
                    height={90}
                    className="object-contain"
                  />
                </div>
                <div className="p-3 text-center">
                  <p className="text-sm font-semibold text-gray-800">{p.precio}</p>
                  <span className="text-xs text-blue-600 hover:underline mt-1 inline-block">
                    VER
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SECCIÓN CATEGORÍAS */}
      {/* Nota: los botones Glasses/Sunglasses van directo al catálogo (no popup).
          Esta sección complementa con accesos rápidos por categoría. */}
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.label}
                href={cat.href}
                className="group relative rounded-xl overflow-hidden aspect-square shadow hover:shadow-lg transition-shadow"
              >
                <Image
                  src={cat.src}
                  alt={cat.label}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/30 flex items-end p-3">
                  <span className="text-white font-semibold text-sm">{cat.label}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* RECOMENDADOR MORFOLÓGICO */}
      <div id="recomendador">
        <MorphologicalWizard />
      </div>
    </main>
  )
}
