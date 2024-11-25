import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import LoginService from "../services/LoginService";

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const loginService = LoginService.getInstance();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(loginService.isLoggedIn());
  }, [loginService]);
  console.log("Check this!! " + isAuthenticated);
  if (!loginService.isLoggedIn()) {
    console.log("Not authenticated, redirecting to login");
    return <Navigate to="/login" replace />;
  }

  // Otherwise, render the children (protected content)
  return <>{children}</>;
};

export default PrivateRoute;
