import React, { useEffect, useState } from 'react';
import HttpService from '../services/HttpService';
import { errorAlert, successAlert, timerAlert } from '../helpers/alerts';
import useStore from '../store/useStore';
import { useNavigate } from 'react-router';
import LeftBlock from '../components/login/LeftBlock';
import RigthBlock from '../components/login/RigthBlock';
import './Login.scss';
import DogButton from '../components/buttons/DogButton';

const Login = () => {
    const login = useStore((state) => state.login);
    const httpService = new HttpService();
    const navigate = useNavigate();
    const token = useStore((state) => state.token); // Obtener el token del store

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [tienda, setTienda] = useState('');
    const [loading, setLoading] = useState(false);
    const [tiendas, setTiendas] = useState([]);

    // Si el token ya existe, redirige al dashboard
    useEffect(() => {
        if (token) {
            navigate('/dashboard'); // Redirige al Dashboard si ya estás logeado
        }
    }, [token, navigate]);

    useEffect(() => {
        const fetchTiendas = async () => {
            try {
                setLoading(true);
                const response = await httpService.getData('/stores');
                if (response.status === 200) {
                    // setTienda(response.data[0].id); // Establecer la primera tienda como predeterminada
                    console.log('Tiendas:', response.data);
                    setTiendas(response.data); // Establecer la primera tienda como predeterminada
                } else {
                    console.error('Error:', response);
                }
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setLoading(false);
            }
        } 

        if (!token) {
            fetchTiendas(); // Solo obtener tiendas si no hay token
        }
    }, []);


    // Si el token existe, no renderizamos el formulario de login, solo redirigimos
    if (token) return null;

    // Manejador de envío del formulario
    const handleSubmit = (e) => {
        e.preventDefault();
        const data = {
            username: username,
            password: password,
            tienda: tienda,
        };

        // Validar el formulario
        if (!username || !password || !tienda) {
            errorAlert('Error', 'Por favor completa todos los campos', 2000);
            return;
        }

        handleLogin(data);
    };

    const handleLogin = async (data) => {
        try {
            setLoading(true);
            
            const response = await httpService.postData('/auth/login', data);

            if (response.status === 200) {
                const token = response.data.token;
                login(token); // Guardar el token en el store
                await timerAlert('Bienvenido', 'Acceso exitoso', 2000).then(
                    () => {
                        navigate('/dashboard'); // Redirigir al dashboard después de login exitoso
                    }
                );
            } else {
                console.error('Error:', response);
            }
        } catch (error) {
            console.error('Error:', error);
            await errorAlert(
                'Error',
                `${error.response?.data?.message || 'Login failed'}`,
                2000
            ).then(() => {
                setUsername(''); // Limpiar el campo de usuario
                setPassword(''); // Limpiar el campo de contraseña
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className=" main_container_login">
            <div className="container_login">
                <div className="left_block_login">
                    <LeftBlock
                        handleSubmit={handleSubmit}
                        username={username}
                        setUsername={setUsername}
                        password={password}
                        setPassword={setPassword}
                        loading={loading}
                        tiendas={tiendas}
                        setTienda={setTienda}
                    />
                </div>
                <div className="right_block_login">
                    <RigthBlock />
                </div>
            </div>
        </div>
    );
};

export default Login;
