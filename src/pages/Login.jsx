import React, { useEffect, useState } from 'react';
import HttpService from '../services/HttpService';
import { errorAlert, successAlert, timerAlert } from '../helpers/alerts';
import useStore from '../store/useStore';
import { useNavigate } from 'react-router';

const Login = () => {
    const login = useStore((state) => state.login);
    const httpService = new HttpService();
    const navigate = useNavigate();
    const token = useStore((state) => state.token); // Obtener el token del store

    const [username, setUsername] = useState('racknaro');
    const [password, setPassword] = useState('123456');
    const [loading, setLoading] = useState(false);

    const tiendas = [
        { id: 1, name: 'Americas' },
        { id: 2, name: 'Ocampo' },
        { id: 3, name: 'XalapaCrystal' },
        { id: 4, name: 'Mocambo' },
    ];

    // Si el token ya existe, redirige al dashboard
    useEffect(() => {
        if (token) {
            navigate('/dashboard'); // Redirige al Dashboard si ya estás logeado
        }
    }, [token, navigate]);

    // Si el token existe, no renderizamos el formulario de login, solo redirigimos
    if (token) return null;

    // Manejador de envío del formulario
    const handleSubmit = (e) => {
        e.preventDefault();
        const data = {
            username: username,
            password: password,
        };

        handleLogin(data);
    };

    const handleLogin = async (data) => {
        // await timerAlert('Bienvenido', 'Acceso exitoso', 2000).then(() => {
        //     navigate('/dashboard'); // Redirigir al dashboard después de login exitoso
        // });
        try {
            setLoading(true);
            const response = await httpService.postData('/auth/login', data);

            if (response.status === 200) {
                const token = response.data.token;
                login(token); // Guardar el token en el store
                await timerAlert('Bienvenido', 'Acceso exitoso', 2000).then(() => {
                    navigate('/dashboard'); // Redirigir al dashboard después de login exitoso
                });
            } else {
                console.error('Error:', response);
            }
        } catch (error) {
            console.error('Error:', error);
            await errorAlert('Error', `${error.response?.data?.message || 'Login failed'}`, 2000)
            .then(() => {
                setUsername(''); // Limpiar el campo de usuario
                setPassword(''); // Limpiar el campo de contraseña
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-4">
                    <h2 className="text-center mb-4">Login</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="username" className="form-label">
                                Email
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">
                                Password
                            </label>
                            <input
                                type="password"
                                className="form-control"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        {/* select para seleccionar tienda  americas ocampo  xalapacrystal mocambo*/}
                        <div className="mb-3">
                            <label htmlFor="tienda" className="form-label">
                                Tienda
                            </label>
                            <select
                                className="form-select"
                                id="tienda"
                                required
                            >
                                {tiendas.map((tienda) => (
                                    <option key={tienda.id} value={tienda.id}>
                                        {tienda.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary w-100"
                            disabled={loading}
                        >
                            {loading ? 'Accediendo...' : 'Acceder'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
