"use client"

import { createContext, useContext, useState } from "react";

const AuthContext = createContext()

export function AuthProvider({children}){

    const [user, setUser] = useState("")
    const [token, setToken] = useState("")

    function login(logUser,logToken){
        setToken(logToken)
        setUser(logUser)
    }
    function logout(){
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

