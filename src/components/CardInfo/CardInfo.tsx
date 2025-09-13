import React from 'react';
import { CardInfoProps } from '../../types/types';

// Funções de formatação
const formatarCPF = (cpf: string): string => {
  if (!cpf) return cpf;
  const cpfLimpo = cpf.replace(/\D/g, "");
  if (cpfLimpo.length === 11) {
    return cpfLimpo.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  }
  return cpf;
};

const formatarCNPJ = (cnpj: string): string => {
  if (!cnpj) return cnpj;
  const cnpjLimpo = cnpj.replace(/\D/g, "");
  if (cnpjLimpo.length === 14) {
    return cnpjLimpo.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
  }
  return cnpj;
};

const formatarTelefone = (telefone: string): string => {
  if (!telefone) return telefone;
  const telefoneLimpo = telefone.replace(/\D/g, "");
  if (telefoneLimpo.length === 11) {
    return telefoneLimpo.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  } else if (telefoneLimpo.length === 10) {
    return telefoneLimpo.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
  }
  return telefone;
};

// Função para aplicar formatação baseada no label
const formatarValor = (label: string, valor: string): string => {
  if (!valor || valor === "-") return valor;
  
  const labelLower = label.toLowerCase();
  
  if (labelLower.includes("cpf")) {
    return formatarCPF(valor);
  } else if (labelLower.includes("cnpj")) {
    return formatarCNPJ(valor);
  } else if (labelLower.includes("telefone") || labelLower.includes("celular")) {
    return formatarTelefone(valor);
  }
  
  return valor;
};

const CardInfo: React.FC<CardInfoProps> = ({ titulo, icon, informacoes }) => {
  return (
    <div
      className="card p-4 mb-4"
      style={{
        background: "linear-gradient(135deg, #f7f3e9 0%, #e9e1d0 100%)",
        border: "none",
        borderRadius: "14px",
        boxShadow: "0 4px 16px 0 rgba(90,64,42,0.10)",
        minHeight: 120,
        maxWidth: 600,
        margin: "0 auto",
        width: "100%"
      }}
    >
      <div className="d-flex align-items-center mb-2" style={{ gap: 10 }}>
        {icon && (
          <span style={{ fontSize: "1.4rem" }}>{icon}</span>
        )}
        <h5
          className="mb-0 fw-bold"
          style={{
            color: "#5A402A",
            fontSize: "1.32rem",
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
                {formatarValor(info.label, info.desc)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CardInfo;