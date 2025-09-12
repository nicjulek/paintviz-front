import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface CardOrdemProps {
  id_ordem_servico: number;
  placa_veiculo: string;
  status: number | string;
  nome_cliente: string;
  data_entrega: string;
  id_pintura: number;
  onAlterarStatus?: () => void;
  onAlterarPrioridade?: () => void;
  alterando?: boolean;
}

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3333';

const statusColorMap: Record<string, string> = {
  'Pré-Ordem': '#757575',
  'Aberta': '#fbc02d',
  'Em produção': '#1976d2',
  'Finalizada': '#43a047',
  'Cancelada': '#d32f2f'
};

function formatarData(dataIso: string) {
  if (!dataIso) return "";
  const d = new Date(dataIso);
  if (isNaN(d.getTime())) return "";
  const dia = String(d.getDate()).padStart(2, '0');
  const mes = String(d.getMonth() + 1).padStart(2, '0');
  const ano = d.getFullYear();
  return `${dia}/${mes}/${ano}`;
}

const CardOrdem: React.FC<CardOrdemProps> = ({
  id_ordem_servico,
  placa_veiculo,
  status,
  nome_cliente,
  data_entrega,
  id_pintura,
  onAlterarStatus,
  onAlterarPrioridade,
  alterando
}) => {
  const [svgString, setSvgString] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [statusNome, setStatusNome] = useState<string>('');

  const navigate = useNavigate();

  useEffect(() => {
    setStatusNome(String(status));
  }, [status]);

  useEffect(() => {
    if (id_pintura) {
      buscarSvgPintura();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id_pintura]);

  const buscarSvgPintura = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${API_URL}/pinturas/${id_pintura}/svg/lateral`
      );
      setSvgString(response.data.svg || '');
    } catch (error) {
      setSvgString(`
        <svg width="240" height="120" xmlns="http://www.w3.org/2000/svg">
          <rect width="100%" height="100%" fill="#f8f9fa" stroke="#dee2e6" stroke-width="2"/>
          <text x="50%" y="50%" text-anchor="middle" fill="#6c757d" font-size="16">
            Imagem não disponível
          </text>
        </svg>
      `);
    } finally {
      setLoading(false);
    }
  };

  const handleClick = () => {
    navigate(`/ordem/${id_ordem_servico}`);
  };

  const badgeColor = statusColorMap[statusNome] || '#757575';

  // Se status for pré-ordem (id_status === 1), não mostrar data de entrega
  const isPreOrdem = String(status) === "1" || String(statusNome).toLowerCase().includes("pré-ordem");

  return (
    <div
      className="card shadow-sm mb-4 card-ordem-hover"
      style={{
        width: '400px',
        minWidth: '280px',
        backgroundColor: '#ffffff',
        cursor: 'pointer',
        transition: 'box-shadow 0.2s, transform 0.2s',
        borderRadius: '1rem' 
      }}
      onClick={handleClick}
      tabIndex={0}
      onKeyDown={e => { if (e.key === 'Enter') handleClick(); }}
    >
      <div
        className="card-header d-flex justify-content-between align-items-center py-3"
        style={{
          backgroundColor: 'rgba(213, 192, 160, 1)',
          borderTopLeftRadius: '1rem',
          borderTopRightRadius: '1rem',
          borderBottomLeftRadius: '0',
          borderBottomRightRadius: '0'
        }}
      >
        <h6 className="mb-0 fw-semibold text-dark" style={{ fontSize: '1.07rem' }}>
          <i className="bi bi-file-earmark-text me-2"></i>
          Ordem de Serviço ID: {id_ordem_servico}
        </h6>
        <span
          className="badge rounded-pill"
          style={{
            padding: '8px 16px',
            fontSize: '1rem',
            backgroundColor: badgeColor,
            color: '#fff'
          }}
        >
          {statusNome}
        </span>
      </div>
      <div className="card-body p-4">
        <div className="row align-items-start mb-3">
          <div className="col-6">
            <div className="d-flex flex-column gap-2">
              <span className="text-secondary" style={{ fontSize: '1rem' }}>
                <strong>Nome:</strong> {nome_cliente}
              </span>
              {!isPreOrdem && (
                <span className="text-secondary" style={{ fontSize: '1rem' }}>
                  <strong>Entrega:</strong> {formatarData(data_entrega)}
                </span>
              )}
              <span className="text-secondary" style={{ fontSize: '1rem' }}>
                <strong>Placa:</strong> {placa_veiculo}
              </span>
            </div>
          </div>
          <div className="col-6 d-flex align-items-center justify-content-center">
            <div
              className="border rounded bg-light"
              style={{
                width: '240px',
                height: '120px',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0'
              }}
            >
              {loading ? (
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Carregando...</span>
                </div>
              ) : (
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  dangerouslySetInnerHTML={{ __html: svgString }}
                />
              )}
            </div>
          </div>
        </div>
        <div className="d-flex gap-2 justify-content-center mt-3">
          <button
            className="btn btn-primary btn-sm d-flex align-items-center"
            onClick={e => { e.stopPropagation(); if (onAlterarStatus) onAlterarStatus(); }}
            disabled={alterando}
          >
            <i className="bi bi-arrow-repeat me-2"></i>
            Alterar Status
          </button>
          <button
            className="btn btn-primary btn-sm d-flex align-items-center"
            onClick={e => { e.stopPropagation(); if (onAlterarPrioridade) onAlterarPrioridade(); }}
            disabled={alterando}
          >
            <i className="bi bi-calendar2-week me-2"></i>
            Alterar Prioridade
          </button>
        </div>
      </div>
    </div>
  );
};

export default CardOrdem;