
import {Routes, Route } from "react-router-dom";

import Home  from "./pages/Home";
import Session from "./pages/Session"
import Dashboard from "./pages/Dashboard"



function App() {


  return (

    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/session" element={<Session/>} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>

  )
}

export default App
