import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ClassPage from "./pages/ClassPage.tsx";
import SpeciesPage from "./pages/SpeciesPage.tsx";
import PrivateRoute from "./components/PrivateRoute.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import NavBar from "./components/NavBar.tsx";

function App() {
  return (
    <>
      <Router>
        <NavBar />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                {" "}
                <div>
                  <h1>⚔️ Welcome to our DND Database ⚔️</h1>
                </div>
              </PrivateRoute>
            }
          />
          <Route
            path="/classes/*"
            element={
              <PrivateRoute>
                <ClassPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/species"
            element={
              <PrivateRoute>
                <SpeciesPage />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
