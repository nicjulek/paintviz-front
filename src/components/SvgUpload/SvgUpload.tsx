import React from 'react';
import { SvgUploadProps } from '../../types/types';

const getSvgBoxStyle = (hasFile: boolean) => ({
  background: hasFile ? '#e6ffe6' : '#fff',
  border: hasFile ? '2px solid #2ecc40' : '2px dashed #8B6B3A',
  borderRadius: '18px',
  minWidth: 300,
  minHeight: 200,
  maxWidth: 400,
  boxShadow: hasFile ? '0 2px 16px #2ecc4033' : '0 2px 12px #0001',
  display: 'flex',
  flexDirection: 'column' as const,
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  transition: 'box-shadow 0.2s, background 0.2s, border 0.2s',
  margin: '0 auto',
  position: 'relative' as const
});

const svgIconStyle = {
  fontSize: '2.5rem',
  color: '#6d4c1c',
  marginBottom: '0.5rem'
};

const svgLabelStyle = {
  color: '#6d4c1c',
  fontWeight: 500,
  fontSize: '1.07rem'
};

const svgHintStyle = {
  color: '#8B6B3A',
  fontSize: '0.95rem'
};

const SvgUpload: React.FC<SvgUploadProps> = ({ id, label, file, onFileChange, disabled }) => {
  return (
    <label style={getSvgBoxStyle(!!file) as React.CSSProperties} htmlFor={id}>
      <i className="bi bi-cloud-upload" style={svgIconStyle}></i>
      <div style={svgLabelStyle}>{label} (.svg)</div>
      <div style={svgHintStyle}>Clique para enviar</div>
      {file && (
        <span
          style={{
            position: 'absolute',
            top: 12,
            right: 18,
            background: '#2ecc40',
            color: '#fff',
            borderRadius: '50%',
            width: 28,
            height: 28,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            fontSize: '1.2rem',
            boxShadow: '0 1px 6px #2ecc4044'
          }}
          title="Arquivo selecionado"
        >
          <i className="bi bi-check-lg"></i>
        </span>
      )}
      <input
        id={id}
        type="file"
        accept=".svg"
        style={{ display: 'none' }}
        disabled={disabled}
        onChange={e => onFileChange(e.target.files?.[0] || null)}
      />
    </label>
  );
};

export default SvgUpload;