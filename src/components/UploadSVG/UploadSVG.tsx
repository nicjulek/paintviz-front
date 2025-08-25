import React from 'react';
import { UploadSVGProps } from '../../types/types';


const UploadSVG = ({ titulo }: UploadSVGProps) => {
  return (
    <div className="upload-svg-card">
      <small className="file-name">{titulo}.svg</small>
      <small className="instruction">Clique para enviar</small>
      <input type="file" accept=".svg" className="file-input" />
    </div>
  );
};

export default UploadSVG;