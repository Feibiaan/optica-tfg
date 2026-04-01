import Image from 'next/image'
import Link from 'next/link'

export default function Navbar() {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center gap-10">
        <Link href="/" className="flex-shrink-0">
          <Image
            src="/noma/noma-logo.png"
            alt="NOMA"
            width={90}
            height={45}
            priority
          />
        </Link>
        <nav className="flex gap-8 text-sm font-medium text-gray-700">
          <Link
            href="/catalogo?tipo=VISTA"
            className="hover:text-black transition-colors"
          >
            Glasses
          </Link>
          <Link
            href="/catalogo?tipo=SOL"
            className="hover:text-black transition-colors"
          >
            Sunglasses
          </Link>
        </nav>
      </div>
    </header>
  )
}
