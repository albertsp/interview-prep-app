"use client"

import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { getMyStats } from "@/services/sessionService";
import { getMyProfile } from "@/services/authService";
import { logoutUser } from "@/services/authService";
import { setOnUnauthorized } from "@/services/httpClient";

const AuthContext = createContext()

const DEFAULT_STATS = {
  total_xp: 0,
  level: 1,
  xp_to_next_level: 0,
  progress_in_level: 0,
  xp_per_level: 0,
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
    const refreshingRef = useRef(false)

    useEffect(() => {
        setOnUnauthorized(() => {
            localStorage.removeItem("user")
            setUser("")
            setStats(DEFAULT_STATS)
        })
    }, [])

    const refreshStats = useCallback(async () => {
        if (refreshingRef.current) return
        refreshingRef.current = true
        try {
            const data = await getMyStats()
            setStats({
                total_xp: data.total_xp ?? 0,
                level: data.level ?? 1,
                xp_to_next_level: data.xp_to_next_level ?? 0,
                progress_in_level: data.progress_in_level ?? 0,
                xp_per_level: data.xp_per_level ?? 0,
                results_summary: data.results_summary ?? DEFAULT_STATS.results_summary,
                stacks_stats: data.stacks_stats ?? DEFAULT_STATS.stacks_stats,
                sessions_count: data.sessions_count ?? DEFAULT_STATS.sessions_count,
                recent_sessions: data.recent_sessions ?? DEFAULT_STATS.recent_sessions,
                cards_summary: data.cards_summary ?? DEFAULT_STATS.cards_summary,
            })
        } catch {
        } finally {
            refreshingRef.current = false
        }
    }, [])

    useEffect(() => {
        const savedUser = localStorage.getItem("user")
        if (savedUser) {
            setUser(savedUser)
            refreshStats()
        }
        setInitialized(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    function login(logUser){
        localStorage.setItem("user", logUser)
        setUser(logUser)
        refreshStats()
    }

    async function loginFromOAuth(){
        const profile = await getMyProfile()
        const name = profile.name
        localStorage.setItem("user", name)
        setUser(name)
        await refreshStats()
    }

    function updateUser(newName){
        localStorage.setItem("user", newName)
        setUser(newName)
    }

    async function logout(){
        try {
            await logoutUser()
        } catch {
        }
        localStorage.removeItem("user")
        setUser("")
        setStats(DEFAULT_STATS)
    }

    return(
        <AuthContext.Provider value={{user, stats, initialized, login, loginFromOAuth, logout, refreshStats, updateUser}}>
            {children}
        </AuthContext.Provider>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(){
    return useContext(AuthContext)
}