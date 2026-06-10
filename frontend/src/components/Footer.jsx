"use client"

function Footer() {
  return (
    <footer className="border-t border-border bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 sm:px-6 lg:px-8 md:flex-row md:items-center md:justify-between">
        <p className="text-sm text-muted-foreground">&copy; 2026 InterviewKit. Todos los derechos reservados.</p>

        <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
          <a href="#" className="transition hover:text-foreground">Privacidad</a>
          <a href="#" className="transition hover:text-foreground">Terminos</a>
          <a href="#" className="transition hover:text-foreground">Contacto</a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
