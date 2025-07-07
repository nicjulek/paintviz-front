import React from "react";
import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";

//Teste para header
const testeUser = {
  name: 'João Silva',
  role: 'admin' as const //user | admin
};

function App() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Header user={testeUser} />
      <main className="flex-grow-1">
        { }
      </main>
      <Footer />
    </div>
  );
}

export default App;