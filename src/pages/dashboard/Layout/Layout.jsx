import React, { useState } from 'react';
import { Outlet } from 'react-router'; 
import Sidebar from '../../../components/dashboard/Sidebar';
import './Layout.scss'; 
import { confirmAlert } from '../../../helpers/alerts';
import { CollapseIcon } from '../../../components/icons/CollapseIcon';
import userImage from '../../../assets/user.png'; // Importa la imagen del usuario desde la carpeta de assets
import useStore from '../../../store/useStore';

const Layout = () => {

  const [toggled, setToggled] = useState(false);
  const [broken, setBroken] = useState( window.matchMedia('(max-width: 768px)').matches ); // Estado para manejar el colapso del sidenav en pantallas pequeñas
  const jwtData = useStore((state) => state.jwtData);


    const handleLogout = async () => {

        const confirmLogout = await confirmAlert(
          '¿Está seguro que desea cerrar sesión?',
          'Al cerrar sesión, se cerrará su sesión actual.',
          'warning'
        );

        console.log(confirmLogout);

        if (!confirmLogout) return; // Si el usuario cancela, no hacemos nada

        // Borrar localStorage o realizar cualquier acción de cierre de sesión aquí
        localStorage.removeItem('token');
        // Redirigir al usuario a la página de inicio de sesión
        window.location.href = '/';
        
    };

  return (
    <div className='container_layout'>
      <header className="header">

        <div className='header_title_container'>
          <h1 className='header_title'>Administración</h1>
        </div>

        <div className="header_user_container">
                <div className='image_logouser_container'>
                    <img className='image_logouser' src={userImage} alt="Logo de usuario" />
                </div>
                <div className='user_info_container'>
                    <div className='user_name_container'>
                        <p className='user_name'>
                          {jwtData?.username || 'Usuario no disponible'}
                        </p>
                    </div>
                    <div className='user_role_container'>
                        <p className='user_role'>
                          {
                            jwtData?.roleId === 1 ? 'Asesor' :
                            jwtData?.rol === 2 ? 'Administrador' :
                            jwtData?.rol === 3 ? 'Moderador' :
                            'Rol no disponible'
                          }
                        </p>
                    </div>
                </div>
          </div>


        <div className='header_right_container'>
          <button className="logout_btn" onClick={handleLogout}> Desconectar </button>
          {broken && ( 
            <button 
              className="bnt_toggle" 
              onClick={() => setToggled(!toggled)} 
              style={{ transform: toggled ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }}
            > 
              <CollapseIcon 
                className="collapse_icon" 
                width={30} 
                height={30} 
              /> 
            </button> 
          )}
          
        </div>
      </header>

      <div className='main_wrapper'>
        <Sidebar
          toggled={toggled}
          setToggled={setToggled}
          broken={broken}
          setBroken={setBroken}
        />

        {/* Contenido dinámico basado en las rutas */}
        <div className="main_content">
          {/* Este es el lugar donde se renderiza el contenido dependiendo de la ruta */}
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
