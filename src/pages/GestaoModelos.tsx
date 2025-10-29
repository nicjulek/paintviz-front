import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import "bootstrap/dist/css/bootstrap.min.css";
import InputGenerico from '../components/InputGenerico/InputGenerico';
import AvisoModal, { useAvisoModal } from '../modals/AvisoModal';
import { Carroceria } from '../types/types';
import { useNavigate } from 'react-router-dom';

const GestaoModelos: React.FC = () => {
  const [modelos, setModelos] = useState<Carroceria[]>([]);
  const [carregando, setCarregando] = useState<boolean>(true);
  const [erro, setErro] = useState<string | null>(null);
  const [termoPesquisa, setTermoPesquisa] = useState('');
  const navigate = useNavigate();
  const { modalProps, mostrarErro } = useAvisoModal();

  const buscarModelos = useCallback(async () => {
    try {
      setCarregando(true);
      const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3333";
      const token = localStorage.getItem('token');
      const response = await axios.get<Carroceria[]>(
        API_URL + '/carrocerias',
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        }
      );
      setModelos(response.data);
      setErro(null);
    } catch (error) {
      console.error("Erro ao buscar os modelos:", error);
      const mensagem = "Não foi possível carregar a lista de modelos.";
      setErro(mensagem);
      mostrarErro('Erro', mensagem);
    } finally {
      setCarregando(false);
    }
  }, [mostrarErro]);

  useEffect(() => {
    buscarModelos();
  }, [buscarModelos]);

  const handlePesquisaChange = (novoValor: string) => {
    setTermoPesquisa(novoValor);
  };

  const modelosFiltrados = modelos.filter(modelo =>
    modelo.nome_modelo.toLowerCase().includes(termoPesquisa.toLowerCase())
  );

  const handleCadastrarModelo = () => {
    navigate('/cadastro-modelo');
  };

  const handleEditar = (modelo: Carroceria) => {
    navigate(`/editar-modelo/${modelo.id_carroceria}`);
  };

  if (carregando) {
    return (
      <>
        <div className="text-center p-5">
          <div className="spinner-border text-warning" role="status"></div>
          <span className="ms-2 text-muted">Carregando modelos...</span>
        </div>
        <AvisoModal {...modalProps} />
      </>
    );
  }

  if (erro) {
    return (
      <>
        <div className="text-center p-5 text-danger">
          <i className="bi bi-exclamation-triangle me-2"></i>
          Erro: {erro}
        </div>
        <AvisoModal {...modalProps} />
      </>
    );
  }

  return (
    <>
      <div className="container-fluid p-4">
        <h2 className="mb-4 fw-bold text-center" style={{ color: '#6d4c1c', textShadow: '1px 2px 8px #d5c0a0' }}>
          <i className="bi bi-truck me-2"></i>
          Gestão de Modelos
        </h2>
        <div className="card p-4 rounded-4 shadow-lg" style={{
          backgroundColor: '#D5C0A0',
          border: 'none',
          maxWidth: '800px',
          margin: '0 auto'
        }}>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="mb-0 fs-5 fw-bold" style={{ color: '#6d4c1c' }}>
              <i className="bi bi-box-seam me-2"></i>
              Modelos Cadastrados
            </h2>
            <div className="d-flex align-items-end gap-2">
              <div style={{ minWidth: 0 }}>
                <InputGenerico
                  titulo=""
                  placeholder="Pesquisar..."
                  valor={termoPesquisa}
                  onChange={handlePesquisaChange}
                  type="text"
                />
              </div>
              <button
                className="btn btn-primary shadow-sm d-flex align-items-center gap-2"
                onClick={handleCadastrarModelo}
                style={{
                  transition: 'box-shadow 0.2s',
                  minWidth: 180,
                  height: '40px'
                }}
                onMouseEnter={e => e.currentTarget.classList.add('shadow')}
                onMouseLeave={e => e.currentTarget.classList.remove('shadow')}
              >
                <i className="bi bi-plus-circle"></i>
                Cadastrar Modelo
              </button>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-hover bg-white rounded-3 overflow-hidden shadow-sm">
              <thead>
                <tr style={{ background: '#f7e7c3' }}>
                  <th className="p-3 text-secondary">Nome</th>
                  <th className="p-3 text-end text-secondary">Ações</th>
                </tr>
              </thead>
              <tbody>
                {carregando ? (
                  <tr>
                    <td colSpan={2} className="text-center p-5">
                      <div className="spinner-border text-warning" role="status"></div>
                      <span className="ms-2 text-muted">Carregando...</span>
                    </td>
                  </tr>
                ) : erro ? (
                  <tr>
                    <td colSpan={2} className="text-center p-5 text-danger">
                      <i className="bi bi-exclamation-triangle me-2"></i>
                      {erro}
                    </td>
                  </tr>
                ) : modelosFiltrados.length > 0 ? (
                  modelosFiltrados.map((modelo) => (
                    <tr key={modelo.id_carroceria}>
                      <td className="p-3 fw-medium">{modelo.nome_modelo}</td>
                      <td className="p-3">
                        <div className="d-flex justify-content-end gap-2">
                          <button
                            className="btn btn-secondary btn-sm shadow-sm d-flex align-items-center gap-2"
                            onClick={() => handleEditar(modelo)}
                            style={{ transition: 'box-shadow 0.2s' }}
                            onMouseEnter={e => e.currentTarget.classList.add('shadow')}
                            onMouseLeave={e => e.currentTarget.classList.remove('shadow')}
                          >
                            <i className="bi bi-pencil-fill"></i>
                            Editar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={2} className="text-center p-3 text-muted">
                      <i className="bi bi-emoji-frown me-2"></i>
                      Nenhum modelo encontrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal de Aviso */}
      <AvisoModal {...modalProps} />
    </>
  );
};

export default GestaoModelos;