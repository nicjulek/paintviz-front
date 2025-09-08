import React, { useState } from 'react';
import InputGenerico from '../components/InputGenerico/InputGenerico';
import CadastroPecas from '../components/CadastroPecas/CadastroPecas';
import UploadSVG from '../components/UploadSVG/UploadSVG';
import Button from '../components/Button/Button';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Peca, Carroceria } from '../types/types';

const CadastroModelos = () => {
  const [nomeModelo, setNomeModelo] = useState('');
  const [lateralSVG, setLateralSVG] = useState<File | null>(null);
  const [traseiraSVG, setTraseiraSVG] = useState<File | null>(null);
  const [diagonalSVG, setDiagonalSVG] = useState<File | null>(null);
  const [pecas, setPecas] = useState<Peca[]>([
    { nome_peca: '', id_svg: '', id_pintura: 0, id_carroceria: 0 }
  ]);

  const navigate = useNavigate();

  const handleAddPeca = () => {
    setPecas(prev => [
      ...prev,
      { nome_peca: '', id_svg: '', id_pintura: 0, id_carroceria: 0 }
    ]);
  };

  const handleVoltar = () => navigate('/gestao-modelos');

  const handlePecaChange = (index: number, nome?: string, idSVG?: string) => {
    setPecas(prev =>
      prev.map((p, i) =>
        i === index
          ? { ...p, nome_peca: nome ?? p.nome_peca, id_svg: idSVG ?? p.id_svg }
          : p
      )
    );
  };

  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });

  const handleSalvar = async () => {
    try {
      const lateralStr = lateralSVG ? await fileToBase64(lateralSVG) : null;
      const traseiraStr = traseiraSVG ? await fileToBase64(traseiraSVG) : null;
      const diagonalStr = diagonalSVG ? await fileToBase64(diagonalSVG) : null;

      const carroceriaResp = await axios.post<{ carroceria: Carroceria }>(
        '/carrocerias',
        {
          nome_modelo: nomeModelo,
          lateral_svg: lateralStr,
          traseira_svg: traseiraStr,
          diagonal_svg: diagonalStr
        }
      );
      const carroceriaId = carroceriaResp.data.carroceria.id_carroceria!;

      for (const peca of pecas) {
        if (!peca.nome_peca || !peca.id_svg) continue;
        await axios.post('/pecas', {
          ...peca,
          id_carroceria: carroceriaId
        });
      }

      alert('Modelo de carroceria e peças salvos com sucesso!');
      navigate('/gestao-modelos');
    } catch (error) {
      console.error(error);
      alert('Erro ao salvar modelo. Verifique os campos.');
    }
  };

  return (
    <div className="page-container">
 
      <div className="section-card">
        <div className="card-body">
          <h4 className="section-title">Cadastro de Modelo de Carroceria</h4>
          <div className="form-group">
            <InputGenerico
              titulo="Nome do Modelo:"
              placeholder="Nome do modelo da carroceria"
              valor={nomeModelo}
              onChange={setNomeModelo}
            />
          </div>
          <div className="upload-section">
            <h5 className="subsection-title">Arquivos SVG</h5>
            <div className="upload-grid">
              <UploadSVG titulo="Lateral" onChange={setLateralSVG} />
              <UploadSVG titulo="Traseira" onChange={setTraseiraSVG} />
              <UploadSVG titulo="Diagonal" onChange={setDiagonalSVG} />
            </div>
          </div>
        </div>
      </div>

      <div className="section-card">
        <div className="card-body">
          <h4 className="section-title">Cadastro das peças</h4>
          {pecas.map((peca, index) => (
            <CadastroPecas
              key={index}
              nomeModelo={peca.nome_peca}
              idSVG={peca.id_svg}
              onChangeNome={nome => handlePecaChange(index, nome)}
              onChangeIdSVG={idSVG => handlePecaChange(index, undefined, idSVG)}
            />
          ))}

          <div className="button-add-container">
            <Button
              cor="primary"
              texto="Adicionar mais peças"
              onClick={handleAddPeca}
            />
          </div>
        </div>
      </div>

      <div className="button-footer">
        <Button
          cor="secondary"
          texto="Voltar"
          className="btn-margin-right"
          onClick={handleVoltar}
        />
        <Button cor="success" texto="Salvar" onClick={handleSalvar} />
      </div>
    </div>
  );
};

export default CadastroModelos;
