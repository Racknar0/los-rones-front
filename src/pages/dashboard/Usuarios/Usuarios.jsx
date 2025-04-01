import React, { useEffect, useState } from 'react';
import TableUsers from './table/TableUsers';
import FormUsers from './form/FormUsers';
import FormRoles from './form/FormRoles';
import HttpService from '../../../services/HttpService';
import { errorAlert } from '../../../helpers/alerts';

const Usuarios = () => {
  const httpService = new HttpService();
  const [activeTab, setActiveTab] = useState('usuarios');
  const [usersData, setUsersData] = useState([]);
  const [loading, setLoading] = useState(false);


  // Datos de ejemplo para la tabla de usuarios.
  const users = [
    {
      user: 'user1',
      email: 'user1@example.com',
      name: 'John',
      lastName: 'Doe',
      profilePicture: 'https://placehold.co/50x50',
      lastLogin: '2023-01-01 12:00:00',
      isActive: true,
      roleId: 1,
    },
    {
      user: 'user2',
      email: 'user2@example.com',
      name: 'Jane',
      lastName: 'Smith',
      profilePicture: 'https://placehold.co/50x50',
      lastLogin: '2023-01-02 08:30:00',
      isActive: false,
      roleId: 2,
    },
  ];

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
      try {
          setLoading(true);
          const response = await httpService.getData('/users');
          if (response.status === 200) {
              setUsersData(response.data || []);
          } else {
            errorAlert('Error', 'No se pudo obtener la lista de usuarios');
          }
      } catch (error) {
          console.error('Error fetching users:', error);
          errorAlert('Error', 'No se pudo obtener la lista de usuarios');
      } finally {
          setLoading(false);
      }
  };


  return (
    <div className="ms-3 me-3 mt-3">
      {/* Tabs de navegación */}
      <ul className="nav nav-tabs">
        <li className="nav-item">
          <a
            className={`nav-link ${activeTab === 'usuarios' ? 'active' : ''}`}
            href="#"
            onClick={(e) => { e.preventDefault(); setActiveTab('usuarios'); }}
          >
            Usuarios & Roles
          </a>
        </li>
        <li className="nav-item">
          <a
            className={`nav-link ${activeTab === 'crear' ? 'active' : ''}`}
            href="#"
            onClick={(e) => { e.preventDefault(); setActiveTab('crear'); }}
          >
            Crear Usuario
          </a>
        </li>
        <li className="nav-item">
          <a
            className={`nav-link ${activeTab === 'crear_rol' ? 'active' : ''}`}
            href="#"
            onClick={(e) => { e.preventDefault(); setActiveTab('crear_rol'); }}
          >
            Crear Rol
          </a>
        </li>
      </ul>

      {/* Contenido de cada tab */}
      <div className="tab-content mt-3">
        {activeTab === 'usuarios' && (
          <div className="tab-pane fade show active">
            <TableUsers users={users} loading={loading} />
          </div>
        )}
        {activeTab === 'crear' && (
          <div className="tab-pane fade show active">
            <FormUsers />
          </div>
        )}
        {activeTab === 'crear_rol' && (
          <div className="tab-pane fade show active">
            <FormRoles />
          </div>
        )}
      </div>
    </div>
  );
};

export default Usuarios;
