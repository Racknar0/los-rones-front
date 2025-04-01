import React from 'react';
import './Tableusers.scss';
import { DeleteIcon } from '../../../../components/icons/DeleteIcon';
import { EditIcon } from '../../../../components/icons/EditIcon';
import Spinner from '../../../../components/spinner/Spinner';

const TableUsers = ({ users = [], loading }) => {
    return (
        <div className="table_container">
            <table className="table table-striped table-hover">
                <thead>
                    <tr>
                        <th>Acciones</th>
                        <th>Usuario</th>
                        <th>Correo</th>
                        <th>Nombres</th>
                        <th>Apellidos</th>
                        <th>Imagen</th>
                        <th>Último Login</th>
                        <th>Activo</th>
                        <th>Rol</th>
                    </tr>
                </thead>
                <tbody>
                    {!loading &&
                        users &&
                        users.length > 0 &&
                        users.map((u, index) => (
                            <tr key={index}>
                                <td>
                                    <button className="btn btn-sm btn-primary me-2">
                                        <EditIcon
                                            width={20}
                                            height={20}
                                            fill="#fff"
                                        />
                                    </button>
                                    <button className="btn btn-sm btn-danger">
                                        <DeleteIcon
                                            width={20}
                                            height={20}
                                            fill="#fff"
                                        />
                                    </button>
                                </td>
                                <td>{u.user}</td>
                                <td>{u.email}</td>
                                <td>{u.name}</td>
                                <td>{u.lastName}</td>
                                <td>
                                    <img
                                        src={u.profilePicture}
                                        alt="profile"
                                        width="50"
                                        height="50"
                                    />
                                </td>
                                <td>
                                    {u.lastLogin
                                        ? new Date(u.lastLogin).toLocaleString()
                                        : 'Nunca'}
                                </td>
                                <td>{u.isActive ? 'Sí' : 'No'}</td>
                                <td>
                                    {u.roleId === 1
                                        ? 'Asesor'
                                        : u.roleId === 2
                                        ? 'Administrador'
                                        : u.roleId === 3
                                        ? 'Moderador'
                                        : 'Rol no disponible'}
                                </td>
                            </tr>
                        ))}
                    
                </tbody>
                
            </table>
            {loading && (
                        <div className="spinner_container">
                            <Spinner color="#6564d8" />
                        </div>
                    )}
        </div>
    );
};

export default TableUsers;
