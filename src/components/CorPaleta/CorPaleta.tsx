import React from 'react';
import './corPaleta.css';
import { CorPaletaProps } from '../../types/types';

const CorPaleta: React.FC<CorPaletaProps> = ({
  corQuadrado
}) => {

  return (
      <div
        className="cor-visual"
        style={{ backgroundColor: corQuadrado }}
      ></div>  
  );
};

export default CorPaleta;