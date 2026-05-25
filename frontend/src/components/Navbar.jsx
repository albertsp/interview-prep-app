import { NavLink } from "react-router-dom"

function Navbar() {
  return (
    <header className="bg-slate-950 text-slate-100 shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-500 text-lg font-bold text-white">
            IP
          </div>
          <div>
            <p className="text-lg font-semibold">Interview Prep</p>
            <p className="text-sm text-slate-400">Practica para tu próxima entrevista</p>
          </div>
        </div>

        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive
                ? "text-white"
                : "text-slate-300 transition hover:text-white"
            }
          >
            Inicio
          </NavLink>
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              isActive
                ? "text-white"
                : "text-slate-300 transition hover:text-white"
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/session"
            className={({ isActive }) =>
              isActive
                ? "text-white"
                : "text-slate-300 transition hover:text-white"
            }
          >
            Sesión
          </NavLink>
        </nav>

        <a
          href="#"
          className="rounded-full bg-sky-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-400"
        >
          Comenzar
        </a>
      </div>
    </header>
  )
}

export default Navbar
