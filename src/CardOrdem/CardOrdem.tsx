import React, { useState, useEffect } from 'react';
import Button from '../components/Button/Button';
import { CardOrdemProps } from '../types/types';
import axios from 'axios';

type Status =
  | 'Em produção'
  | 'Pendente'
  | 'Finalizado'
  | 'Cancelado';

const statusToBootstrap: Record<Status, string> = {
  'Em produção': 'primary',
  'Pendente': 'warning',
  'Finalizado': 'success',
  'Cancelado': 'danger'
};

const CardOrdem: React.FC<CardOrdemProps> = ({
  id_ordem_servico,
  identificacao_veiculo,
  status,
  nome_cliente,
  data_entrega,
  id_pintura,
  onAlterarPrioridade,
  onAlterarStatus
}) => {
  const [svgString, setSvgString] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const corBadge = statusToBootstrap[status as Status] || 'secondary';

  // Função para buscar o SVG da pintura do backend
  useEffect(() => {
    if (id_pintura) {
      buscarSvgPintura();
    }
  }, [id_pintura]);

  const buscarSvgPintura = async () => {
    if (!id_pintura) return;

    setLoading(true);
    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3333';
      const token = localStorage.getItem('token');
      
      // Busca o SVG lateral da pintura
      const response = await axios.get(
        `${API_URL}/pintura/${id_pintura}/svg/lateral`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.data.svg) {
        setSvgString(response.data.svg);
      }
    } catch (error) {
      console.error('Erro ao buscar SVG da pintura:', error);
      // SVG de fallback
      setSvgString(`
        <svg width="250" height="180" viewBox="0 0 250 180" xmlns="http://www.w3.org/2000/svg">
          <rect width="100%" height="100%" fill="#f8f9fa" stroke="#dee2e6" stroke-width="2"/>
          <text x="50%" y="50%" text-anchor="middle" fill="#6c757d" font-size="14">
            Imagem não disponível
          </text>
        </svg>
      `);
    } finally {
      setLoading(false);
    }
  };

  const handleAlterarPrioridade = () => {
    if (onAlterarPrioridade) {
      onAlterarPrioridade(id_ordem_servico);
    }
  };

  const handleAlterarStatus = () => {
    if (onAlterarStatus) {
      onAlterarStatus(id_ordem_servico);
    }
  };

  return (
    <div 
      className="card shadow-sm mb-4 mx-3" 
      style={{ 
        width: '25%', 
        minWidth: '300px',
        backgroundColor: '#ffffff' 
      }}
    >
      {/* Cabeçalho com fundo bege */}
      <div 
        className="card-header d-flex justify-content-between align-items-center py-3"
        style={{ backgroundColor: 'rgba(213, 192, 160, 1)' }}
      >
        <h6 className="mb-0 fw-semibold text-dark">
          <i className="bi bi-file-earmark-text me-2"></i>
          Ordem de Serviço ID: {id_ordem_servico}
        </h6>
        <span 
          className={`badge rounded-pill text-bg-${corBadge}`}
          style={{ padding: '10px 15px', fontSize: '14px' }}
        >
          {status}
        </span>
      </div>

      {/* Corpo do card */}
      <div className="card-body p-4">
        <div className="row align-items-start mb-3">
          {/* Informações à esquerda */}
          <div className="col-md-6">
            <div className="d-flex flex-column gap-2">
              <span className="text-secondary" style={{ fontSize: '0.95rem' }}>
                <strong>Nome:</strong> {nome_cliente}
              </span>
              <span className="text-secondary" style={{ fontSize: '0.95rem' }}>
                <strong>Entrega:</strong> {data_entrega}
              </span>
              <span className="text-secondary" style={{ fontSize: '0.95rem' }}>
                <strong>Status:</strong> {status}
              </span>
              <span className="text-secondary" style={{ fontSize: '0.95rem' }}>
                <strong>Veículo:</strong> {identificacao_veiculo}
              </span>
            </div>
          </div>

          {/* SVG à direita */}
          <div className="col-md-6 text-end">
            {loading ? (
              <div 
                className="d-flex justify-content-center align-items-center bg-light border rounded"
                style={{ 
                  width: '100%', 
                  maxWidth: '250px',
                  height: '180px'
                }}
              >
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Carregando...</span>
                </div>
              </div>
            ) : (
              <div 
                className="border rounded p-2"
                style={{ 
                  width: '100%', 
                  maxWidth: '250px',
                  height: '180px',
                  display: 'inline-block',
                  backgroundColor: '#f8f9fa'
                }}
                dangerouslySetInnerHTML={{ __html: svgString }}
              />
            )}
          </div>
        </div>

        {/* Botões centralizados */}
        <div className="d-flex justify-content-center gap-4 pt-2">
          <Button
            tipo="button"
            texto="Alterar Prioridade"
            icone={<i className="bi bi-list"></i>}
            cor="primary"
            onClick={handleAlterarPrioridade}
          />
          <Button
            tipo="button"
            texto="Alterar Status"
            icone={<i className="bi bi-clock"></i>}
            cor="primary"
            onClick={handleAlterarStatus}
          />
        </div>
      </div>
    </div>
  );
};

export default CardOrdem;