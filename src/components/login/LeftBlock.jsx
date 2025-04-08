import React from 'react';
import './LeftBlock.css';
import logo from '../../assets/logo-login.png';
import DogButton from '../buttons/DogButton';
import Spinner from '../spinner/Spinner';
const LeftBlock = ({
    handleSubmit,
    username,
    setUsername,
    password,
    setPassword,
    loading,
    tiendas,
    setTienda,
    store,
    setStore,
}) => {


    const [stores, setStores] = React.useState([]);

    return (
        <div className="left_block_login_container">
            <div className="left_block_brand">
                <img src={logo} alt="Logo" className="logo_login" />
                <h1 className="title_login">Administración</h1>
            </div>

            <div className="left_block_greeting">
                <h2 className="greeting_login">Bienvenido</h2>
                <p className="remember_pass">Recupera tu contraseña</p>
            </div>

            <div className="left_block_form">
                <p className="text_form">
                    Para acceder a la aplicación, por favor ingresa tu usuario y
                    contraseña.
                </p>
                <form className="form_login">
                    <div className="input_group">
                        <label htmlFor="username" className="label label_email">
                            Username
                        </label>
                        <input
                            type="text"
                            className="input_text"
                            id="username"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleSubmit(e);
                                }
                            }}
                        />
                    </div>
                    <div className="input_group">
                        <label htmlFor="password" className="label label_pass">
                            Password
                        </label>
                        <input
                            type="password"
                            className="input_text"
                            id="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleSubmit(e);
                                }
                            }}
                        />
                    </div>
                    <div className="input_group">
                        <label htmlFor="tienda" className="label label_tienda">
                            Tienda
                        </label>
                        <select
                            className="input_select"
                            id="tienda"
                            required
                            defaultValue={''}
                            onChange={(e) => setTienda(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleSubmit(e);
                                }
                            }}
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
                    {loading ? (
                        <div className="spinner_container">
                            <Spinner />
                        </div>
                    ) : (
                        <DogButton
                            handleSubmit={handleSubmit}
                            loading={loading}
                            disabled={loading}
                        />
                    )}
                    
                </form>
            </div>
        </div>
    );
};

export default LeftBlock;
