import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import '../App.css';
import FormularioOrdem from "../components/FormularioOrdem/FormularioOrdem";

const CadastroOrdem: React.FC = () => {
  
  return (
    <div className="d-flex flex-column min-vh-100">
      <main className="flex-grow-1">
       <FormularioOrdem />
      </main>
    </div>
  );
};

export default CadastroOrdem;