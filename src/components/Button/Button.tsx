import React from 'react';
import { ButtonProps } from '../../types/types';
import './button.css';

const Button: React.FC<ButtonProps> = ({
  texto,
  onClick,
  tipo = 'button',
  cor = 'primary',
  tamanho,
  desabilitado = false,
  icone,
  className = ''
}) => {
  const baseClasses = `btn btn-${cor}`;
  const sizeClass = tamanho ? `btn-${tamanho}` : '';
  const finalClasses = `${baseClasses} ${sizeClass} ${className}`.trim();

  return (
    <button
      type={tipo}
      className={finalClasses}
      onClick={onClick}
      disabled={desabilitado}
      aria-label={texto}
    >
      {icone && <span className="me-2">{icone}</span>}
      {texto}
    </button>
  );
};

export default Button;