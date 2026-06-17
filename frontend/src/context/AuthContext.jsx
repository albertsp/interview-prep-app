"use client"

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getMyStats } from "@/services/sessionService";
import { logoutUser } from "@/services/authService";

const AuthContext = createContext()

const DEFAULT_STATS = {
  total_xp: 0,
  level: 1,
  xp_to_next_level: 500,
  progress_in_level: 0,
  xp_per_level: 500,
  results_summary: { correct: 0, partially_correct: 0, incorrect: 0 },
  stacks_stats: [],
  sessions_count: 0,
  recent_sessions: [],
  cards_summary: { total: 0, top_tags: [] },
};

export function AuthProvider({children}){

    const [user, setUser] = useState("")
    const [stats, setStats] = useState(DEFAULT_STATS)
    const [initialized, setInitialized] = useState(false)

    const refreshStats = useCallback(async () => {
        try {
            const data = await getMyStats()
            setStats({
                total_xp: data.total_xp ?? 0,
                level: data.level ?? 1,
                xp_to_next_level: data.xp_to_next_level ?? 500,
                progress_in_level: data.progress_in_level ?? 0,
                xp_per_level: data.xp_per_level ?? 500,
                results_summary: data.results_summary ?? DEFAULT_STATS.results_summary,
                stacks_stats: data.stacks_stats ?? DEFAULT_STATS.stacks_stats,
                sessions_count: data.sessions_count ?? DEFAULT_STATS.sessions_count,
                recent_sessions: data.recent_sessions ?? DEFAULT_STATS.recent_sessions,
                cards_summary: data.cards_summary ?? DEFAULT_STATS.cards_summary,
            })
        } catch {
            // Si falla, mantenemos las stats anteriores
        }
    }, [])

    useEffect(() => {
        const savedUser = localStorage.getItem("user")
        if (savedUser) {
            setUser(savedUser)
            refreshStats()
        }
        setInitialized(true)
    }, [refreshStats])

    function login(logUser){
        localStorage.setItem("user", logUser)
        setUser(logUser)
        refreshStats()
    }

    function updateUser(newName){
        localStorage.setItem("user", newName)
        setUser(newName)
    }

    async function logout(){
        try {
            await logoutUser()
        } catch {
            // Si falla el logout en backend, igual limpiamos localmente
        }
        localStorage.removeItem("user")
        setUser("")
        setStats(DEFAULT_STATS)
    }

    return(
        <AuthContext.Provider value={{user, stats, initialized, login, logout, refreshStats, updateUser}}>
            {children}
        </AuthContext.Provider>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(){
    return useContext(AuthContext)
}