import 'dotenv/config'
import { PrismaClient } from '../app/generated/prisma/client.js'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

const productos = [
  { marca: 'Ray-Ban', modelo: 'Wayfarer', precio: 120.99, tipo: 'SOL' as const, formaGafa: 'RECTANGULAR' as const, formasCaraIdeal: ['REDONDA', 'OVALADA'] as const, descripcion: 'Icónica montura cuadrada Wayfarer. Estilo atemporal.' },
  { marca: 'Ray-Ban', modelo: 'Round Metal', precio: 145.00, tipo: 'SOL' as const, formaGafa: 'REDONDA' as const, formasCaraIdeal: ['CUADRADA', 'DIAMANTE', 'OVALADA'] as const, descripcion: 'Redonda metálica clásica. Estilo retro años 70.' },
  { marca: 'Oakley', modelo: 'Holbrook', precio: 110.50, tipo: 'SOL' as const, formaGafa: 'RECTANGULAR' as const, formasCaraIdeal: ['REDONDA', 'OVALADA'] as const, descripcion: 'Montura rectangular deportiva y resistente.' },
  { marca: 'Oakley', modelo: 'Wire', precio: 98.00, tipo: 'SOL' as const, formaGafa: 'AVIADOR' as const, formasCaraIdeal: ['CUADRADA', 'OVALADA', 'REDONDA'] as const, descripcion: 'Aviador ligero en montura metálica fina.' },
  { marca: 'Persol', modelo: '649', precio: 220.00, tipo: 'SOL' as const, formaGafa: 'CUADRADA' as const, formasCaraIdeal: ['REDONDA', 'OVALADA'] as const, descripcion: 'Elegancia italiana en montura cuadrada de acetato.' },
  { marca: 'Miu Miu', modelo: 'MU 01VS', precio: 310.00, tipo: 'SOL' as const, formaGafa: 'MARIPOSA' as const, formasCaraIdeal: ['DIAMANTE', 'CORAZON', 'OVALADA'] as const, descripcion: 'Mariposa de alta moda con lente oversized.' },
  { marca: 'Oliver Peoples', modelo: 'Gregory Peck', precio: 380.00, tipo: 'VISTA' as const, formaGafa: 'REDONDA' as const, formasCaraIdeal: ['CUADRADA', 'DIAMANTE', 'OVALADA'] as const, descripcion: 'Redonda inspirada en el Hollywood clásico.' },
  { marca: 'Warby Parker', modelo: 'Haskell', precio: 95.00, tipo: 'VISTA' as const, formaGafa: 'RECTANGULAR' as const, formasCaraIdeal: ['REDONDA', 'OVALADA'] as const, descripcion: 'Rectangular moderna y asequible en acetato.' },
  { marca: 'Gucci', modelo: 'GG0010S', precio: 420.00, tipo: 'SOL' as const, formaGafa: 'BROWLINE' as const, formasCaraIdeal: ['CORAZON', 'OVALADA', 'DIAMANTE'] as const, descripcion: 'Browline de lujo con logotipo icónico.' },
  { marca: 'Tom Ford', modelo: 'Henry', precio: 350.00, tipo: 'VISTA' as const, formaGafa: 'RECTANGULAR' as const, formasCaraIdeal: ['REDONDA', 'OVALADA'] as const, descripcion: 'Rectangular masculina y sofisticada en acetato negro.' },
]

async function main() {
  const existing = await prisma.product.count()
  if (existing > 0) {
    console.log(`Ya existen ${existing} productos. Omitiendo seed.`)
    return
  }

  for (let i = 0; i < productos.length; i++) {
    const p = productos[i]
    await prisma.product.create({
      data: {
        ...p,
        formasCaraIdeal: [...p.formasCaraIdeal],
        imagenes: {
          create: [
            { url: `https://picsum.photos/seed/${i + 1}/400/300`, esPrincipal: true },
            { url: `https://picsum.photos/seed/${i + 100}/400/300`, esPrincipal: false },
          ],
        },
      },
    })
    console.log(`Creado: ${p.marca} ${p.modelo}`)
  }

  console.log('Seed completado: 10 productos creados.')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
