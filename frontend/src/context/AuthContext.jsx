"use client"

import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext()

export function AuthProvider({children}){

    const [user, setUser] = useState("")
    const [token, setToken] = useState("")

    useEffect(() => {
        const savedUser = localStorage.getItem("user")
        if (savedUser) setUser(savedUser)
        const savedToken = localStorage.getItem("token")
        if (savedToken) setToken(savedToken)
    }, [])

    function login(logUser,logToken){
        localStorage.setItem("token", logToken)
        localStorage.setItem("user", logUser)
        setToken(logToken)
        setUser(logUser)
    }
    function logout(){
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        setToken("")
        setUser("")
    }

    return(
        <AuthContext.Provider value={{token, user, login, logout}}>
            {children}
        </AuthContext.Provider>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(){
    return useContext(AuthContext)
}

