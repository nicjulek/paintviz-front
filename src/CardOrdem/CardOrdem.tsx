import React from 'react';
import './cardordem.css';
import Button from '../components/Button/Button';
import { CardOrdemProps } from '../types/types';

const CardOrdem: React.FC<CardOrdemProps> = ({
    idordem,
    status,
    nome,
    entrega,
    imgpintura
}) => {

  return (
  <div className="card shadow-sm p-3 mb-4">
    <div className="d-flex justify-content-between align-items-center mb-3">
      <h5 className="mb-0">{idordem}</h5>
      <span className="card-status">{status}</span>
    </div>

    <div className="d-flex justify-content-between mb-3">
      <div className="d-flex flex-column gap-1">
        <span><strong>Cliente:</strong> {nome}</span>
        <span><strong>Entrega:</strong> {entrega}</span>
      </div>
      <img
        src={imgpintura}
        alt="Imagem"
        className="img-thumbnail card-imagem"
      />
    </div>

    <div className="d-flex justify-content-end gap-2">
      <Button
        tipo="button"
        texto="Alterar Status"
        icone={<i className="bi bi-clock"></i>}
        cor="primary"
        onClick={() => console.log('Voltar')}
      />
      <Button
        tipo="button"
        texto="Alterar Prioridade"
        icone={<i className="bi bi-list"></i>}
        cor="primary"
      />
    </div>
  </div>
);
};


export default CardOrdem;