import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Peca, Carroceria } from '../types/types';
import { useAvisoModal } from '../modals/AvisoModal';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3333';

export const useCadastroModelo = () => {
  const [nomeModelo, setNomeModelo] = useState('');
  const [lateralSVG, setLateralSVG] = useState<File | null>(null);
  const [traseiraSVG, setTraseiraSVG] = useState<File | null>(null);
  const [diagonalSVG, setDiagonalSVG] = useState<File | null>(null);
  const [modelo, setModelo] = useState<Carroceria | null>(null);
  const [pecas, setPecas] = useState<Peca[]>([
    { nome_peca: '', id_svg: '', id_pintura: 1, id_carroceria: 0, cor_atual: '', cor_inicial: '' }
  ]);
  const [loading, setLoading] = useState(false);
  const [carregandoDados, setCarregandoDados] = useState(false);

  // Hook do AvisoModal
  const { modalProps, mostrarModal, mostrarSucesso, mostrarErro, fecharModal } = useAvisoModal();

  const navigate = useNavigate();
  const { id } = useParams();
  const isEdicao = !!id;

   const carregarDadosModelo = useCallback(async () => {
    setCarregandoDados(true);
    try {
      const token = localStorage.getItem('token');
      
      // Carregar dados da carroceria
      const carroceriaResponse = await axios.get(`${API_URL}/carrocerias/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      
      const carroceriaData = carroceriaResponse.data;
      setModelo(carroceriaData);
      setNomeModelo(carroceriaData.nome_modelo);

      // Carregar peças da carroceria
      const pecasResponse = await axios.get(`${API_URL}/carrocerias/${id}/pecas`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      
      if (pecasResponse.data.length > 0) {
        setPecas(pecasResponse.data.map((peca: any) => ({
          id_peca: peca.id_peca,
          nome_peca: peca.nome_peca,
          id_svg: peca.id_svg,
          id_pintura: peca.id_pintura || 1,
          id_carroceria: peca.id_carroceria,
          cor_atual: '',
          cor_inicial: ''
        })));
      }
      
    } catch (error) {
      console.error('Erro ao carregar dados do modelo:', error);
      mostrarErro('Erro', 'Erro ao carregar dados do modelo.');
    } finally {
      setCarregandoDados(false);
    }
  }, [id, mostrarErro]);

  useEffect(() => {
    if (id) {
      carregarDadosModelo();
    }
  }, [id, carregarDadosModelo]);

  const handleAddPeca = () => {
    setPecas(prev => [
      ...prev,
      { nome_peca: '', id_svg: '', id_pintura: 1, id_carroceria: Number(id) || 0, cor_atual: '', cor_inicial: '' }
    ]);
  };

  const handleVoltar = () => navigate('/gestao-modelos');

  const handlePecaChange = (index: number, nome?: string, idSVG?: string) => {
    setPecas(prev =>
      prev.map((p, i) =>
        i === index
          ? { ...p, nome_peca: nome ?? p.nome_peca, id_svg: idSVG ?? p.id_svg }
          : p
      )
    );
  };

  const handleDescartarPeca = (index: number) => {
    setPecas(prev => prev.filter((_, i) => i !== index));
  };

  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });

  const validateForm = (): boolean => {
    if (!nomeModelo.trim()) {
      mostrarModal({
        titulo: 'Campo Obrigatório',
        mensagem: 'Nome do modelo é obrigatório.',
        mostrarFechar: true,
        mostrarConfirmar: false,
        tipo: 'erro'
      });
      return false;
    }

    // Se está criando (não editando), SVGs são obrigatórios
    if (!isEdicao && (!lateralSVG || !traseiraSVG || !diagonalSVG)) {
      mostrarModal({
        titulo: 'Campos Obrigatórios',
        mensagem: 'Todos os arquivos SVG são obrigatórios para cadastro.',
        mostrarFechar: true,
        mostrarConfirmar: false,
        tipo: 'erro'
      });
      return false;
    }

    if (pecas.length === 0 || pecas.some(p => !p.nome_peca.trim() || !p.id_svg.trim())) {
      mostrarModal({
        titulo: 'Campos Obrigatórios',
        mensagem: 'Preencha todos os campos das peças.',
        mostrarFechar: true,
        mostrarConfirmar: false,
        tipo: 'erro'
      });
      return false;
    }

    return true;
  };

  const handleSalvar = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      let carroceriaId = Number(id);

      if (isEdicao) {
        // Atualizar modelo existente
        const dadosAtualizacao: any = {
          nome_modelo: nomeModelo.trim()
        };

        // Só incluir SVGs se foram alterados
        if (lateralSVG) {
          dadosAtualizacao.lateral_svg = await fileToBase64(lateralSVG);
        }
        if (traseiraSVG) {
          dadosAtualizacao.traseira_svg = await fileToBase64(traseiraSVG);
        }
        if (diagonalSVG) {
          dadosAtualizacao.diagonal_svg = await fileToBase64(diagonalSVG);
        }

        await axios.put(
          `${API_URL}/carrocerias/${id}`,
          dadosAtualizacao,
          {
            headers: token ? { Authorization: `Bearer ${token}` } : {}
          }
        );

        // Atualizar peças (deletar todas e recriar - solução simples)
        // Primeiro, buscar peças existentes e deletar
        const pecasExistentes = await axios.get(`${API_URL}/carrocerias/${id}/pecas`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });

        for (const pecaExistente of pecasExistentes.data) {
          await axios.delete(`${API_URL}/pecas/${pecaExistente.id_peca}`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {}
          });
        }

      } else {
        // Criar novo modelo
        const lateralStr = await fileToBase64(lateralSVG!);
        const traseiraStr = await fileToBase64(traseiraSVG!);
        const diagonalStr = await fileToBase64(diagonalSVG!);

        const carroceriaResp = await axios.post<{ carroceria: Carroceria }>(
          `${API_URL}/carrocerias`,
          {
            nome_modelo: nomeModelo.trim(),
            lateral_svg: lateralStr,
            traseira_svg: traseiraStr,
            diagonal_svg: diagonalStr
          },
          {
            headers: token ? { Authorization: `Bearer ${token}` } : {}
          }
        );
        
        carroceriaId = carroceriaResp.data.carroceria.id_carroceria!;
      }

      // Criar/Recriar todas as peças
      for (const peca of pecas) {
        await axios.post(
          `${API_URL}/pecas`,
          {
            nome_peca: peca.nome_peca.trim(),
            id_svg: peca.id_svg.trim(),
            id_carroceria: carroceriaId
          },
          {
            headers: token ? { Authorization: `Bearer ${token}` } : {}
          }
        );
      }

      mostrarSucesso('Sucesso', isEdicao ? 'Modelo atualizado com sucesso!' : 'Modelo de carroceria e peças salvos com sucesso!');
      
      setTimeout(() => {
        fecharModal();
        navigate('/gestao-modelos');
      }, 2000);
      
    } catch (error: any) {
      console.error('Erro ao salvar modelo:', error);
      
      if (error.response?.data?.error) {
        mostrarErro('Erro', error.response.data.error);
      } else {
        mostrarErro('Erro', 'Erro ao salvar modelo. Verifique os campos.');
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    nomeModelo,
    lateralSVG,
    traseiraSVG,
    diagonalSVG,
    modelo,
    pecas,
    loading,
    carregandoDados,
    isEdicao,
    setNomeModelo,
    setLateralSVG,
    setTraseiraSVG,
    setDiagonalSVG,
    handleAddPeca,
    handleVoltar,
    handlePecaChange,
    handleDescartarPeca,
    handleSalvar,
    modalProps
  };
};