import { useAuth } from '../context/AuthContext'
import { Navigate, Outlet } from 'react-router-dom'

function ProtectedRoute(){

    const { token} = useAuth()

    return token ? <Outlet /> : <Navigate to="/" />

}


export default ProtectedRoute

