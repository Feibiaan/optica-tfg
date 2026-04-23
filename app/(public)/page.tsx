import Image from 'next/image'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import MorphologicalWizard from '@/components/MorphologicalWizard'
import { prisma } from '@/lib/prisma'

async function getFeaturedProducts() {
  const total = await prisma.product.count({ where: { activo: true } })
  const skip = Math.max(0, Math.floor(Math.random() * Math.max(1, total - 4)))
  return prisma.product.findMany({
    where: { activo: true },
    include: { imagenes: { where: { esPrincipal: true }, take: 1 } },
    skip,
    take: 4,
  })
}

export default async function HomePage() {
  const featured = await getFeaturedProducts()

  return (
    <main style={{ backgroundColor: '#007190' }}>
      <Navbar />

      {/* HERO BANNER */}
      <section>
        <Image
          src="/noma/hero-bg.png"
          alt="Descuentos primaverales 50% - Tus gafas al mejor precio"
          width={1440}
          height={475}
          className="w-full"
          priority
        />
      </section>

      {/* PRODUCTOS DESTACADOS */}
      <section className="py-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {featured.map((p) => {
              const imgSrc = p.imagenes[0]?.url ?? '/noma/product-1.png'
              return (
                <Link
                  key={p.id}
                  href={`/catalogo`}
                  className="bg-white rounded-lg overflow-hidden transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110"
                >
                  <div className="relative h-36 bg-gray-50">
                    <Image
                      src={imgSrc}
                      alt={`${p.marca} ${p.modelo}`}
                      fill
                      sizes="(max-width: 640px) 50vw, 25vw"
                      className="object-contain p-4"
                    />
                  </div>
                  <div className="p-3 text-center">
                    <p className="text-xs text-gray-500">{p.marca}</p>
                    <p className="text-sm font-semibold text-gray-800">{p.modelo}</p>
                    <p className="text-sm font-bold mt-1" style={{ color: '#007190' }}>
                      {p.precio.toFixed(2).replace('.', ',')} €
                    </p>
                    <span className="text-xs hover:underline mt-1 inline-block" style={{ color: '#007190' }}>
                      VER
                    </span>
                  </div>
                </Link>
              )
            })}
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
