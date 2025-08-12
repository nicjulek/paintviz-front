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
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('Iniciando login...');

      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3333';
      console.log('API URL:', `${API_URL}/auth/login`);

      const response = await axios.post(`${API_URL}/auth/login`, {
        nome: usuario,
        senha: senha
      });

      console.log('Resposta do backend:', response.data);

      if (response.data.token) {
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
      style={{ backgroundColor: '#a19072ff' }}
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-5 col-sm-6">
            <div
              className="card shadow-lg"
              style={{
                backgroundColor: '#D5C0A0',
                border: '2px solid white',
                borderRadius: '15px'
              }}
            >
              <div className="card-body p-5">
                {/* Logo e título */}
                <div className="text-center mb-4">
                  <div
                    className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                    style={{
                      width: '80px',
                      height: '80px',
                      backgroundColor: 'white'
                    }}
                  >
                    <img
                      src="/icon-p.png"
                      alt="PaintViz Logo"
                      width="50"
                      height="50"
                    />
                  </div>
                  <h2 className="fw-bold text-dark mb-2">Bem-vindo(a) de volta!</h2>
                  <p className="text-dark mb-0" style={{ fontSize: '0.9rem' }}>
                    Dando vida às suas ideias com cores e formas.
                  </p>
                </div>

                {error && (
                  <div className="alert alert-danger d-flex align-items-center" role="alert">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    {error}
                  </div>
                )}

                <form onSubmit={handleLogin}>
                  <div className="mb-3">
                    <label htmlFor="usuario" className="form-label text-dark fw-bold">
                      <i className="bi bi-person me-1"></i>
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
                      <i className="bi bi-lock me-1"></i>
                      Senha
                    </label>
                    <div className="input-group">
                      <input
                        type={showPassword ? "text" : "password"}
                        className="form-control"
                        id="senha"
                        placeholder="Digite sua senha"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        required
                        disabled={loading}
                        style={{
                          borderRadius: '8px 0 0 8px',
                          border: 'none',
                          padding: '12px'
                        }}
                      />
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={loading}
                        style={{
                          borderRadius: '0 8px 8px 0',
                          border: 'none',
                          backgroundColor: 'white'
                        }}
                      >
                        <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn w-100 text-white fw-bold"
                    disabled={loading || !usuario || !senha}
                    style={{
                      backgroundColor: loading ? '#6c757d' : '#28A745',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '12px',
                      fontSize: '16px'
                    }}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Entrando...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-box-arrow-in-right me-2"></i>
                        Entrar
                      </>
                    )}
                  </button>
                </form>

                <div className="text-center mt-3">
                  <small className="text-dark">
                    <i className="bi bi-info-circle me-1"></i>
                    Se você esqueceu a senha, contate o administrador.
                  </small>
                </div>
              </div>
            </div>
            <div className="text-center mt-3">
              <small className="text-white-50">
                <i className="bi bi-code-square me-1"></i>
                PaintViz v1.0.0
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;