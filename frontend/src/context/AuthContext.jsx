"use client"

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getMyStats } from "@/services/sessionService";

const AuthContext = createContext()

const DEFAULT_STATS = {
  total_xp: 0,
  level: 1,
  xp_to_next_level: 500,
  progress_in_level: 0,
  xp_per_level: 500,
};

export function AuthProvider({children}){

    const [user, setUser] = useState("")
    const [token, setToken] = useState("")
    // Stats de gamificacion del usuario (XP, level, etc.)
    const [stats, setStats] = useState(DEFAULT_STATS)
    // Controla si ya se leyo localStorage para evitar redirecciones prematuras
    const [initialized, setInitialized] = useState(false)

    // Refresca las stats del usuario desde el backend
    const refreshStats = useCallback(async (activeToken) => {
        const t = activeToken || token
        if (!t) return
        try {
            const data = await getMyStats(t)
            setStats({
                total_xp: data.total_xp ?? 0,
                level: data.level ?? 1,
                xp_to_next_level: data.xp_to_next_level ?? 500,
                progress_in_level: data.progress_in_level ?? 0,
                xp_per_level: data.xp_per_level ?? 500,
            })
        } catch {
            // Si falla, mantenemos las stats anteriores
        }
    }, [token])

    useEffect(() => {
        const savedUser = localStorage.getItem("user")
        if (savedUser) setUser(savedUser)
        const savedToken = localStorage.getItem("token")
        if (savedToken) {
            setToken(savedToken)
            // Cargamos stats al iniciar sesion
            refreshStats(savedToken)
        }
        // Marcamos que el contexto ya esta listo
        setInitialized(true)
    }, [refreshStats])

    function login(logUser, logToken){
        localStorage.setItem("token", logToken)
        localStorage.setItem("user", logUser)
        setToken(logToken)
        setUser(logUser)
        refreshStats(logToken)
    }
    function logout(){
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        setToken("")
        setUser("")
        setStats(DEFAULT_STATS)
    }

    function updateUserName(name) {
        localStorage.setItem("user", name)
        setUser(name)
    }

    return(
        <AuthContext.Provider value={{token, user, stats, initialized, login, logout, refreshStats, updateUserName}}>
            {children}
        </AuthContext.Provider>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(){
    return useContext(AuthContext)
}
