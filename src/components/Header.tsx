import React from "react";
import '../App.css';

const Header: React.FC = () => (
  <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow">
    <div className="container">
      <a className="navbar-brand d-flex align-items-center" href="/">
        <img
          src="/icon-b.png"
          alt="Logo"
          style={{ width: "40px", height: "40px", marginRight: "10px" }}
        />
        PaintViz
      </a>
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav ms-auto">
          <li className="nav-item">
            <a className="nav-link" href="/painel">
              Painel
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="/espera">
              Lista de Espera
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="/criar-os">
              Criar Ordem de Serviço
            </a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
);

export default Header;
export { };