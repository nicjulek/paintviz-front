import React from 'react';
import { Item } from '../../types/types';

interface CardInfoProps {
  titulo: string;
  informacoes: Item[];
}

const CardInfo: React.FC<CardInfoProps> = ({ titulo, informacoes }) => {
return (
    <div className="card p-3 rounded shadow-sm mb-4 bg-white">
      <h5 className="mb-3">{titulo}</h5>
      <div className="row">
        {informacoes.slice(0, 4).map((info, index) => (
          <div className="col-md-6 mb-2" key={index}>
            <small className="text-muted">{info.label}</small>
            <div className="fw-semibold">{info.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CardInfo;