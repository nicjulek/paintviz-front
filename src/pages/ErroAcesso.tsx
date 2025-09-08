import React from "react";

const ErroAcesso: React.FC<{ mensagem?: string }> = ({ mensagem }) => (
  <div className="container py-4">
    <div className="bg-paintviz-accent p-4 rounded shadow text-center">
      <h2 className="mb-4">Acesso Negado</h2>
      <div className="alert alert-danger">
        {mensagem || "Você não tem permissão para acessar esta página."}
      </div>
    </div>
  </div>
);

export default ErroAcesso;