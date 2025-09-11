import React from "react";
import { useLocation, Navigate } from "react-router-dom";

const ProtectedOrdemRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const user = localStorage.getItem('user');
  const token = localStorage.getItem('token');
  const params = new URLSearchParams(location.search);
  const idOrdem = params.get("id_ordem");

  const idPintura = localStorage.getItem("id_pintura");
  const bloqueado = !idPintura && !idOrdem;

  console.log("ProtectedOrdemRoute | bloqueado:", bloqueado, "| id_ordem:", idOrdem, "| id_pintura:", idPintura);

  if (!user || !token) {
    return <Navigate to="/login" replace />;
  }

  if (bloqueado) {
    return <Navigate to="/galeria" replace />;
  }

  return <>{children}</>;
};

export default ProtectedOrdemRoute;