import React, { useRef, useState } from "react";
import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import FabricCanvas from "./components/FabricCanvas";

function App() {
  const fabricRef = useRef<any>(null);
  const [trailerColor, setTrailerColor] = useState("#1976d2");
  const [cabinColor, setCabinColor] = useState("#c62828");

  const handleCriarNovaCarreta = () => {
    if (fabricRef.current) {
      fabricRef.current.createNewTruck(trailerColor, cabinColor);
    }
  };

  return (
    <div className="min-vh-100 d-flex flex-column">
      <Header />
      <main className="flex-grow-1 d-flex align-items-center justify-content-center">
        <div className="bg-light p-4 rounded shadow" style={{ minWidth: 420 }}>
          <FabricCanvas ref={fabricRef} />
          <div className="d-flex gap-4 mt-4 justify-content-center">
            <label className="d-flex flex-column align-items-center">
              <span className="mb-2 fw-semibold text-secondary">Cor da Carroceria</span>
              <input
                type="color"
                value={trailerColor}
                onChange={e => setTrailerColor(e.target.value)}
                className="form-control form-control-color"
                style={{ width: 48, height: 48, padding: 0, borderRadius: "50%" }}
              />
            </label>
            <label className="d-flex flex-column align-items-center">
              <span className="mb-2 fw-semibold text-secondary">Cor da Cabine</span>
              <input
                type="color"
                value={cabinColor}
                onChange={e => setCabinColor(e.target.value)}
                className="form-control form-control-color"
                style={{ width: 48, height: 48, padding: 0, borderRadius: "50%" }}
              />
            </label>
          </div>
          <button
            type="button"
            className="btn mt-4 w-100"
            style={{ backgroundColor: 'var(--rosa)', color: 'white' }}
            onClick={handleCriarNovaCarreta}
          >
            Criar Nova Carreta
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default App;