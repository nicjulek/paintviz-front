import React from 'react';
import Button from '../components/Button/Button'; 
import "bootstrap/dist/css/bootstrap.min.css";

const GestaoAtendentes: React.FC = () => {

    const atendentes = [
    { nome: "João da Silva", status: "Ativo" },
    { nome: "Maria Oliveira", status: "Inativo" },
    { nome: "Júlia Souza", status: "Ativo" },
];

    const handleCadastrarAtendente = () => {
        // Lógica para abrir a tela de login
    };

    const handleEditar = (atendenteNome: string) => {
        // Lógica para abrir o modal de edição
    };

    const handleExcluir = (atendenteNome: string) => {
        // Lógica para confirmar a exclusão
    };


    return (
        <div className="container-fluid p-5" style={{ backgroundColor: '#F5F5DC' }}>
            <h1 className="mb-4">Gestão de Atendentes</h1>

            <div className="card p-4 rounded-4 shadow-sm" style={{ backgroundColor: '#F0E6D5' }}>
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="mb-0 fs-5">Atendentes Cadastrados</h2>
                    <div className="d-flex align-items-center">
                        <input
                            type="text"
                            placeholder="Pesquisar..."
                            className="form-control me-2"
                        />
                        <Button 
                            texto="Cadastrar Atendente"
                            onClick={handleCadastrarAtendente}
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
                            <th className="p-3">STATUS</th>
                            <th className="p-3 text-end">AÇÕES</th>
                        </tr>
                    </thead>
                    <tbody>
                        {atendentes.map((atendente, index) => (
                            <tr key={index}>
                                <td className="p-3">{atendente.nome}</td>
                                <td className="p-3">{atendente.status}</td>
                                <td className="p-3">
                                    <div className="d-flex justify-content-end gap-2">
                                        <Button
                                            texto="Editar"
                                            onClick={() => handleEditar(atendente.nome)}
                                            cor="secondary" 
                                            tamanho="sm" 
                                        />
                                        <Button
                                            texto="Excluir"
                                            onClick={() => handleExcluir(atendente.nome)}
                                            cor="danger" 
                                            tamanho="sm"
                                        />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            </div>
        </div>
    );
};

export default GestaoAtendentes;