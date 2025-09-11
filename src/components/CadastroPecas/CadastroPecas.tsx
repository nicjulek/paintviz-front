import React, { useState } from "react";
import './cadastroPecas.css';
import { CadastroPecasProps } from "../../types/types";
import Button from "../Button/Button";

const CadastroPecas: React.FC<CadastroPecasProps> = ({
  nomeModelo: nomeModeloInicial,
  idSVG: idSvgInicial,
  onChangeNome,
  onChangeIdSVG,
  onDescartar
}) => {
  const [nomeModelo, setNomeModelo] = useState(nomeModeloInicial || '');
  const [idSVG, setIdSVG] = useState(idSvgInicial || '');

  // Atualiza o valor no componente pai
  const handleNomeChange = (valor: string) => {
    setNomeModelo(valor);
    if (onChangeNome) onChangeNome(valor);
  };
  const handleIdSVGChange = (valor: string) => {
    setIdSVG(valor);
    if (onChangeIdSVG) onChangeIdSVG(valor);
  };

  return (
    <div
      className="cadastro-pecas"
      style={{
        background: '#e5e5e5',
        borderRadius: '10px',
        border: '1.5px solid #8B6B3A',
        boxShadow: '0 1px 4px #0001',
        padding: '1rem',
        marginBottom: '1rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        maxWidth: '1250px',
        marginLeft: 'auto',
        marginRight: 'auto'
      }}
    >
      <div className="inputs-linha" style={{ flex: 1, display: 'flex', gap: '1rem' }}>
        <div style={{ flex: 1 }}>
          <label className="fw-bold" style={{ color: '#4B3A1A', fontSize: '1rem' }}>
            Nome da Peça: <span style={{ color: '#c00' }}>*</span>
          </label>
          <input
            type="text"
            className="form-control"
            placeholder="Ex: Cabine"
            value={nomeModelo}
            onChange={e => handleNomeChange(e.target.value)}
            style={{
              borderRadius: '8px',
              border: '1.5px solid #8B6B3A',
              marginTop: '0.25rem'
            }}
          />
        </div>
        <div style={{ flex: 1 }}>
          <label className="fw-bold" style={{ color: '#4B3A1A', fontSize: '1rem' }}>
            Id nos arquivos SVG: <span style={{ color: '#c00' }}>*</span>
          </label>
          <input
            type="text"
            className="form-control"
            placeholder="Ex: cabine"
            value={idSVG}
            onChange={e => handleIdSVGChange(e.target.value)}
            style={{
              borderRadius: '8px',
              border: '1.5px solid #8B6B3A',
              marginTop: '0.25rem'
            }}
          />
        </div>
      </div>
      <Button
        texto="Descartar"
        onClick={onDescartar}
        cor="danger"
        className="botao-descartar"
      />
    </div>
  );
};

export default CadastroPecas;