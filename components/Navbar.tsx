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
          <Link href="/catalogo?tipo=VISTA" className="hover:text-black transition-colors">
            Gafas
          </Link>
          <Link href="/catalogo?tipo=SOL" className="hover:text-black transition-colors">
            Gafas de sol
          </Link>
        </nav>
        <div className="ml-auto flex items-center gap-4 text-sm font-medium text-gray-700">
          <Link href="/favoritos" className="hover:text-black transition-colors" aria-label="Mis favoritos">
            ❤️ Favoritos
          </Link>
          <Link href="/login" className="hover:text-black transition-colors">
            Iniciar sesión
          </Link>
          <Link
            href="/register"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded transition-colors"
          >
            Registrarse
          </Link>
        </div>
      </div>
    </header>
  )
}
