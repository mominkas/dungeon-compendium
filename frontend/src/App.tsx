import './App.css'
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import ClassPage from "./pages/ClassPage.tsx";
import SpeciesPage from "./pages/SpeciesPage.tsx";
import {Navbar, NavItem} from "react-bootstrap";

function App() {

  return (
      <>
          <Router>
              <Navbar className="d-flex flex-row justify-content-center">
                  <NavItem className="list-group-item"><Link to="/">Home</Link></NavItem>
                  <NavItem className="list-group-item"><Link to="/classes">Classes</Link></NavItem>
                  <NavItem className="list-group-item"><Link to="/species">Species</Link></NavItem>
              </Navbar>
              <Routes>
                  <Route path="/" element={<div><h1>⚔️ Welcome to our DND Database ⚔️</h1></div>}/>
                  <Route path="/classes/*" element={<ClassPage/>}/>
                  <Route path="/species" element={<SpeciesPage/>}/>
              </Routes>
          </Router>
      </>
  )
}

export default App
