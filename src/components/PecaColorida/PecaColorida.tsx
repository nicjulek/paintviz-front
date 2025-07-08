import React, { useState } from 'react';
import './pecaColorida.css';
import { PecaColoridaProps } from '../../types/types';

const PecaColorida: React.FC<PecaColoridaProps> = ({
  nomePeca,
  corQuadrado,
  corSelecionada,
  onCorChange,
}) => {
  const [editando, setEditando] = useState<boolean>(false);

  const handleIconeClick = () => {
    setEditando(true);
  };

  const handleBlur = () => {
    setEditando(false); // desativa edição quando perde o foco
  };

  return (
    <div className="peca-container">
      <div
        className="cor-visual"
        style={{ backgroundColor: corQuadrado }}
      ></div>
      <span className="nome-peca">{nomePeca}</span>
      <input
        className="input-cor"
        type="text"
        value={corSelecionada}
        onChange={(e) => onCorChange(e.target.value)}
        disabled={!editando}
        onBlur={handleBlur}
      />
      <span className="icone-editar" onClick={handleIconeClick}>
        ✎
      </span>
    </div>
  );
};

export default PecaColorida;