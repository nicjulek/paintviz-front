import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from '../components/Button/Button';
import "bootstrap/dist/css/bootstrap.min.css";
import InputGenerico from '../components/InputGenerico/InputGenerico';
import { Carroceria } from '../types/types';
import { useNavigate } from 'react-router-dom';

const GestaoModelos: React.FC = () => {
  const [modelos, setModelos] = useState<Carroceria[]>([]);
  const [carregando, setCarregando] = useState<boolean>(true);
  const [erro, setErro] = useState<string | null>(null);
  const [termoPesquisa, setTermoPesquisa] = useState('');
  const navigate = useNavigate();

  const buscarModelos = async () => {
    try {
      setCarregando(true);
      const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3000";
      const response = await axios.get<Carroceria[]>(API_URL + '/carroceria');
      setModelos(response.data);
    } catch (error) {
      console.error("Erro ao buscar os modelos:", error);
      setErro("Não foi possível carregar a lista de modelos.");
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    buscarModelos();
  }, []);

  const handlePesquisaChange = (novoValor: string) => {
    setTermoPesquisa(novoValor);
  };

  const modelosFiltrados = modelos.filter(modelo =>
    modelo.nome_modelo.toLowerCase().includes(termoPesquisa.toLowerCase())
  );

  const handleCadastrarModelo = () => {
    navigate('/cadastromodelo');
  };

  const handleEditar = (modelo: Carroceria) => {
    navigate(`/editar-modelo/${modelo.id_carroceria}`);
  };

  const handleExcluir = async (id?: number) => {
    if (!id) return;
    if (!window.confirm('Tem certeza que deseja excluir este modelo?')) return;

    try {
      const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3000";
      await axios.delete(`${API_URL}/carroceria/${id}`);
      buscarModelos();
    } catch (error) {
      console.error('Erro ao excluir modelo:', error);
      alert('Não foi possível excluir o modelo.');
    }
  };

  if (carregando) return <div className="text-center p-5">Carregando modelos...</div>;
  if (erro) return <div className="text-center p-5 text-danger">Erro: {erro}</div>;

  return (
    <div className="container-fluid p-5" style={{ backgroundColor: 'var(--paintviz-light)' }}>
      <h1 className="mb-4" style={{ color: 'var(--paintviz-text)' }}>Gestão de Modelos</h1>

      <div className="card p-4 rounded-4 shadow-sm" style={{ backgroundColor: 'var(--paintviz-accent)' }}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0 fs-5" style={{ color: 'var(--paintviz-text)' }}>Modelos Cadastrados</h2>
          <div className="d-flex align-items-end gap-2">
            <InputGenerico
              titulo="Pesquisar Modelos"
              placeholder="Nome..."
              valor={termoPesquisa}
              onChange={handlePesquisaChange}
            />
            <Button
              texto="Cadastrar Modelo"
              onClick={handleCadastrarModelo}
              cor="primary"
              className="btn-alinhado"
            />
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-hover bg-white rounded-3 overflow-hidden">
            <thead>
              <tr>
                <th className="p-3">NOME</th>
                <th className="p-3 text-end">AÇÕES</th>
              </tr>
            </thead>
            <tbody>
              {modelosFiltrados.length > 0 ? (
                modelosFiltrados.map((modelo) => (
                  <tr key={modelo.id_carroceria}>
                    <td className="p-3">{modelo.nome_modelo}</td>
                    <td className="p-3">
                      <div className="d-flex justify-content-end gap-2">
                        <Button
                          texto="Editar"
                          onClick={() => handleEditar(modelo)}
                          cor="secondary"
                          tamanho="sm"
                        />
                        <Button
                          texto="Excluir"
                          onClick={() => handleExcluir(modelo.id_carroceria)}
                          cor="danger"
                          tamanho="sm"
                        />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={2} className="text-center p-3">Nenhum modelo encontrado.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default GestaoModelos;
