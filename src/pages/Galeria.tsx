import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import '../App.css';
import CardOrdem from "../CardOrdem/CardOrdem";
import { CardOrdemProps } from '../types/types';

const ordemExemplo: CardOrdemProps = {
  idordem: 1,
  status: "Finalizado",
  nome: "João da Silva",
  entrega: "2025-08-05",
  imgpintura: "https://via.placeholder.com/150",
};

const Galeria: React.FC = () => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <main className="flex-grow-1">
        <CardOrdem {...ordemExemplo} />
      </main>
    </div>
  );
};

export default Galeria;
