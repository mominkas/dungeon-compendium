import { Navbar, NavItem } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import LoginService from "../services/LoginService";
import React from "react";

function NavBar() {
  const location = useLocation();
  const loginService = LoginService.getInstance();
  const navigate = useNavigate();

  if (location.pathname === "/login") {
    return null;
  }

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent default link behavior
    loginService.logout();
    navigate("/login", { replace: true });
  };

  return (
    <Navbar className="d-flex flex-row justify-content-evenly w-100 fixed-top">
      <Navbar.Brand href="/" className="d-flex align-items-center">
        <img
          alt=""
          src="/favicon.png"
          width="30"
          height="30"
          className="d-inline-block align-top"
        />
      </Navbar.Brand>
      <NavItem className="list-group-item">
        <Link to="/" className="btn btn-dark">
          Home
        </Link>
      </NavItem>
      <NavItem className="list-group-item">
        <Link to="/classes" className="btn btn-dark">
          Classes
        </Link>
      </NavItem>
      <NavItem className="list-group-item">
        <Link to="/campaigns" className="btn btn-dark">
          Campaigns
        </Link>
      </NavItem>
      <NavItem className="list-group-item">
        <Link to="/species" className="btn btn-dark">
          Species
        </Link>
      </NavItem>
      <NavItem className="list-group-item">
        <Link to="/characters" className="btn btn-dark">
          Characters
        </Link>
      </NavItem>
      <NavItem className="list-group-item">
        <Link to="/login" onClick={handleLogout} className="btn btn-danger">
          Log Out
        </Link>
      </NavItem>
    </Navbar>
  );
}

export default NavBar;
