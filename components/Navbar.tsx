'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    fetch('/api/favorites').then((r) => {
      if (r.ok) setIsLoggedIn(true)
    })
  }, [])

  useEffect(() => {
    function handleOutsideClick(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [])

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    setIsLoggedIn(false)
    setUserMenuOpen(false)
    setMobileMenuOpen(false)
    router.push('/')
    router.refresh()
  }

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center gap-10">

        {/* Logo */}
        <Link href="/" className="flex-shrink-0">
          <Image src="/noma/noma-logo.png" alt="NOMA" width={90} height={45} priority style={{ width: '90px', height: 'auto' }} />
        </Link>

        {/* Navegación desktop */}
        <nav className="hidden md:flex gap-8 text-sm font-medium text-gray-700">
          <Link href="/catalogo?tipo=VISTA" className="hover:text-black transition-colors">
            Gafas
          </Link>
          <Link href="/catalogo?tipo=SOL" className="hover:text-black transition-colors">
            Gafas de sol
          </Link>
        </nav>

        {/* Acciones desktop */}
        <div className="ml-auto hidden md:flex items-center gap-4 text-sm font-medium text-gray-700">
          {isLoggedIn ? (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setUserMenuOpen((prev) => !prev)}
                className="flex items-center hover:opacity-70 transition-opacity cursor-pointer"
                aria-label="Menú de usuario"
              >
                <Image
                  src="/user-people-account-svgrepo-com.svg"
                  alt="Usuario"
                  width={26}
                  height={26}
                />
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-md shadow-lg py-1 z-50">
                  <Link
                    href="/favoritos"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    Favoritos
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/login" className="hover:text-black transition-colors">
                Iniciar sesión
              </Link>
              <Link
                href="/register"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded transition-colors"
              >
                Registrarse
              </Link>
            </>
          )}
        </div>

        {/* Botón hamburguesa móvil */}
        <button
          className="md:hidden ml-auto flex items-center justify-center p-1 text-gray-700 hover:text-black transition-colors cursor-pointer"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          aria-label="Abrir menú"
        >
          {mobileMenuOpen ? (
            // Icono X
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            // Icono hamburguesa
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Menú móvil desplegable */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-6 py-4 flex flex-col gap-4 text-sm font-medium text-gray-700">
          <Link
            href="/catalogo?tipo=VISTA"
            className="hover:text-black transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            Gafas
          </Link>
          <Link
            href="/catalogo?tipo=SOL"
            className="hover:text-black transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            Gafas de sol
          </Link>

          <hr className="border-gray-200" />

          {isLoggedIn ? (
            <>
              <Link
                href="/favoritos"
                className="hover:text-black transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Favoritos
              </Link>
              <button
                onClick={handleLogout}
                className="text-left text-red-600 hover:text-red-800 transition-colors cursor-pointer"
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="hover:text-black transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Iniciar sesión
              </Link>
              <Link
                href="/register"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-center transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Registrarse
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  )
}
