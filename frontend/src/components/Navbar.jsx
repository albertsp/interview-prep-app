"use client"

import { useRouter, usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { LayoutDashboard, Play, LogOut, LogIn, UserPlus } from "lucide-react"
import { useAuth } from "@/context/AuthContext"

function Navbar() {
  const { token, user, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const initials = user ? user.charAt(0).toUpperCase() : "U"

  // Determina que links estan activos segun la ruta actual
  const isActive = (path) => pathname === path

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Logo + nombre */}
        <motion.button
          onClick={() => router.push("/")}
          className="flex items-center gap-3 rounded-lg outline-none cursor-pointer"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex size-10 items-center justify-center rounded-full bg-primary text-base font-bold text-primary-foreground">
            IP
          </div>
          <span className="text-lg font-semibold tracking-tight">Interview Prep</span>
        </motion.button>

        {/* Links de navegacion (solo si esta autenticado) */}
        {token && (
          <nav className="hidden md:flex items-center gap-1">
            <Button
              variant={isActive("/dashboard") ? "secondary" : "ghost"}
              size="sm"
              onClick={() => router.push("/dashboard")}
              className="gap-2"
            >
              <LayoutDashboard className="size-4" />
              Dashboard
            </Button>
            <Button
              variant={isActive("/session") ? "secondary" : "ghost"}
              size="sm"
              onClick={() => router.push("/session")}
              className="gap-2"
            >
              <Play className="size-4" />
              Nueva sesion
            </Button>
          </nav>
        )}

        {/* Avatar + dropdown o botones de auth */}
        <div className="flex items-center gap-2">
          {token ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-full outline-none cursor-pointer transition-transform hover:scale-105">
                  <Avatar size="lg">
                    <AvatarFallback className="bg-primary text-primary-foreground text-sm font-semibold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                  {user || "Usuario"}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push("/dashboard")}>
                  <LayoutDashboard className="mr-2 size-4" />
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/session")}>
                  <Play className="mr-2 size-4" />
                  Nueva sesion
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => { logout(); router.push("/") }}
                  variant="destructive"
                >
                  <LogOut className="mr-2 size-4" />
                  Cerrar sesion
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={() => router.push("/login")} className="gap-2">
                <LogIn className="size-4" />
                Iniciar sesion
              </Button>
              <Button size="sm" onClick={() => router.push("/register")} className="gap-2">
                <UserPlus className="size-4" />
                Registrarse
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

export default Navbar
