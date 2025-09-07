import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from '../components/Button/Button'; 
import "bootstrap/dist/css/bootstrap.min.css";
import InputGenerico from '../components/InputGenerico/InputGenerico';
import { Usuario } from '../types/types';
import { useNavigate } from 'react-router-dom'; 

const GestaoAtendentes: React.FC = () => {
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [carregando, setCarregando] = useState<boolean>(true);
    const [erro, setErro] = useState<string | null>(null);
    const [termoPesquisa, setTermoPesquisa] = useState('');

    const navigate = useNavigate(); 

    const buscarUsuarios = async () => {
        try {
            setCarregando(true);
            const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3333";
            const response = await axios.get(API_URL + '/usuarios'); 
            setUsuarios(response.data);
        } catch (error) {
            console.error("Erro ao buscar os usuários:", error);
            setErro("Não foi possível carregar a lista de usuários.");
        } finally {
            setCarregando(false);
        }
    };

    useEffect(() => {
        buscarUsuarios();
    }, []);

    const handlePesquisaChange = (novoValor: string) => {
        setTermoPesquisa(novoValor);
    };

    const atendentesFiltrados = usuarios
        .filter(user => !user.isAdmin) 
        .filter(atendente => atendente.nome.toLowerCase().includes(termoPesquisa.toLowerCase()));

    const handleCadastrarAtendente = () => {
        navigate('/cadastroatendentes');
    };

    const handleEditar = (atendente: Usuario) => {
        navigate(`/cadastroatendentes/${atendente.id_usuario}`);
    };

    const handleExcluir = async (id?: number) => {
        if (!id) return;
        if (!window.confirm('Tem certeza que deseja excluir este atendente?')) return;

        try {
            const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3333";
            await axios.delete(`${API_URL}/usuarios/${id}`);
            buscarUsuarios();
        } catch (error) {
            console.error('Erro ao excluir atendente:', error);
            alert('Não foi possível excluir o atendente.');
        }
    };

    if (carregando) return <div className="text-center p-5">Carregando usuários...</div>;
    if (erro) return <div className="text-center p-5 text-danger">Erro: {erro}</div>;

    return (
        <div className="container-fluid p-5" style={{ backgroundColor: 'var(--paintviz-light)' }}>
           <h1 className="mb-4" style={{ color: 'var(--paintviz-text)' }}>Gestão de Atendentes</h1>
            <div className="card p-4 rounded-4 shadow-sm" style={{ backgroundColor: 'var(--paintviz-accent)' }}>
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="mb-0 fs-5"style={{ color: 'var(--paintviz-text)' }}>Atendentes Cadastrados</h2>
                    <div className="d-flex align-items-end gap-2">
                        <InputGenerico
                            titulo="Pesquisar Atendentes"
                            placeholder="Nome..."
                            valor={termoPesquisa}
                            onChange={handlePesquisaChange}
                        />
                        <Button
                            texto="Cadastrar Atendente"
                            onClick={handleCadastrarAtendente}
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
                            {atendentesFiltrados.length > 0 ? (
                                atendentesFiltrados.map((atendente, index) => (
                                    <tr key={atendente.id_usuario || index}>
                                        <td className="p-3">{atendente.nome}</td>
                                        <td className="p-3">
                                            <div className="d-flex justify-content-end gap-2">
                                                <Button
                                                    texto="Editar"
                                                    onClick={() => handleEditar(atendente)}
                                                    cor="secondary"
                                                    tamanho="sm"
                                                />
                                                <Button
                                                    texto="Excluir"
                                                    onClick={() => handleExcluir(atendente.id_usuario)}
                                                    cor="danger"
                                                    tamanho="sm"
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={2} className="text-center p-3">Nenhum atendente encontrado.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default GestaoAtendentes;
