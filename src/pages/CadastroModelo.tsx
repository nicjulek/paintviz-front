import React, { useState } from 'react';
import InputGenerico from '../components/InputGenerico/InputGenerico';
import CadastroPecas from '../components/CadastroPecas/CadastroPecas';
import UploadSVG from '../components/UploadSVG/UploadSVG';
import Button from '../components/Button/Button';

const ModeloProdutos = () => {
  const [pecas, setPecas] = useState([{ id: 1 }]);

  const handleAddPeca = () => {
    setPecas(prevPecas => [...prevPecas, { id: prevPecas.length + 1 }]);
  };

  return (
    <div className="page-container">
      <div className="section-card">
        <div className="card-body">
          <h4 className="section-title">Cadastro de Modelo de Carroceria</h4>
          <div className="form-group">
            <InputGenerico titulo="Nome do Modelo:" placeholder="Nome do modelo da carroceria" />
          </div>
          <div className="upload-section">
            <h5 className="subsection-title">Arquivos SVG</h5>
            <div className="upload-grid">
              <UploadSVG titulo="Lateral" />
              <UploadSVG titulo="Traseira" />
              <UploadSVG titulo="Diagonal" />
            </div>
          </div>
        </div>
      </div>
      <div className="section-card">
        <div className="card-body">
          <h4 className="section-title">Cadastro das peças</h4>
          {pecas.map(peca => (
            <CadastroPecas key={peca.id} />
          ))}

          <div className="button-add-container">
            <Button
              cor="primary"
              texto="Adicionar mais cores"
              onClick={handleAddPeca}
            />
          </div>
        </div>
      </div>
      <div className="button-footer">
        <Button 
        cor="secondary" 
        texto="Voltar" 
        className="btn-margin-right" />
        <Button 
        cor="success" 
        texto="Salvar" />
      </div>
    </div>
  );
};

export default ModeloProdutos;