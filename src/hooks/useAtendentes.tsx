import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Usuario } from '../types/types';
import { useAvisoModal } from '../modals/AvisoModal';

export const useAtendentes = () => {
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [carregando, setCarregando] = useState<boolean>(true);
    const [erro, setErro] = useState<string | null>(null);
    const [termoPesquisa, setTermoPesquisa] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [modalId, setModalId] = useState<number | undefined>(undefined);

    // Hook do AvisoModal
    const { modalProps, mostrarSucesso, mostrarErro, mostrarConfirmacao, fecharModal } = useAvisoModal();

    const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3333";

    // CORRIGIDO: Usar useCallback para evitar dependência no useEffect
    const buscarUsuarios = useCallback(async () => {
        try {
            setCarregando(true);
            setErro(null);
            const response = await axios.get(`${API_URL}/usuarios`);
            setUsuarios(response.data);
        } catch (error) {
            console.error('Erro ao carregar usuários:', error);
            mostrarErro('Erro', 'Não foi possível carregar a lista de usuários.');
            setErro("Não foi possível carregar a lista de usuários.");
        } finally {
            setCarregando(false);
        }
    }, [API_URL, mostrarErro]);

    const excluirAtendente = async (id?: number) => {
        if (!id) return false;

        return new Promise<boolean>((resolve) => {
            mostrarConfirmacao(
                'Confirmar Exclusão',
                'Tem certeza que deseja excluir este atendente? Esta ação não pode ser desfeita.',
                async () => {
                    try {
                        await axios.delete(`${API_URL}/usuarios/${id}`);
                        await buscarUsuarios();
                        fecharModal();
                        mostrarSucesso('Sucesso', 'Atendente excluído com sucesso!');
                        
                        setTimeout(() => {
                            fecharModal();
                        }, 2000);
                        
                        resolve(true);
                    } catch (error) {
                        console.error('Erro ao excluir atendente:', error);
                        mostrarErro('Erro', 'Não foi possível excluir o atendente.');
                        resolve(false);
                    }
                }
            );
        });
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
    }, [buscarUsuarios]);

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
        handleCloseModal,
        modalProps
    };
};