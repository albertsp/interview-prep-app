"use client"

import { useEffect, useState } from "react"
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
import { LayoutDashboard, Play, LogOut, LogIn, UserPlus, Star, BarChart3 } from "lucide-react"
import { useAuth } from "@/context/AuthContext"

const BRAND = "InterviewKit"

function BrandText() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <span className="text-xl font-bold tracking-tight">{BRAND}</span>
  }

  return (
    <span className="text-xl font-bold tracking-tight">
      {BRAND.split("").map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.03, duration: 0.3, ease: "easeOut" }}
          className="inline-block"
        >
          {char}
        </motion.span>
      ))}
    </span>
  )
}

function Navbar() {
  const { token, user, stats, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const initials = user ? user.charAt(0).toUpperCase() : "U"

  const isActive = (path) => pathname === path

  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3.5">
        {/* Brand */}
        <motion.button
          onClick={() => router.push("/")}
          className="outline-none cursor-pointer select-none"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <BrandText />
        </motion.button>

        {/* Nav links (solo si esta autenticado) */}
        {token && (
          <nav className="hidden md:flex items-center gap-1">
            <Button
              variant={isActive("/dashboard") ? "secondary" : "ghost"}
              size="sm"
              onClick={() => router.push("/dashboard")}
              className="gap-2 text-sm"
            >
              <LayoutDashboard className="size-4" />
              Dashboard
            </Button>
            <Button
              variant={isActive("/stats") ? "secondary" : "ghost"}
              size="sm"
              onClick={() => router.push("/stats")}
              className="gap-2 text-sm"
            >
              <BarChart3 className="size-4" />
              Stats
            </Button>
            <Button
              variant={isActive("/session") ? "secondary" : "ghost"}
              size="sm"
              onClick={() => router.push("/session")}
              className="gap-2 text-sm"
            >
              <Play className="size-4" />
              Nueva sesion
            </Button>
          </nav>
        )}

        {/* Avatar + dropdown o botones de auth */}
        <div className="flex items-center gap-3">
          {/* Badge de XP/Level (solo si esta autenticado) */}
          {token && (
            <div
              className="hidden sm:flex items-center gap-2 rounded-lg border border-border/50 bg-background px-3 py-1.5 text-sm"
              title={`${stats.total_xp} XP · ${stats.xp_to_next_level} XP para Nv ${stats.level + 1}`}
            >
              <Star className="size-3.5 text-amber-500 fill-amber-500" />
              <span className="font-semibold tabular-nums">Nv {stats.level}</span>
              <span className="text-muted-foreground tabular-nums">{stats.total_xp} XP</span>
            </div>
          )}

          {token ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-full outline-none cursor-pointer transition-transform hover:scale-105">
                  <Avatar className="size-8">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
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
                <DropdownMenuItem onClick={() => router.push("/stats")}>
                  <BarChart3 className="mr-2 size-4" />
                  Stats
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
