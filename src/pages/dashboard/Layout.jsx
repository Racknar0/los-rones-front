import React from 'react';
import SideNav from '../../components/dashboard/Sidenav';
import { Outlet } from 'react-router'; 

const Layout = () => {
    return (
      <div style={{ display: 'flex' }}>
        {/* SideNav */}
        <SideNav />
        
        {/* Contenido dinámico basado en las rutas */}
        <div className="main-content" style={{ marginLeft: '250px', transition: 'margin-left 0.3s' }}>
          {/* Este es el lugar donde se renderiza el contenido dependiendo de la ruta */}
          <Outlet />
        </div>
      </div>
    );
  };

export default Layout;