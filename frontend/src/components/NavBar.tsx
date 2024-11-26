import { Navbar, NavItem } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import LoginService from "../services/LoginService";

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
    <Navbar className="d-flex flex-row justify-content-center">
      <NavItem className="list-group-item">
        <Link to="/">Home</Link>
      </NavItem>
      <NavItem className="list-group-item">
        <Link to="/campaigns">Campaigns</Link>
      </NavItem>
      <NavItem className="list-group-item">
        <Link to="/classes">Classes</Link>
      </NavItem>
      <NavItem className="list-group-item">
        <Link to="/species">Species</Link>
      </NavItem>
      <NavItem className="list-group-item">
        <Link to="/login" onClick={handleLogout}>
          Log Out
        </Link>
      </NavItem>
    </Navbar>
  );
}

export default NavBar;
