import React from 'react';
import './cardordem.css';
import Button from '../components/Button/Button';
import { CardOrdemProps } from '../types/types';

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
  idordem,
  status,
  nome,
  entrega,
  imgpintura
}) => {
  const corBadge = statusToBootstrap[status as Status]; 

  return (
    <div className="ordem-card shadow-sm mb-4 rounded bg-white">
      <div className="ordem-topo d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0 ordem-titulo">
          <i className="bi bi-file-earmark-text me-2"></i>
          Ordem de Serviço ID: {idordem}
        </h5>
        <span className={`badge rounded-pill text-bg-${corBadge}`}>
          {status}
        </span>
      </div>

      <div className="ordem-corpo d-flex justify-content-between align-items-start mb-3 flex-wrap">
        <div className="d-flex flex-column gap-1 ordem-infos">
          <span><strong>Nome:</strong> {nome}</span>
          <span><strong>Entrega:</strong> {entrega}</span>
        </div>
        <img
          src={imgpintura}
          alt="Imagem da carroceria"
          className="img-thumbnail ordem-img"
        />
      </div>

      <div className=" card-botoes ">
        <Button
          tipo="button"
          texto="Alterar Prioridade"
          icone={<i className="bi bi-list"></i>}
          cor="primary"
        />
        <Button
          tipo="button"
          texto="Alterar Status"
          icone={<i className="bi bi-clock"></i>}
          cor="primary"
          onClick={() => console.log('Alterar status')}
        />
      </div>
    </div>
  );
};

export default CardOrdem;
