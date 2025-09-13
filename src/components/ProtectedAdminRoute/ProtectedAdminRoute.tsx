import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedAdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  if (!user || !user.isAdmin) {
    return <Navigate to="/galeria" replace />;
  }
  return <>{children}</>;
};

export default ProtectedAdminRoute;