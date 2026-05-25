function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 sm:px-6 lg:px-8 md:flex-row md:items-center md:justify-between">
        <p className="text-sm text-slate-400">� 2026 Interview Prep. Todos los derechos reservados.</p>

        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-300">
          <a href="#" className="transition hover:text-white">Política de privacidad</a>
          <a href="#" className="transition hover:text-white">Términos</a>
          <a href="#" className="transition hover:text-white">Contacto</a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
