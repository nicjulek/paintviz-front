import React from 'react';
import './header.css';

type UserRole = 'admin' | 'user';

interface User {
  name: string;
  role: UserRole;
}

interface HeaderProps {
  user: User | null;
}

const Header: React.FC<HeaderProps> = ({ user }) => {
  const commonLinks = (
    <>
      <a className="nav-link text-light d-flex align-items-center gap-2" href="/criar-pintura">
        <i className="bi bi-brush"></i>
        Criar Carroceria
      </a>
      <a className="nav-link text-light d-flex align-items-center gap-2" href="/galeria">
        <i className="bi bi-images"></i>
        Galeria
      </a>
      <a className="nav-link text-light d-flex align-items-center gap-2" href="/agenda">
        <i className="bi bi-calendar-event"></i>
        Agenda
      </a>
    </>
  );

  const adminLinks = (
    <>
      <a className="nav-link text-light d-flex align-items-center gap-2" href="/cadastro-usuario">
        <i className="bi bi-person-circle"></i>
        Cadastro de Atendente
      </a>
      <a className="nav-link text-light d-flex align-items-center gap-2" href="/cadastro-modelo">
        <i className="bi bi-file-earmark-text"></i>
        Cadastro de Modelo
      </a>
    </>
  );

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-paintviz-brown shadow-paintviz">
      <div className="container-fluid px-4">
        <a className="navbar-brand fs-4 fw-bold text-light d-flex align-items-center" href="/">
          <img 
            src="/icon-b.png" 
            alt="PaintViz Logo" 
            width="32" 
            height="32" 
            className="me-2"
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
          <div className="navbar-nav ms-auto d-flex flex-lg-row gap-3">
            {user?.role === 'admin' && adminLinks}
            {user && commonLinks}
          </div>
          
          {user && (
            <div className="d-flex align-items-center gap-3 ms-lg-3 user-section">
              <div className="d-flex align-items-center rounded-pill px-3 py-1" style={{ backgroundColor: '#513926' }}>
                <span className="navbar-text text-light me-3">
                  Olá, {user.name}
                </span>
                <button className="btn btn-paintviz-light rounded-pill d-flex align-items-center gap-2 px-2 py-1 fw-medium">
                  <i className="bi bi-box-arrow-right"></i>
                  Sair
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;