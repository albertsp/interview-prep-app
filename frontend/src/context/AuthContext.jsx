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

    const [user, setUser] = useState(null)
    const [stats, setStats] = useState(DEFAULT_STATS)
    const [initialized, setInitialized] = useState(false)
    const refreshingRef = useRef(false)
    // Marcamos un login en curso para que un 401 transitorio (p. ej. el
    // refreshStats inicial con token stale) no limpie el token nuevo que
    // loginFromOAuth acaba de escribir en localStorage.
    const loggingInRef = useRef(false)

    useEffect(() => {
        setOnUnauthorized(() => {
            if (loggingInRef.current) return
            localStorage.removeItem("user")
            localStorage.removeItem("access_token")
            setUser(null)
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
        const savedToken = localStorage.getItem("access_token")

        const restore = async () => {
            if (savedUser && savedToken) {
                setUser(savedUser)
                refreshStats()
                setInitialized(true)
            } else if (savedUser && !savedToken) {
                loggingInRef.current = true
                try {
                    const profile = await getMyProfile()
                    const name = profile.name || profile.email || "User"
                    localStorage.setItem("user", name)
                    setUser(name)
                    refreshStats()
                } catch {
                    localStorage.removeItem("user")
                } finally {
                    loggingInRef.current = false
                    setInitialized(true)
                }
            } else {
                setInitialized(true)
            }
        }

        restore()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    function login(logUser, token){
        const name = logUser || "User"
        if (token) localStorage.setItem("access_token", token)
        localStorage.setItem("user", name)
        setUser(name)
        refreshStats()
    }

    async function loginFromOAuth(){
        loggingInRef.current = true
        try {
            const profile = await getMyProfile()
            const name = profile.name || profile.email || "User"
            localStorage.setItem("user", name)
            setUser(name)
            await refreshStats()
        } finally {
            loggingInRef.current = false
        }
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
        localStorage.removeItem("access_token")
        setUser(null)
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