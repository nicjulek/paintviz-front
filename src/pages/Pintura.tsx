import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import '../App.css';
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import { User } from "../types/types";
//import FormularioOrdem from "../components/FormularioOrdem/FormularioOrdem";
//import FormularioCliente from "../components/FormularioCliente/FormularioCliente";

// import axios from "axios";

// const testeUser: User | null = null;

// Teste para header
const testeUser: User = {
  name: "João",
  role: "admin" 
};

// const testeHello = async () => {
//   await axios.get(`${process.env.REACT_APP_API_URL}/hello-world`)
// }

const Pintura: React.FC = () => {
  // console.log(testeHello());
  return (
    <div className="d-flex flex-column min-vh-100">
      <Header user={testeUser} />
      <main className="flex-grow-1">
        { }
      </main>
      <Footer />
    </div>
  );
};

export default Pintura;