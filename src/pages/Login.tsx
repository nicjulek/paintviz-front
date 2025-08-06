import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import '../App.css';
import axios from "axios";

interface LoginProps {
  onLoginSuccess: (user: any) => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('Iniciando login...'); //teste
      
      // req
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3333';
      console.log('API URL:', `${API_URL}/auth/login`); //teste

      const response = await axios.post(`${API_URL}/auth/login`, {
        nome: usuario, 
        senha: senha
      });

      console.log('Resposta do backend:', response.data); //teste

      // login foi bem-sucedido
      if (response.data.token) {
        // salva token
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));

        onLoginSuccess(response.data.user);
        
        console.log('Login realizado com sucesso:', response.data);
      }

    } catch (error: any) {
      console.error('Erro no login:', error);
      
      if (error.response?.data?.error) {
        setError(error.response.data.error);
      } else if (error.response?.data?.details) {
        // erros de validação do yup
        setError(error.response.data.details.join(', '));
      } else if (error.code === 'ERR_NETWORK') {
        setError('Não foi possível conectar com o servidor. Verifique se o backend está rodando na porta 3333.');
      } else {
        setError('Erro ao conectar com o servidor');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="d-flex align-items-center justify-content-center min-vh-100" 
      style={{ backgroundColor: '#E8D5B7' }}
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-5 col-sm-6">
            <div className="card shadow-lg" style={{ backgroundColor: '#D5C0A0', border: '1px solid white', borderRadius: '15px' }}>
              <div className="card-body p-5">
                <h2 className="text-center mb-4 fw-bold text-dark">Login</h2>
                
                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}
                
                <form onSubmit={handleLogin}>
                  <div className="mb-3">
                    <label htmlFor="usuario" className="form-label text-dark fw-bold">
                      Usuario
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="usuario"
                      placeholder="Digite seu usuario"
                      value={usuario}
                      onChange={(e) => setUsuario(e.target.value)}
                      required
                      disabled={loading}
                      style={{
                        borderRadius: '8px',
                        border: 'none',
                        padding: '12px'
                      }}
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="senha" className="form-label text-dark fw-bold">
                      Senha
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="senha"
                      placeholder="Digite sua senha"
                      value={senha}
                      onChange={(e) => setSenha(e.target.value)}
                      required
                      disabled={loading}
                      style={{
                        borderRadius: '8px',
                        border: 'none',
                        padding: '12px'
                      }}
                    />
                  </div>
                  
                  <button
                    type="submit"
                    className="btn w-100 text-white fw-bold"
                    disabled={loading}
                    style={{
                      backgroundColor: loading ? '#6c757d' : '#28A745',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '12px',
                      fontSize: '16px'
                    }}
                  >
                    {loading ? 'Entrando...' : 'Entrar'}
                  </button>
                </form>
                
                <div className="text-center mt-3">
                  <small className="text-dark">
                    Se você esqueceu a senha, contate o administrador. 
                  </small> {/* talvez mudar? */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;