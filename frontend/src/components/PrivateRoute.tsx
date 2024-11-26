import React from "react";
import { Navigate } from "react-router-dom";
import LoginService from "../services/LoginService";

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const loginService = LoginService.getInstance();

  if (!loginService.isLoggedIn()) {
    return <Navigate to="/login" replace />;
  }

  // Otherwise, render the children (protected content)
  return <>{children}</>;
};

export default PrivateRoute;
