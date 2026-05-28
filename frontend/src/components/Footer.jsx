function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 sm:px-6 lg:px-8 md:flex-row md:items-center md:justify-between">
        <p className="text-sm text-muted-foreground">&copy; 2026 Interview Prep. Todos los derechos reservados.</p>

        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <a href="#" className="transition hover:text-foreground">Política de privacidad</a>
          <a href="#" className="transition hover:text-foreground">Términos</a>
          <a href="#" className="transition hover:text-foreground">Contacto</a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
