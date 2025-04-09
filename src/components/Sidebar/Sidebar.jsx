import React, { useEffect, useState } from 'react';
import { Sidebar as Sidenav, Menu, MenuItem } from 'react-pro-sidebar';
import { Link, useLocation } from 'react-router';
import { ChartIcon } from '../icons/ChartIcon';
import { ProductIcon } from '../icons/ProductIcon';
import { UserAddIcon } from '../icons/UserIcon';
import { CouponIcon } from '../icons/CouponIcon';
import { ReciboIcon } from '../icons/ReciboIcon';
import { CorteIcon } from '../icons/CorteIcon';
import { SellIcon } from '../icons/SellIcon';
import { ApartadoIcon } from '../icons/ApartadoIcon';
import { CambioIcon } from '../icons/CambioIcon';
import { ChevronLeftIcon } from '../icons/ChevronLeftIcon';
import logoLogin from '../../assets/logo-login.png';
import useStore from '../../store/useStore';
import './Sidebar.scss';
import HttpService from '../../services/HttpService';
import { InventarioIcon } from '../icons/InventarioIcon';

const width = '250px';
const colapsedWidth = '70px';
const backgroundColor = '#6564d8';
const transitionDuration = 500;

// Configuración del menú: cada clave es la etiqueta, y el valor es un objeto con la ruta, el icono y los roles permitidos.
const menuConfig = {
    Dashboard: {
        roles: ['2'],
        path: '/dashboard/reportes',
        icon: <ChartIcon width={40} height={40} />,
    },
    Ventas: {
        roles: ['1'],
        path: '/dashboard/ventas',
        icon: <SellIcon width={40} height={40} />,
    },

    Productos: {
        roles: ['1', '2'],
        path: '/dashboard/productos',
        icon: <ProductIcon width={40} height={40} />,
    },
    Stock: {
        roles: ['1', '2', '3'],
        path: '/dashboard/stock',
        icon: <InventarioIcon width={40} height={40} />,
    },
    Usuarios: {
        roles: ['2'],
        path: '/dashboard/usuarios',
        icon: <UserAddIcon width={40} height={40} />,
    },
    Cupones: {
        roles: ['2'],
        path: '/dashboard/cupones',
        icon: <CouponIcon width={40} height={40} />,
    },
    Recibos: {
        roles: ['1', '2'],
        path: '/dashboard/recibos',
        icon: <ReciboIcon width={40} height={40} />,
    },
    Cortes: {
        roles: ['1'],
        path: '/dashboard/cortes',
        icon: <CorteIcon width={40} height={40} />,
    },
    Apartados: {
        roles: ['1'],
        path: '/dashboard/apartados',
        icon: <ApartadoIcon width={40} height={40} />,
    },
    'Cambio Tienda': {
        roles: ['1'],
        path: '/dashboard/cambio-tienda',
        icon: <CambioIcon width={40} height={40} />,
    },
};

const Sidebar = ({ toggled, setToggled, setBroken }) => {
    const [collapsed, setCollapsed] = useState(false);
    const location = useLocation();
    const jwtData = useStore((state) => state.jwtData);
    const selectedStore = useStore((state) => state.selectedStore);
    const setSelectedStore = useStore((state) => state.setSelectedStore);

    // Convierte el roleId a cadena para comparar
    const currentRole = jwtData?.roleId ? String(jwtData.roleId) : null;

    // Filtra el objeto de configuración para los ítems permitidos para el rol actual
    const filteredMenuItems = Object.entries(menuConfig).filter(
        ([label, config]) => {
            return currentRole && config.roles.includes(currentRole);
        }
    );

    const [tienda, setTienda] = useState('');
    const [tiendas, setTiendas] = useState([]);
    const httpService = new HttpService();

    useEffect(() => {
        if (jwtData.roleId === 2) {
            const getTiendas = async () => {
                try {
                    const response = await httpService.getData('/stores');
                    const tiendasData = response.data;
                    setTiendas(tiendasData);
                } catch (error) {
                    console.error('Error fetching tiendas:', error);
                }
            };
            getTiendas();

            // setear la tienda con la que se inicia sesión
            if (!selectedStore && jwtData.storeLogin) {
              setSelectedStore(jwtData.storeLogin);
            }
        }
    }, []);

    return (
        <Sidenav
            width={width}
            collapsedWidth={colapsedWidth}
            collapsed={collapsed}
            backgroundColor={backgroundColor}
            toggled={toggled}
            customBreakPoint="800px"
            onBreakPoint={setBroken}
            onBackdropClick={() => setToggled(false)}
            transitionDuration={transitionDuration}
        >
            <Menu
                menuItemStyles={{
                    root: ({ level, active }) => ({
                        marginBottom: '0.5rem',
                        marginTop: '0.5rem',
                    }),
                    button: ({ level, active, disabled }) => {
                        if (level === 0)
                            return {
                                color: active ? '#000' : '#fff',
                                backgroundColor: active ? '#f3f3f3' : undefined,
                                fontWeight: active ? 'bold' : undefined,
                                fontFamily: 'poppins',
                                fontSize: '1.6rem',
                                '&:hover': {
                                    backgroundColor: active
                                        ? '#f3f3f3'
                                        : '#5452ad',
                                    color: active ? '#000' : '#fff',
                                },
                            };
                    },
                }}
            >
                {jwtData?.roleId === 2 && (
                    <div className="sidebar_header">
                        <div className="input_group">
                            <select
                                className="form-control input_group"
                                id="tienda"
                                required
                                value={selectedStore || ""}
                                onChange={(e) => setSelectedStore(e.target.value)}
                            >
                                <option value="" disabled>
                                    Seleccionar tienda
                                </option>
                                {tiendas.map((tienda) => (
                                    <option key={tienda.id} value={tienda.id}>
                                        {tienda.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                )}

                {filteredMenuItems.map(([label, config]) => (
                    <MenuItem
                        key={label}
                        icon={config.icon}
                        active={location.pathname === config.path}
                        component={<Link to={config.path} />}
                    >
                        {label}
                    </MenuItem>
                ))}

                <div className="sidebar_footer">
                    <div className="sidebar_footer_logo_container">
                        <img
                            className="sidebar_footer_logo"
                            src={logoLogin}
                            alt="Logo de la empresa"
                        />
                    </div>
                    <p
                        className="sidebar_footer_text"
                        style={{
                            fontSize: collapsed ? '0.5rem' : '1.2rem',
                            transition: 'font-size 0.3s ease',
                        }}
                    >
                        © 2025 Todos los derechos reservados
                    </p>
                </div>

                <button
                    className="collapse_btn"
                    onClick={() => setCollapsed(!collapsed)}
                >
                    <ChevronLeftIcon
                        width={30}
                        height={30}
                        style={{
                            transform: collapsed
                                ? 'rotate(180deg)'
                                : 'rotate(0deg)',
                            transition: 'transform 0.3s ease',
                        }}
                    />
                </button>
            </Menu>
        </Sidenav>
    );
};

export default Sidebar;
