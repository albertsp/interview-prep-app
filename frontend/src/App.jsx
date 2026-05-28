
import {Routes, Route } from "react-router-dom";

import Home  from "./pages/Home";
import Session from "./pages/Session"
import Dashboard from "./pages/Dashboard"
import Layout from "./components/Layout"
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login"
import Register from "./pages/Register"

function App() {


  return (

    <Routes>
      <Route element={<Layout/>}>
        <Route path="/" element={<Home/>} />
        <Route path="/register" element={<Register/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route element={<ProtectedRoute/>}>
          <Route path="/session" element={<Session/>} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>

      </Route>

    </Routes>

  )
}

export default App
