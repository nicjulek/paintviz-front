import React from "react";
import ErroAcesso from "../../pages/ErroAcesso";

const ProtectedOrdemRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const idPintura = localStorage.getItem("id_pintura");
  if (!idPintura) {
    return <ErroAcesso mensagem="Para cadastrar uma ordem de serviço, primeiro crie e salve uma pintura." />;
  }
  return <>{children}</>;
};

export default ProtectedOrdemRoute;