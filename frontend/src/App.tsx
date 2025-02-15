import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ClassPage from "./pages/ClassPage.tsx";
import SpeciesPage from "./pages/SpeciesPage.tsx";
import CharacterPage from "./pages/CharacterPage.tsx";
import PrivateRoute from "./components/PrivateRoute.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import NavBar from "./components/NavBar.tsx";
import CampaignPage from "./pages/CampaignPage.tsx";
import CampaignDetailsPage from "./pages/CampaignDetailsPage.tsx";
import HomePage from "./pages/HomePage.tsx";

function App() {
  return (
    <>
      <Router>
        {" "}
        {/* router setup: https://youtu.be/U7oPfhHAzLc?si=fnu5_Y85XM_0MJ_3 */}
        <NavBar />
        <div className="container mt-5 pt-5">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <HomePage />
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
              path="/campaigns"
              element={
                <PrivateRoute>
                  <CampaignPage />
                </PrivateRoute>
              }
            />
            <Route
              path="campaigns/campaign-details/*"
              element={
                <PrivateRoute>
                  <CampaignDetailsPage />
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
            <Route
              path="/characters"
              element={
                <PrivateRoute>
                  <CharacterPage />
                </PrivateRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </>
  );
}

export default App;
