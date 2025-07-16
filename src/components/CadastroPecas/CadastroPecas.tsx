import React, { useState } from "react";
import './cadastroPecas.css';
import InputGenerico from "../InputGenerico/InputGenerico";
import { CadastroPecasProps } from "../../types/types";
import Button from "../Button/Button";

const CadastroPecas: React.FC<CadastroPecasProps> = ({
  nomeModelo: nomeModeloInicial,
  idSVG: idSvgInicial
}) => {
  const [nomeModelo, setNomeModelo] = useState(nomeModeloInicial || '');
  const [idSVG, setIdSVG] = useState(idSvgInicial || '');

  const handleDescartar = () => {
    console.log("Peça descartada");
  };

  return (
    <div className="cadastro-pecas">
      <div className="inputs-linha">
        <InputGenerico
          titulo="Nome do Modelo:"
          placeholder="Ex: Cabine"
          valor={nomeModelo}
          onChange={setNomeModelo}
        />

        <InputGenerico
          titulo="Id nos arquivos SVG:"
          placeholder="Ex: Cabine"
          valor={idSVG}
          onChange={setIdSVG}
        />
      </div>

      <Button
        texto="Descartar"
        onClick={handleDescartar}
        cor="danger"   
        className="botao-descartar"
      />
    </div>
  );
};

export default CadastroPecas;



