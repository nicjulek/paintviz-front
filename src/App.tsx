import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import Pintura from './pages/Pintura';
import Galeria from './pages/Galeria';
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
import ProtectedAdminRoute from './components/ProtectedAdminRoute/ProtectedAdminRoute';
import CadastroModelos from './pages/CadastroModelo';
import { HelpProvider } from './context/HelpContext';
import AvisoModal from './modals/AvisoModal';

const App: React.FC = () => {
  const [user, setUser] = useState<UsuarioAutenticado | null>(null);
  const [loading, setLoading] = useState(true);
  const [showErroModal, setShowErroModal] = useState(false);
  const [erroModalConfig, setErroModalConfig] = useState({
    titulo: '',
    mensagem: '',
    onRetry: undefined as (() => void) | undefined
  });
  
  const navigate = useNavigate();
  const location = useLocation();

  // Função para mostrar modal de erro
  const mostrarErroConexao = (mensagem?: string, onRetry?: () => void) => {
    setErroModalConfig({
      titulo: 'Problema de Conexão',
      mensagem: mensagem || 'Não foi possível conectar com o servidor. Verifique se o backend está rodando na porta 3333.',
      onRetry
    });
    setShowErroModal(true);
  };

  // Função para verificar se o usuário está saindo da pintura
  const verificarSaidaDaPintura = () => {
    const pinturaStatus = localStorage.getItem('pintura_status');
    const pinturaId = localStorage.getItem('id_pintura');
    
    if (pinturaId && pinturaStatus === 'temporaria') {
      // Usuário está saindo da área de pintura/ordem sem finalizar
      console.log('Usuário saiu da área de pintura sem finalizar - limpando dados temporários');
      
      // Limpar dados temporários
      localStorage.removeItem('id_pintura');
      localStorage.removeItem('pintura_temporaria_id');
      localStorage.removeItem('pintura_criada_em');
      localStorage.removeItem('pintura_status');
      
      // Tentar excluir do banco se possível
      const excluirPinturaTemporaria = async () => {
        try {
          const token = localStorage.getItem('token');
          await axios.delete(`http://localhost:3333/pinturas/${pinturaId}`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {}
          });
          console.log('Pintura temporária excluída com sucesso');
        } catch (error) {
          console.warn('Erro ao excluir pintura temporária:', error);
        }
      };
      
      excluirPinturaTemporaria();
    }
  };

  // Detectar mudanças de rota
  useEffect(() => {
    const rotasQuePermitemPinturaTemporaria = ['/pintura', '/cadastro-ordem'];
    const rotaAtual = location.pathname;
    
    // Se não está mais em uma rota que permite pintura temporária
    if (!rotasQuePermitemPinturaTemporaria.includes(rotaAtual)) {
      verificarSaidaDaPintura();
    }
  }, [location.pathname]);

  // Detectar eventos de navegação do browser (voltar/avançar)
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      const pinturaStatus = localStorage.getItem('pintura_status');
      const pinturaId = localStorage.getItem('id_pintura');
      
      if (pinturaId && pinturaStatus === 'temporaria') {
        // Avisa o usuário antes de sair da página
        const mensagem = 'Você tem uma pintura não finalizada que será perdida. Deseja realmente sair?';
        event.preventDefault();
        event.returnValue = mensagem;
        return mensagem;
      }
    };

    const handlePopState = () => {
      // Detecta navegação com botões voltar/avançar do browser
      verificarSaidaDaPintura();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      
      // Verificar e limpar pinturas temporárias expiradas
      verificarPinturasExpiradas();
    } else {
      setUser(null);
      navigate("/login");
    }
    setLoading(false);
  }, [navigate]);

  const verificarPinturasExpiradas = async () => {
    try {
      const pinturaTemporariaId = localStorage.getItem('pintura_temporaria_id');
      const pinturaCriadaEm = localStorage.getItem('pintura_criada_em');
      const pinturaStatus = localStorage.getItem('pintura_status');
      
      if (pinturaTemporariaId && pinturaCriadaEm && pinturaStatus === 'temporaria') {
        const agora = new Date();
        const criadaEm = new Date(pinturaCriadaEm);
        const diferencaHoras = (agora.getTime() - criadaEm.getTime()) / (1000 * 60 * 60);
        
        // Se a pintura foi criada há mais de 2 horas, considerar abandonada
        if (diferencaHoras > 2) {
          console.log('Pintura temporária expirada, removendo...', pinturaTemporariaId);
          
          // Tentar excluir do banco
          try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:3333/pinturas/${pinturaTemporariaId}`, {
              headers: token ? { Authorization: `Bearer ${token}` } : {}
            });
            console.log('Pintura temporária excluída do banco com sucesso');
          } catch (error) {
            console.warn('Erro ao excluir pintura temporária do banco:', error);
            
            // Se o erro for de conexão, não mostrar modal pois é processo em background
            if (axios.isAxiosError(error) && error.code === 'ERR_NETWORK') {
              console.warn('Erro de rede ao limpar pintura temporária - continuando...');
            }
          }
          
          // Limpar localStorage
          localStorage.removeItem('id_pintura');
          localStorage.removeItem('pintura_temporaria_id');
          localStorage.removeItem('pintura_criada_em');
          localStorage.removeItem('pintura_status');
        }
      }
    } catch (error) {
      console.warn('Erro ao verificar pinturas expiradas:', error);
    }
  };

  const handleLogout = () => {
    // Limpar dados de pintura temporária ao fazer logout
    verificarSaidaDaPintura();
    
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

  // Interceptor global do Axios para capturar erros de conexão
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        // Verificar se é erro de conexão
        if (error.code === 'ERR_NETWORK' || error.message?.includes('Network Error')) {
          // Só mostrar modal se não estivermos na tela de login
          if (location.pathname !== '/login') {
            mostrarErroConexao(
              'Conexão perdida com o servidor. Verifique sua conexão de internet e se o backend está rodando.',
              () => {
                setShowErroModal(false);
                window.location.reload(); // Recarrega a página para tentar reconectar
              }
            );
          }
        }
        
        return Promise.reject(error);
      }
    );

    // Cleanup do interceptor
    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, [location.pathname]);

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
    <HelpProvider>
      {!user ? (
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
              <Route
                path="/cadastro-modelo"
                element={
                  <ProtectedAdminRoute>
                    <CadastroModelo />
                  </ProtectedAdminRoute>
                }
              />
              <Route
                path="/gestao-modelos"
                element={
                  <ProtectedAdminRoute>
                    <GestaoModelos />
                  </ProtectedAdminRoute>
                }
              />
              <Route
                path="/gestao-atendentes"
                element={
                  <ProtectedAdminRoute>
                    <GestaoAtendentes />
                  </ProtectedAdminRoute>
                }
              />
              <Route 
                path="/editar-modelo/:id" 
                element={
                  <ProtectedAdminRoute>
                    <CadastroModelos />
                  </ProtectedAdminRoute>
              } />
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
      )}
      
      <AvisoModal
        show={showErroModal}
        onClose={() => setShowErroModal(false)}
        onRetry={erroModalConfig.onRetry}
        titulo={erroModalConfig.titulo}
        mensagem={erroModalConfig.mensagem}
        mostrarRetry={!!erroModalConfig.onRetry}
      />
    </HelpProvider>
  );
};

export default App;