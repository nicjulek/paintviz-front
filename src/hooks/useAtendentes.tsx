import { useState, useEffect } from 'react';
import axios from 'axios';
import { Usuario } from '../types/types';

export const useAtendentes = () => {
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [carregando, setCarregando] = useState<boolean>(true);
    const [erro, setErro] = useState<string | null>(null);
    const [termoPesquisa, setTermoPesquisa] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [modalId, setModalId] = useState<number | undefined>(undefined);

    const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3333";

    const buscarUsuarios = async () => {
        try {
            setCarregando(true);
            setErro(null);
            const response = await axios.get(`${API_URL}/usuarios`);
            setUsuarios(response.data);
        } catch (error) {
            setErro("Não foi possível carregar a lista de usuários.");
        } finally {
            setCarregando(false);
        }
    };

    const excluirAtendente = async (id?: number) => {
        if (!id) return false;
        if (!window.confirm('Tem certeza que deseja excluir este atendente?')) return false;

        try {
            await axios.delete(`${API_URL}/usuarios/${id}`);
            await buscarUsuarios();
            return true;
        } catch (error) {
            alert('Não foi possível excluir o atendente.');
            return false;
        }
    };

    const handlePesquisaChange = (novoValor: string) => {
        setTermoPesquisa(novoValor);
    };

    const handleCadastrarAtendente = () => {
        setModalId(undefined);
        setModalOpen(true);
    };

    const handleEditar = (atendente: Usuario) => {
        setModalId(atendente.id_usuario);
        setModalOpen(true);
    };

    const handleExcluir = async (id?: number) => {
        await excluirAtendente(id);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setModalId(undefined);
    };

    const atendentesFiltrados = usuarios
        .filter(user => !user.isAdmin)
        .filter(atendente => atendente.nome.toLowerCase().includes(termoPesquisa.toLowerCase()));

    useEffect(() => {
        buscarUsuarios();
    }, []);

    return {
        usuarios,
        carregando,
        erro,
        termoPesquisa,
        modalOpen,
        modalId,
        atendentesFiltrados,
        buscarUsuarios,
        excluirAtendente,
        handlePesquisaChange,
        handleCadastrarAtendente,
        handleEditar,
        handleExcluir,
        handleCloseModal
    };
};