
import {Routes, Route } from "react-router-dom";

import Home  from "./pages/Home";
import Session from "./pages/Session"
import Dashboard from "./pages/Dashboard"
import Layout from "./components/Layout"


function App() {


  return (

    <Routes>
      <Route element={<Layout/>}>
        <Route path="/" element={<Home/>} />
        <Route path="/session" element={<Session/>} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>

    </Routes>

  )
}

export default App
