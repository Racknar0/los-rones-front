import React, { useEffect } from 'react';
import './Tableusers.scss';
import { DeleteIcon } from '../../../../../components/icons/DeleteIcon';
import { EditIcon } from '../../../../../components/icons/EditIcon';
import Spinner from '../../../../../components/spinner/Spinner';
import userDefaultImg from '../../../../../assets/user.png';
import {
    confirmAlert,
    errorAlert,
    successAlert,
} from '../../../../../helpers/alerts';
import HttpService from '../../../../../services/HttpService';

const TableUsers = ({
    loading,
    setLoading,
    usersData = [],
    getUsers,
    handleTabChange,
    setEditData,
}) => {
    const httpService = new HttpService();

    useEffect(() => {
        getUsers();
        setEditData({
            edit: false,
            userToEdit: null,
        });
        
    }, []);

    const BACK_HOST = import.meta.env.VITE_BACK_HOST;

    const handleDeleteUser = async (userId) => {

        const confirmDelete = await confirmAlert(
            '¿Está seguro que desea eliminar este usuario?',
            'Esta acción no se puede deshacer.',
            'warning'
        );

        if (!confirmDelete) return; // Si el usuario cancela, no hacemos nada

        try {
            setLoading(true);
            const response = await httpService.deleteData('/users', userId);
            if (response.status === 200) {
                successAlert(
                    'Usuario eliminado',
                    `El usuario ha sido eliminado exitosamente.`
                );
                getUsers(); // Actualiza la lista de usuarios después de eliminar
            } else {
                errorAlert('Error', 'No se pudo eliminar el usuario');
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            errorAlert('Error', 'No se pudo eliminar el usuario');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="table_container">
            <table className="table table-striped table-hover">
                <thead>
                    <tr>
                        <th>Acciones</th>
                        <th>Tienda</th>
                        <th>Usuario</th>
                        <th>Rol</th>
                        <th>Correo</th>
                        <th>Nombre</th>
                        <th>Imagen</th>
                        <th>Último Login</th>
                        <th>Activo</th>
                    </tr>
                </thead>
                <tbody>
                    {!loading &&
                        usersData &&
                        usersData.length > 0 &&
                        usersData.map((u, index) => (
                            <tr key={index}>
                                <td>
                                    <button
                                        className="btn btn-sm btn-primary me-2"
                                        onClick={() => {
                                            handleTabChange('crear');
                                            setEditData({
                                                edit: true,
                                                userToEdit: u,
                                            })
                                        }}
                                    >
                                        <EditIcon
                                            width={20}
                                            height={20}
                                            fill="#fff"
                                        />
                                    </button>
                                    <button
                                        className="btn btn-sm btn-danger"
                                        onClick={() => handleDeleteUser(u.id)}
                                    >
                                        <DeleteIcon
                                            width={20}
                                            height={20}
                                            fill="#fff"
                                        />
                                    </button>
                                </td>
                                {/* <td>{u.store?.name ? u.store.name : (u.roleId === 2 ? "ADM" : "No disponible")}</td> */}
                                <td style={{
                                    fontWeight: 'bold',
                                }}>{ u.roleId === 2 ? "ALL" :  (u.store?.name || 'No disponible') }</td>
                                <td>{u.user || 'No disponible'}</td>
                                <td>
                                    {u.role?.name || 'No disponible'}
                                </td>
                                <td>{u.email || 'No disponible'}</td>
                                <td>{u.name + ' ' + u.lastName || 'No disponible'}</td>
                                <td>
                                    <img
                                        // src={
                                        //     BACK_HOST +
                                        //     u.profilePicture ||
                                        //     'https://placehold.co/30x30'}
                                        src={
                                            u.profilePicture
                                                ? BACK_HOST +
                                                  '/' +
                                                  u.profilePicture
                                                : userDefaultImg
                                        }
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
