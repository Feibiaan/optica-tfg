export default function HomePage() {
  return (
    <main className="min-h-screen">
      <section className="bg-blue-700 text-white text-center py-20 px-4">
        <h1 className="text-4xl font-bold mb-4">Óptica Morfológica</h1>
        <p className="text-xl mb-8">Encuentra las gafas perfectas para tu rostro</p>
        <a
          href="/catalogo"
          className="bg-white text-blue-700 px-6 py-3 rounded-full font-semibold hover:bg-blue-50 inline-block"
        >
          Ver catálogo
        </a>
      </section>
      {/* MorphologicalWizard se integrará en Fase 5 */}
    </main>
  )
}
