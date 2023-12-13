import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import storage from "../storage/storage";
import DropDownNav from "./DropDownNav";

const Nav = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const authUser = storage.get("authUser");

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    // Limpiar almacenamiento local
    storage.remove("authToken");
    storage.remove("authUser");

    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-transparent">
      <div className="container">
        <Link to="/" className="navbar-brand">
          BMS
        </Link>
        <button className="navbar-toggler" type="button" onClick={toggleMenu}>
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className={`collapse navbar-collapse ${isMenuOpen ? "show" : ""}`}>
          <ul className="navbar-nav ml-auto">
            {authUser && (
              <>
                <li className="nav-item">
                  <span className="nav-link">
                    Bienvenido, {authUser.username}
                  </span>
                </li>
                <li className="nav-item">
                  <Link to="/home" className="nav-link" onClick={toggleMenu}>
                    Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <DropDownNav />
                </li>
                <li className="nav-item">
                  <Link to="/service" className="nav-link" onClick={toggleMenu}>
                    Servicios
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    to="/inventory"
                    className="nav-link"
                    onClick={toggleMenu}
                  >
                    Inventario
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/serviceinventory" className="nav-link" onClick={toggleMenu}>
                    Productos X Servicios
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    to="/patientCase"
                    className="nav-link"
                    onClick={toggleMenu}
                  >
                    Expediente
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    to="/schedule"
                    className="nav-link"
                    onClick={toggleMenu}
                  >
                    Agenda
                  </Link>
                </li>
                {/*<li className="nav-item">
                    <Link
                      to="/treatment"
                      className="nav-link"
                      onClick={toggleMenu}
                    >
                      Tratamiento
                    </Link>
                  </li>*/}
                <li className="nav-item">
                  <Link
                    to="/appointmentSchedule"
                    className="nav-link"
                    onClick={toggleMenu}
                  >
                    Citas
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    to="/invoice"
                    className="nav-link"
                    onClick={toggleMenu}
                  >
                    Facturacion
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/users" className="nav-link" onClick={toggleMenu}>
                    Usuarios
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    to="/settings"
                    className="nav-link"
                    onClick={toggleMenu}
                  >
                    {/*  <i className="fas fa-gear mr-1"></i>*/} Config
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    to="/login"
                    className="btn btn-info nav-link"
                    onClick={handleLogout}
                  >
                    <i className="fas fa-sign-out-alt mr-1"></i> Logout
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
