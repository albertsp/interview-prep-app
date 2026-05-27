
import {Routes, Route } from "react-router-dom";

import Home  from "./pages/Home";
import Session from "./pages/Session"
import Dashboard from "./pages/Dashboard"
import Layout from "./components/Layout"
import ProtectedRoute from "./components/ProtectedRoute";


function App() {


  return (

    <Routes>
      <Route element={<Layout/>}>
        <Route path="/" element={<Home/>} />
        <Route element={<ProtectedRoute/>}>
          <Route path="/session" element={<Session/>} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>

      </Route>

    </Routes>

  )
}

export default App
