import React from 'react';
import { Link } from 'react-router-dom';
import { HeaderProps } from '../../types/types';
import './header.css';

const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
  const handleLogout = (): void => {
    if (onLogout) {
      onLogout();
    }
  };

  const commonLinks = (
    <Link
      to="/"
      className="navbar-brand fs-4 fw-bold text-light d-flex align-items-center"
    >
      <img
        src="/icon-b.png"
        alt="PaintViz Logo"
        width="32"
        height="32"
        className="me-2"
      />
      PaintViz
    </Link>
  );

  const userLinks = (
    <>
      <Link className="nav-link text-light d-flex align-items-center gap-2" to="/pintura">
        <i className="bi bi-brush"></i>
        Criar Carroceria
      </Link>
      <Link className="nav-link text-light d-flex align-items-center gap-2" to="/galeria">
        <i className="bi bi-images"></i>
        Galeria
      </Link>
      <Link className="nav-link text-light d-flex align-items-center gap-2" to="/agenda">
        <i className="bi bi-calendar-event"></i>
        Agenda
      </Link>
    </>
  );

  const adminLinks = (
    <>
      <Link className="nav-link text-light d-flex align-items-center gap-2" to="/gestao-atendentes">
        <i className="bi bi-person-circle"></i>
        Gestão de Atendentes
      </Link>
      <Link className="nav-link text-light d-flex align-items-center gap-2" to="/gestao-modelos">
        <i className="bi bi-file-earmark-text"></i>
        Gestão de Modelos
      </Link>
    </>
  );

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-paintviz-brown shadow-paintviz">
      <div className="container-fluid px-4">
        {commonLinks}

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
            {user && userLinks}
          </div>

          {user && (
            <div className="d-flex align-items-center gap-3 ms-lg-3 user-section">
              <div
                className="d-flex align-items-center rounded-pill px-3 py-1"
                style={{ backgroundColor: '#513926' }}
              >
                <span className="navbar-text text-light me-3">
                  Olá, {user.name}
                </span>
                <button
                  className="btn btn-paintviz-light rounded-pill d-flex align-items-center gap-2 px-2 py-1 fw-medium"
                  onClick={handleLogout}
                  type="button"
                >
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