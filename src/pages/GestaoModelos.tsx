import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import '../App.css';
import Button from "../components/Button/Button";

const modelos = [
  { nome: 'Boiadeira' },
];

const GestaoModelos: React.FC = () => {

  const handleEditar = (modeloNome: string) => {
    console.log(`Botão Editar clicado para: ${modeloNome}`);
    // Lógica para abrir o modal de edição, por exemplo
  };

  const handleExcluir = (modeloNome: string) => {
    console.log(`Botão Excluir clicado para: ${modeloNome}`);
    // Lógica para confirmar a exclusão
  };

  const handleCadastrar = () => {
    console.log("Botão Cadastrar Modelo clicado!");
    // Lógica para abrir o formulário de cadastro de um novo modelo
  };

  return (
    <div className="container-fluid py-4" style={{ backgroundColor: '#ECE0D1', minHeight: '100vh' }}> 
      <div className="card shadow-sm mx-auto p-4" style={{ maxWidth: '1000px', backgroundColor: '#F8F6F4', borderRadius: '8px' }}> 
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0">Modelos Cadastrados</h2>
          <div className="d-flex align-items-center gap-3">
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0">
                <i className="bi bi-search"></i> 
              </span>
              <input 
                type="text" 
                className="form-control border-start-0" 
                placeholder="Pesquisar..." 
                aria-label="Pesquisar" 
              />
            </div>
            <Button
              texto="Cadastrar Modelo"
              cor="primary"
              className="btn btn-primary"
              onClick={handleCadastrar}
            />
          </div>
        </div>
        <div className="table-responsive">
          <table className="table table-hover bg-white rounded-3 overflow-hidden">
            <thead>
              <tr style={{ backgroundColor: '#D4C6BA' }}> 
                <th className="p-3">NOME</th>
                <th className="p-3 text-end">AÇÕES</th>
              </tr>
            </thead>
            <tbody>
              {modelos.length === 0 ? (
                <tr>
                  <td colSpan={2} className="text-center p-3">Nenhum modelo cadastrado.</td>
                </tr>
              ) : (
                modelos.map((modelo, index) => (
                  <tr key={index}>
                    <td className="p-3">{modelo.nome}</td>
                    <td className="p-3">
                      <div className="d-flex justify-content-end gap-2">
                        <Button
                          texto="Editar"
                          cor="primary"
                          className="btn btn-outline-secondary btn-sm"
                          onClick={() => handleEditar(modelo.nome)}
                        />
                        <Button
                          texto="Excluir"
                          cor="primary"
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => handleExcluir(modelo.nome)}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default GestaoModelos;