import { useState } from 'react';
import { Sidebar as Sidenav, Menu, MenuItem } from 'react-pro-sidebar';
import { Link, useLocation } from 'react-router';
import { ChartIcon } from '../icons/ChartIcon';
import { ProductIcon } from '../icons/ProductIcon';
import { UserAddIcon } from '../icons/UserIcon';
import { CouponIcon } from '../icons/CouponIcon';
import { ReciboIcon } from '../icons/ReciboIcon';
import { CorteIcon } from '../icons/CorteIcon';
import { ReporteIcon } from '../icons/ReporteIcon';
import './Sidebar.scss'; // Asegúrate de tener el CSS correspondiente para el sidebar
import { ChevronLeftIcon } from '../icons/ChevronLeftIcon';
import logoLogin from '../../assets/logo-login.png'; // Asegúrate de tener la imagen del logo en la ruta correcta

const width = "250px"; // Ancho del sidenav
const colapsedWidth = "70px"; // Ancho del sidenav colapsado
const backgroundColor = "#6564d8"; // Color de fondo del sidenav
const transitionDuration = 500; // Duración de la transición en milisegundos



const Sidebar = ({ toggled, setToggled , setBroken }) => {

    const [collapsed, setCollapsed] = useState(false); // Estado para manejar el colapso del sidenav usarlo en algun lugar para cambiar el estado del sidenav
    const location = useLocation();

    
  return (
    <Sidenav 
        width={width} 
        collapsedWidth={colapsedWidth} 
        collapsed={collapsed}
        backgroundColor={backgroundColor}
        // image={image}
        toggled={toggled} customBreakPoint="800px" onBreakPoint={setBroken} onBackdropClick={() => setToggled(false)}
        transitionDuration={transitionDuration}
    >
        <Menu
                menuItemStyles={{
                    root: ({ level, active }) => {
                        // aplicar un padding 
                        return {
                            marginBottom: '0.5rem',
                            marginTop: '0.5rem',
                        };
                    },

                    button: ({ level, active, disabled }) => {
                    // only apply styles on first level elements of the tree
                    if (level === 0)
                        return {
                            color: active ? '#000' : '#fff',
                            backgroundColor: active ? '#f3f3f3' : undefined,
                            fontWeight: active ? 'bold' : undefined,
                            fontFamily: 'poppins',
                            fontSize: '1.6rem',
                            '&:hover': {
                                // Si el elemento está activo, mantener el fondo activo o personalizarlo
                                backgroundColor: active ? '#f3f3f3' : '#5452ad', 
                                // Puedes ajustar el color del texto en hover si lo requieres
                                color: active ? '#000' : '#fff'
                            }
                        };
                    },
                }}
        >
            <MenuItem 
                icon={<ChartIcon width={40} height={40}/>}
                active={location.pathname === '/dashboard/statics'}
                component={<Link to="/dashboard/statics" />}
            > 
                Statics
            </MenuItem>
            <MenuItem 
                icon={<ProductIcon width={40} height={40}/>}
                active={location.pathname === '/dashboard/productos'}
                component={<Link to="/dashboard/productos" />}
            > 
                Productos
            </MenuItem>
            <MenuItem 
                icon={<UserAddIcon width={40} height={40} />}
                active={location.pathname === '/dashboard/usuarios'}
                component={<Link to="/dashboard/usuarios" />}
            > 
                Usuarios
            </MenuItem>
            <MenuItem 
                icon={<CouponIcon width={40} height={40} />}
                active={location.pathname === '/dashboard/cupones'}
                component={<Link to="/dashboard/cupones" />}
            > 
                Cupones
            </MenuItem>
            <MenuItem 
                icon={<ReciboIcon width={40} height={40} />}
                active={location.pathname === '/dashboard/recibos'}
                component={<Link to="/dashboard/recibos" />}
            > 
                Recibos
            </MenuItem>
            <MenuItem 
                icon={<CorteIcon width={40} height={40} />}
                active={location.pathname === '/dashboard/cortes'}
                component={<Link to="/dashboard/cortes" />}
            > 
                Cortes
            </MenuItem>
            <MenuItem 
                icon={<ReporteIcon width={40} height={40} />}
                active={location.pathname === '/dashboard/reportes'}
                component={<Link to="/dashboard/reportes" />}
            > 
                Reportes
            </MenuItem>

            <div className="sidebar_footer">
                <div className="sidebar_footer_logo_container">
                    <img className="sidebar_footer_logo" src={logoLogin} alt="Logo de la empresa" />
                </div>
                <p className="sidebar_footer_text"
                    style={{ fontSize: collapsed ? '0.5rem' : '1.2rem', transition: 'font-size 0.3s ease' }}
                >© 2025 Todos los derechos reservados</p>
            </div>
            

            <button className="collapse_btn" onClick={() => setCollapsed(!collapsed)}>
                <ChevronLeftIcon width={30} height={30} style={{ transform: collapsed ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }} />
            </button>
        </Menu>
    </Sidenav>
  )
}

export default Sidebar