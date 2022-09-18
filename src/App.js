import React from "react";
import { Route, BrowserRouter, Routes, Navigate } from "react-router-dom";
import "./App.css";
import Navbar from "./components/navbar.js";
import Accueil from "./components/accueil.js";
import Dashboard from "./components/dashboard.js";
import Login from "./components/login.js";
import Rechercher from "./components/rechercher.js";
import Statistiques from "./components/statistiques.js";
import { useAuthentification } from "./context/AuthContext";
import Logout from "./components/logout";

function App() {
  const { isAuthenticated } = useAuthentification();
  return (
    <div className="App">
      <BrowserRouter>
        {isAuthenticated && <Navbar />}

        <div className="main">
          {isAuthenticated ? (
            <Routes>
              <Route path="/" element={<Accueil />}></Route>
              <Route path="/dashboard" element={<Dashboard />}></Route>
              <Route path="/search" element={<Rechercher />}></Route>
              <Route path="/stats" element={<Statistiques />}></Route>
              <Route path="/logout" element={<Logout />}></Route>
              <Route path="*" element={<Navigate to="/" />}></Route>
            </Routes>
          ) : (
            <Routes>
              <Route path="login" element={<Login />}></Route>
              <Route path="*" element={<Navigate to="/login" />}></Route>
            </Routes>
          )}
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
