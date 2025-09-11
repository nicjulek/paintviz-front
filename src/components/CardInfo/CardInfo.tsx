import React from 'react';
import { Item } from '../../types/types';

interface CardInfoProps {
  titulo: string;
  icon?: React.ReactNode;
  informacoes: Item[];
}

const CardInfo: React.FC<CardInfoProps> = ({ titulo, icon, informacoes }) => {
  return (
    <div
      className="card p-3 mb-3"
      style={{
        background: "linear-gradient(135deg, #f7f3e9 0%, #e9e1d0 100%)",
        border: "none",
        borderRadius: "14px",
        boxShadow: "0 4px 16px 0 rgba(90,64,42,0.10)",
        minHeight: 80,
        maxWidth: 480, // menor largura máxima
        margin: "0 auto"
      }}
    >
      <div className="d-flex align-items-center mb-2" style={{ gap: 10 }}>
        {icon && (
          <span style={{ fontSize: "1.2rem" }}>{icon}</span>
        )}
        <h5
          className="mb-0 fw-bold"
          style={{
            color: "#5A402A",
            fontSize: "1.02rem",
            letterSpacing: "0.5px"
          }}
        >
          {titulo}
        </h5>
      </div>
      <div className="row">
        {informacoes.map((info, index) => (
          <div className="col-12 col-md-6 mb-2" key={index}>
            <div className="d-flex flex-column px-1 py-1">
              <small
                className="text-muted"
                style={{
                  fontSize: "0.95rem",
                  marginBottom: "2px"
                }}
              >
                {info.label}
              </small>
              <div
                className="fw-semibold"
                style={{
                  fontSize: "1.01rem",
                  color: info.highlight ? "#5A402A" : "#222",
                  fontWeight: info.highlight ? 700 : 500,
                  letterSpacing: "0.5px",
                  paddingLeft: info.highlight ? "2px" : "0"
                }}
              >
                {info.desc}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CardInfo;