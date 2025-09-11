import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Pintura from './pages/Pintura';
import Galeria from './pages/Galeria';
import Agenda from './pages/Agenda';
import Login from './pages/Login';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import { UsuarioAutenticado } from "./types/types";
import CadastroOrdem from './pages/CadastroOrdem';
import ProtectedOrdemRoute from './components/ProtectedOrdemRoute/ProtectedOrdemRoute';
import CadastroModelo from './pages/CadastroModelo';
import GestaoModelos from './pages/GestaoModelos';
import GestaoAtendentes from './pages/GestaoAtendentes';
import ErroAcesso from './pages/ErroAcesso';
import Ordem from './pages/Ordem';

const App: React.FC = () => {
  const [user, setUser] = useState<UsuarioAutenticado | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setUser(null);
      navigate("/login");
    }
    setLoading(false);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    navigate("/login");
  };

  const handleLoginSuccess = (backendUser: any) => {
    const frontendUser: UsuarioAutenticado = {
      id: backendUser.id,
      nome: backendUser.nome,
      isAdmin: backendUser.isAdmin
    };
    setUser(frontendUser);
    localStorage.setItem('user', JSON.stringify(frontendUser));
    if (backendUser.token) {
      localStorage.setItem('token', backendUser.token);
    }
    navigate("/galeria");
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100" style={{ backgroundColor: '#E8D5B7' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
      </div>
    );
  }

  return (
    !user ? (
      <Routes>
        <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
        <Route path="*" element={<ErroAcesso mensagem="Faça login para acessar o sistema." />} />
      </Routes>
    ) : (
      <div className="d-flex flex-column min-vh-100">
        <Header
          user={user ? { name: user.nome, role: user.isAdmin ? 'admin' : 'user' } : null}
          onLogout={handleLogout}
        />
        <main className="flex-grow-1" style={{ padding: '24px', minHeight: 0 }}>
          <Routes>
            <Route path="/login" element={<Navigate to="/galeria" replace />} />
            <Route path="/pintura" element={<Pintura />} />
            <Route path="/galeria" element={<Galeria />} />
            <Route path="/cadastro-modelo" element={<CadastroModelo />} />
            <Route path="/gestao-modelos" element={<GestaoModelos />} />
            <Route path="/gestao-atendentes" element={<GestaoAtendentes />} />
            <Route path="/agenda" element={<Agenda />} />
            <Route
              path="/cadastro-ordem"
              element={
                <ProtectedOrdemRoute>
                  <CadastroOrdem />
                </ProtectedOrdemRoute>
              }
            />
            <Route path="/ordem/:id" element={<Ordem />} />
            <Route path="*" element={<ErroAcesso mensagem="Página não encontrada ou acesso não autorizado." />} />
          </Routes>
        </main>
        <Footer />
      </div>
    )
  );
};

export default App;