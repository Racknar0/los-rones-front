import React from 'react';
import useStore from '../store/useStore'; // Importar el store de Zustand
import { Navigate } from 'react-router';

const PrivateRoute = ({ element }) => {
    const token = useStore(state => state.token); // Verifica si el token existe

    // Si no hay token (usuario no está autenticado), redirige al login
    if (!token) {

        console.log('No hay token:', token);

        return <Navigate to="/" replace />;
    }

    // Si el token existe (usuario está logeado), permite el acceso a la ruta protegida
    return element;
};

export default PrivateRoute;
