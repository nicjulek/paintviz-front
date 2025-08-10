import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Pintura from './pages/Pintura';
import Galeria from './pages/Galeria';
import Agenda from './pages/Agenda';
import Header from './components/Header/Header';
import { User } from "./types/types";
import Footer from './components/Footer/Footer';
import GestaoAtendentes from './pages/GestaoAtendentes';

const testeUser: User = {
  name: "João",
  role: "admin" 
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Header user={testeUser} />
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Pintura />} />
          <Route path="/galeria" element={<Galeria />} />
          <Route path="/agenda" element={<Agenda />} />
          <Route path="/gestaoatendentes" element={<GestaoAtendentes/>} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;