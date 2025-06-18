import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Cadastro from './pages/cadastro/cadastro';
import Login from './pages/login/login';
import Home from './pages/Home/home';
import Ambientes from './pages/ambiente/ambiente';
import Historicos from './pages/historico/historico';
import Sensores from './pages/sensor/sensor';
import Mapeamento from './pages/mapeamento/mapeamento';
import 'leaflet/dist/leaflet.css';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/ambientes" element={<Ambientes />} />
        <Route path="/historico" element={<Historicos />} />
        <Route path="/sensores" element={<Sensores />} />
        <Route path="/mapeamento" element={<Mapeamento />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
