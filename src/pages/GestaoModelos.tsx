import React, { useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import InputGenerico from '../components/InputGenerico/InputGenerico';
import Button from '../components/Button/Button';

interface Modelo {
  id: number;
  nome: string;
}

const GestaoModelos: React.FC = () => {
  const [modelos, setModelos] = useState<Modelo[]>([
    { id: 1, nome: 'Boiadeira' },
    { id: 2, nome: 'Carreta' }
  ]);

  const [termoPesquisa, setTermoPesquisa] = useState('');

  const handlePesquisaChange = (novoValor: string) => {
    setTermoPesquisa(novoValor);
  };

  const modelosFiltrados = modelos.filter(modelo =>
    modelo.nome.toLowerCase().includes(termoPesquisa.toLowerCase())
  );

  const handleCadastrarModelo = () => {
    // abrir modal de cadastro
  };

  const handleEditar = (modelo: Modelo) => {
    console.log("Editar", modelo);
  };

  const handleExcluir = (modeloId: number) => {
    if (!window.confirm('Tem certeza que deseja excluir este modelo?')) return;
    setModelos(prev => prev.filter(m => m.id !== modeloId));
  };

  return (
    <div className="container-fluid p-5" style={{ backgroundColor: '#F5F5DC' }}>
      <h1 className="mb-4">Gestão de Modelos</h1>
      <div className="card p-4 rounded-4 shadow-sm" style={{ backgroundColor: '#F0E6D5' }}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0 fs-5">Modelos Cadastrados</h2>
          <div className="d-flex align-items-center">
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
              icone=""
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
                modelosFiltrados.map(modelo => (
                  <tr key={modelo.id}>
                    <td className="p-3">{modelo.nome}</td>
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
                          onClick={() => handleExcluir(modelo.id)}
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
