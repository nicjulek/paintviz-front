import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Pintura from './pages/Pintura';
import Galeria from './pages/Galeria';
import Agenda from './pages/Agenda';
import Login from './pages/Login';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import { UsuarioAutenticado } from "./types/types";

const App: React.FC = () => {
  const [user, setUser] = useState<UsuarioAutenticado | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserFromStorage = () => {
      try {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');

        if (storedUser && token) {
          const backendUser = JSON.parse(storedUser);

          // converte dados do backend para o do frontend
          const frontendUser: UsuarioAutenticado = {
            id: backendUser.id,
            nome: backendUser.nome,
            isAdmin: backendUser.isAdmin
          };

          setUser(frontendUser);
        }
      } catch (error) {
        console.error('Erro ao carregar usuário do localStorage:', error);
        // limpa dados corrompidos
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    loadUserFromStorage();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
  };

  const handleLoginSuccess = (backendUser: any) => {
    const frontendUser: UsuarioAutenticado = {
      id: backendUser.id,
      nome: backendUser.nome,
      isAdmin: backendUser.isAdmin
    };

    setUser(frontendUser);
  };

  // loading
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
    <BrowserRouter>
      <Routes>
        {/* se não estiver logado, sempre redireciona para login */}
        {!user ? (
          <>
            <Route
              path="/login"
              element={<Login onLoginSuccess={handleLoginSuccess} />}
            />
            <Route
              path="*"
              element={<Navigate to="/login" replace />}
            />
          </>
        ) : (
          // se estiver logado, mostra as páginas com header/footer
          <>
            <Route
              path="/login"
              element={<Navigate to="/" replace />}
            />
            <Route
              path="/*"
              element={
                <div className="d-flex flex-column min-vh-100">
                  <Header
                    user={user ? { name: user.nome, role: user.isAdmin ? 'admin' : 'user' } : null}
                    onLogout={handleLogout}
                  />
                  <main className="flex-grow-1">
                    <div className="container mt-4">
                      <Routes>
                        <Route path="/" element={<Pintura />} />
                        <Route path="/galeria" element={<Galeria />} />
                        <Route path="/agenda" element={<Agenda />} />
                      </Routes>
                    </div>
                  </main>
                  <Footer />
                </div>
              }
            />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
};

export default App;