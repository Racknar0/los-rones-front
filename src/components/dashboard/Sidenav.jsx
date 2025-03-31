import React, { useState } from 'react';
import { Link } from 'react-router';
import './Sidenav.css'; // Asegúrate de tener un archivo CSS para estilos personalizados

const SideNav = () => {
  // Estado para manejar si el sidenav está colapsado o expandido
  const [collapsed, setCollapsed] = useState(false);

  // Función para alternar el estado colapsado
  const toggleSideNav = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div>
      {/* SideNav */}
      <div id="sidenav" className={`sidenav bg-dark text-white ${collapsed ? 'collapsed' : ''}`}>
        <div className="d-flex justify-content-between align-items-center p-3">
          <button onClick={toggleSideNav} className="btn btn-light">
            <i className={`bi ${collapsed ? 'bi-arrow-bar-right' : 'bi-arrow-bar-left'}`}></i>
          </button>
        </div>
        <div className="nav flex-column p-3">
          <h2 className="text-center mb-4">NexusFlow</h2>
          <Link className="nav-link text-white" to="/dashboard">Dashboard</Link>
          <Link className="nav-link text-white" to="/productos">Productos</Link>
          <Link className="nav-link text-white" to="/usuarios">Usuarios</Link>
          <div className="d-flex align-items-center mt-5">
            <img
              src="https://randomuser.me/api/portraits/women/79.jpg"
              alt="User"
              className="rounded-circle"
              width="40"
              height="40"
            />
            <div className="ms-2">
              <p className="mb-0">Alex Morgan</p>
              <small>Admin</small>
            </div>
          </div>
        </div>
      </div>


    </div>
  );
};

export default SideNav;
