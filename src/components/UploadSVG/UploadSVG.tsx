import React, { useState } from 'react';
import { UploadSVGProps } from '../../types/types';
import SvgRenderer from '../SvgRenderer';

interface UploadSVGComOnChangeProps extends UploadSVGProps {
  onChange?: (file: File | null) => void; 
}

const UploadSVG: React.FC<UploadSVGComOnChangeProps> = ({ titulo, onChange }) => {
  const [svgString, setSvgString] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSvgString(file ? '' : null); 

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const conteudo = reader.result as string;
        setSvgString(conteudo);
      };
      reader.readAsText(file);
    }

    if (onChange) {
      onChange(file); 
    }
  };

  return (
    <div className="upload-svg-card">
      <small className="file-name">{titulo}.svg</small>
      <small className="instruction">Clique para enviar</small>
      <input type="file" accept=".svg" className="file-input" onChange={handleFileUpload} />

      {svgString && (
        <div className="svg-preview">
          <SvgRenderer svgString={svgString} style={{ width: "100%", height: "auto" }} />
        </div>
      )}
    </div>
  );
};

export default UploadSVG;