import React from 'react';
import './App.css';

type ButtonType = {
    texto: string;
    onClick?: () => void;
    tipo?: 'button' | 'submit' | 'reset';
    cor?: string; 
    tamanho?: 'sm' | 'lg'; 
    desabilitado?: boolean;
    icone?: React.ReactNode; 
}

const Botao: React.FC<ButtonType> = ({
  texto,
  onClick,
  tipo = 'button',
  cor = 'primary',
  tamanho,
  desabilitado = false,
  icone
}) => {
  return (
    <button
      type={tipo}
      className={`btn btn-${cor} ${tamanho ? `btn-${tamanho}` : ''}`}
      onClick={onClick}
      disabled={desabilitado}
    >
      {icone && <span className="me-2">{icone}</span>}
      {texto}
    </button>
  );
};

export default Botao;