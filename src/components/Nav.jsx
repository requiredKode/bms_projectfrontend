import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import storage from '../storage/storage';

const Nav = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const authUser = storage.get('authUser');

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    // Limpiar almacenamiento local
    storage.remove('authToken');
    storage.remove('authUser');

    // Redirigir al usuario a la página de inicio de sesión
    navigate('/login');
  };

  return (
    <nav className={`navbar navbar-expand-lg navbar-light bg-info`}>
      <div className='container-fluid'>
        <Link  className='navbar-brand'>
          BMS
        </Link>
        <button
          className='navbar-toggler'
          type='button'
          onClick={toggleMenu}
        >
          <span className='navbar-toggler-icon'></span>
        </button>
      </div>
      {authUser && (
        <div className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`}>
          <ul className='navbar-nav ml-auto'>
            <li className='nav-item'>
              <span className='nav-link'>Bienvenido, {authUser.username}</span>
            </li>
            <li className='nav-item'>
              <Link to='/home' className='nav-link' onClick={toggleMenu}>
                Dashboard
              </Link>
            </li>
            <li className='nav-item'>
              <Link to='/service' className='nav-link' onClick={toggleMenu}>
                Servicios
              </Link>
            </li>
            <li className='nav-item'>
              <Link to='/country' className='nav-link' onClick={toggleMenu}>
                Pais
              </Link>
            </li>
            <li className='nav-item'>
              <Link to='/disease' className='nav-link' onClick={toggleMenu}>
                Enfermedad
              </Link>
            </li>
            <li className='nav-item'>
              <Link to='/gender' className='nav-link' onClick={toggleMenu}>
                Genero
              </Link>
            </li>
            <li className='nav-item'>
              <Link to='/identityCard' className='nav-link' onClick={toggleMenu}>
                Identificacion
              </Link>
            </li>
            <li className='nav-item'>
              <Link to='/money' className='nav-link' onClick={toggleMenu}>
                Moneda
              </Link>
            </li>
            <li className='nav-item'>
              <Link to='/supplier' className='nav-link' onClick={toggleMenu}>
                Proveedor
              </Link>
            </li>
            <li className='nav-item'>
              <Link to='/treatment' className='nav-link' onClick={toggleMenu}>
                Tratamiento
              </Link>
            </li>
            <li className='nav-item'>
              <Link to='/appointmentSchedule' className='nav-link' onClick={toggleMenu}>
                Citas
              </Link>
            </li>
            <li className='nav-item'>
              <Link to='/patientCase' className='nav-link' onClick={toggleMenu}>
                Expediente
              </Link>
            </li>
            <li className='nav-item'>
              <Link to='/files' className='nav-link' onClick={toggleMenu}>
                Archivos
              </Link>
            </li>
            <li className='nav-item'>
              <button className='btn btn-info' onClick={handleLogout}>
                Logout
              </button>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Nav;
