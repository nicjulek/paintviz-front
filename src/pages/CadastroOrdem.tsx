import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import '../App.css';
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import { CardOrdemProps, User } from "../types/types";
import FormularioOrdem from "../components/FormularioOrdem/FormularioOrdem";


const testeUser: User = {
  name: "João",
  role: "admin" 
};

const Ordem: React.FC = () => {
  
  return (
    <div className="d-flex flex-column min-vh-100">
      <Header user={testeUser} />
      <main className="flex-grow-1">
       <FormularioOrdem />
      </main>
      <Footer />
    </div>
  );
};

export default Ordem;