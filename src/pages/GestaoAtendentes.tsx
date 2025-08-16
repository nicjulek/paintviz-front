import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from '../components/Button/Button'; 
import "bootstrap/dist/css/bootstrap.min.css";
import InputGenerico from '../components/InputGenerico/InputGenerico';
import { User, UserRole } from '../types/types';

const GestaoAtendentes: React.FC = () => {

    // Estado para armazenar todos os usuários da API
    const [usuarios, setUsuarios] = useState<User[]>([]);
    const [carregando, setCarregando] = useState<boolean>(true);
    const [erro, setErro] = useState<string | null>(null);

    // Estado para a pesquisa
    const [termoPesquisa, setTermoPesquisa] = useState('');

    useEffect(() => {
        const buscarUsuarios = async () => {
            try {
                //URL placeholder
                const response = await axios.get('http://localhost:3000/usuarios');
                setUsuarios(response.data);
            } catch (error) {
                console.error("Erro ao buscar os usuários:", error);
                setErro("Não foi possível carregar a lista de usuários.");
            } finally {
                setCarregando(false);
            }
        };

        buscarUsuarios();
    }, []);

    const handlePesquisaChange = (novoValor: string) => {
        setTermoPesquisa(novoValor);
    };

    //Filtra por role e depois pela pesquisa por nome
    const atendentesFiltrados = usuarios
        .filter(user => user.role === 'user')
        .filter(atendente => atendente.name.toLowerCase().includes(termoPesquisa.toLowerCase()));

    const handleCadastrarAtendente = () => {
        // Lógica para abrir o modal de cadastro
    };

    const handleEditar = (atendente: User) => {
        // Lógica para abrir o modal de edição
    };

    //Excluir usuário atendente
    const handleExcluir = async (atendenteId: string) => {
        if (!window.confirm('Tem certeza que deseja excluir este atendente?')) {
            return;
        }

        try {
            // Requisição DELETE para a rota 
            await axios.delete(`http://localhost:3000/usuarios/${atendenteId}`);

            setUsuarios(prevUsuarios => prevUsuarios.filter(user => user.id !== atendenteId));

            alert('Atendente excluído com sucesso!');
        } catch (error) {
            console.error('Erro ao excluir atendente:', error);
            alert('Não foi possível excluir o atendente.');
        }
    };

    if (carregando) {
        return <div className="text-center p-5">Carregando usuários...</div>;
    }

    if (erro) {
        return <div className="text-center p-5 text-danger">Erro: {erro}</div>;
    }

    return (
        <div className="container-fluid p-5" style={{ backgroundColor: '#F5F5DC' }}>
            <h1 className="mb-4">Gestão de Atendentes</h1>
            <div className="card p-4 rounded-4 shadow-sm" style={{ backgroundColor: '#F0E6D5' }}>
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="mb-0 fs-5">Atendentes Cadastrados</h2>
                    <div className="d-flex align-items-center">
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
                            {atendentesFiltrados.length > 0 ? (
                                atendentesFiltrados.map(atendente => (
                                    <tr key={atendente.id}>
                                        <td className="p-3">{atendente.name}</td>
                                        <td className="p-3">
                                            {atendente.role === 'user' ? 'Ativo' : 'Inativo'}
                                        </td>
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
                                                    onClick={() => atendente.id && handleExcluir(atendente.id)}
                                                    cor="danger"
                                                    tamanho="sm"
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={3} className="text-center p-3">Nenhum atendente encontrado.</td>
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