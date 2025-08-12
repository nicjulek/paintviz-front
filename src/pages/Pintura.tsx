import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import '../App.css';
import { Carroceria, Peca, UsuarioAutenticado, Cor, Paleta } from "../types/types";
import ColorPicker from "../components/ColorPicker/ColorPicker";
import axios from "axios";

const Pintura: React.FC = () => {
  const [user, setUser] = useState<UsuarioAutenticado | null>(null);
  const [carrocerias, setCarrocerias] = useState<Carroceria[]>([]);
  const [carroceriaSelecionada, setCarroceriaSelecionada] = useState<Carroceria | null>(null);
  const [pecas, setPecas] = useState<Peca[]>([]);
  const [pecaSelecionada, setPecaSelecionada] = useState<string | null>(null);
  const [coresAplicadas, setCoresAplicadas] = useState<{ [key: string]: number }>({});
  const [tipoVisualizacao, setTipoVisualizacao] = useState<'lateral' | 'traseira' | 'diagonal'>('lateral');
  const [cores, setCores] = useState<Cor[]>([]);
  const [paletas, setPaletas] = useState<Paleta[]>([]);
  const [paletaSelecionada, setPaletaSelecionada] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3333';

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      setLoading(true);
      setError('');

      const [carroceriasRes, paletasRes] = await Promise.all([
        axios.get(`${API_URL}/carrocerias`, getAuthHeaders()),
        axios.get(`${API_URL}/paletas`, getAuthHeaders())
      ]); 

      const carroceriasData: Carroceria[] = carroceriasRes.data;
      const paletasData: Paleta[] = paletasRes.data;

      setCarrocerias(carroceriasData);
      setPaletas(paletasData);

      if (carroceriasData.length > 0) {
        await selecionarCarroceria(carroceriasData[0]);
      }
      
      if (paletasData.length > 0) {
        await selecionarPaleta(paletasData[0].id_paleta!);
      }
      
    } catch (error: any) {
      console.error('Erro ao carregar dados:', error);
      if (error.response?.status === 401) {
        setError('Sessão expirada. Faça login novamente.');
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        window.location.href = '/login';
      } else {
        setError('Erro ao carregar dados do servidor.');
      }
    } finally {
      setLoading(false);
    }
  }

  const selecionarCarroceria = async (carroceria: Carroceria) => {
    try {
      setLoading(true);
      setError('');
      setCarroceriaSelecionada(carroceria);
      
      // carregar peças da carroceria
      const response = await axios.get(
        `${API_URL}/carrocerias/${carroceria.id_carroceria}/pecas`, 
        getAuthHeaders()
      );
      
      const pecasData: Peca[] = response.data;
      setPecas(pecasData);
      
      // resetar cores aplicadas
      setCoresAplicadas({});
      setPecaSelecionada(null);
      
    } catch (error: any) {
      console.error('Erro ao carregar peças:', error);
      if (error.response?.status === 404) {
        setError('Peças não encontradas para esta carroceria.');
        setPecas([]);
      } else {
        setError('Erro ao carregar peças da carroceria.');
      }
    } finally {
      setLoading(false);
    }
  }

  const selecionarPaleta = async (id_paleta: number) => {
    try {
      setPaletaSelecionada(id_paleta);
      
      // carregar cores da paleta
      const response = await axios.get(
        `${API_URL}/paletas/${id_paleta}/cores`, 
        getAuthHeaders()
      );
      
      const coresData: Cor[] = response.data;
      setCores(coresData);
      
    } catch (error: any) {
      console.error('Erro ao carregar cores da paleta:', error);
      setError('Erro ao carregar cores da paleta.');
    }
  }

  const handlePecaClick = (id_peca: string) => {
    setPecaSelecionada(id_peca);
    console.log('Peça selecionada:', id_peca);
  }

  const handleColorChange = (id_cor: number) => {
     if (pecaSelecionada) {
      setCoresAplicadas(prev => ({
        ...prev,
        [pecaSelecionada]: id_cor
      }));

      console.log(`Cor ${id_cor} aplicada na peça ${pecaSelecionada}`);
    }
  }

  const getCorHex = (id_cor: number): string => {
    const cor = cores.find(c => c.id_cor === id_cor);
    return cor ? cor.cod_cor : '#000000';
  }

  const aplicarCoresNoSvg = (svg: string, coresAplicadas: { [key: string]: number }): string => {

  }

  const criarPecasNoBanco = async (pinturaId: number) => {

  }

  const handleSalvar = async () => {

  }

  const handleDescartar = () => {
    setCoresAplicadas({});
    setPecaSelecionada(null);
    console.log('Cores descartadas');
  }

  const getSvgAtual = (): string => {
    if (!carroceriaSelecionada) return '';
    
    switch (tipoVisualizacao) {
      case 'lateral':
        return carroceriaSelecionada.lateral_svg || '';
      case 'traseira':
        return carroceriaSelecionada.traseira_svg || '';
      case 'diagonal':
        return carroceriaSelecionada.diagonal_svg || '';
      default:
        return '';
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <main className="flex-grow-1">
       {ColorPicker()}
      </main>
    </div>
  );


};

export default Pintura;