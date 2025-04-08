import React, { useEffect, useState } from 'react';
import HttpService from '../../../services/HttpService';
import { errorAlert } from '../../../helpers/alerts';
import './Productos.scss';
import FormCategorias from './form/formCategories/FormCategorias';
import TableCategories from './table/tableCategories/TableCategories';
import TableProduct from './table/tableProduct/TableProduct';

const Productos = () => {
    const httpService = new HttpService();
    const [activeTab, setActiveTab] = useState('productos');

    // Users data
    const [productData, setProductData] = useState([]);
    const [loadingProduct, setLoadingProduct] = useState(false);
    const [editDataProduct, setEditDataProduct] = useState({
        edit: false,
        productToEdit: null,
    });

    // Categories data
    const [categoriesData, setCategoriesData] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(false);
    const [editDataCategories, setEditDataCategories] = useState({
        edit: false,
        categorieToEdit: null,
    });

    useEffect(() => {
        // getUsers();
        getCategories();
    }, []);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    // const getUsers = async () => {
    //     try {
    //         setLoading(true);
    //         const response = await httpService.getData('/users');
    //         if (response.status === 200) {
    //             setUsersData(response.data || []);
    //         } else {
    //             errorAlert('Error', 'No se pudo obtener la lista de usuarios');
    //         }
    //     } catch (error) {
    //         console.error('Error fetching users:', error);
    //         errorAlert('Error', 'No se pudo obtener la lista de usuarios');
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    const getCategories = async () => {
        try {
            setLoadingCategories(true);
            const response = await httpService.getData('/category');
            if (response.status === 200) {
                setCategoriesData(response.data || []);
            } else {
                errorAlert('Error', 'No se pudo obtener la lista de categorias');
            }
        } catch (error) {
            console.error('Error fetching roles:', error);
            errorAlert('Error', 'No se pudo obtener la lista de categorias');
        } finally {
            setLoadingCategories(false);
        }
    }

   console.log("editDataCategories MAIN" , editDataCategories)

    return (
        <div className="main_container">
            {/* Tabs de navegación */}
            <ul className="nav nav-tabs">
                <li className="nav-item">
                    <a
                        className={`nav-link ${
                            activeTab === 'productos' ? 'active' : ''
                        }`}
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            setActiveTab('productos');
                        }}
                    >
                        Productos
                    </a>
                </li>
                <li className="nav-item">
                    <a
                        className={`nav-link ${
                            activeTab === 'crear_producto' ? 'active' : ''
                        }`}
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            setActiveTab('crear_producto');
                        }}
                    >
                        {editDataProduct.edit ? 'Editar Producto' : 'Crear Producto'}
                    </a>
                </li>
                <li className="nav-item">
                    <a
                        className={`nav-link ${
                            activeTab === 'categorias' ? 'active' : ''
                        }`}
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            setActiveTab('categorias');
                        }}
                    >
                        Categorias
                    </a>
                </li>
                <li className="nav-item">
                    <a
                        className={`nav-link ${
                            activeTab === 'crear_categoria' ? 'active' : ''
                        }`}
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            setActiveTab('crear_categoria');
                        }}
                    >
                        {editDataCategories.edit ? 'Editar Categoria' : 'Crear Categoria'}
                    </a>
                </li>
            </ul>

            {/* Contenido de cada tab */}
            <div className="tab-content mt-3">
                {activeTab === 'productos' && (
                    <div className="tab-pane fade show active">
                        <h1 className="text-center mt-4 pt-4">Productos</h1>
                        <h4 className="text-center mb-4">Lista de Productos</h4>
                        {/* <TableUsers
                            usersData={usersData}
                            getUsers={getUsers}
                            loading={loading}
                            setLoading={setLoading}
                            handleTabChange={handleTabChange}
                            setEditData={setEditData}
                            setEditDataRoles={setEditDataRoles}
                        /> */}
                        <TableProduct />

                    </div>
                )}
                {activeTab === 'crear_producto' && (
                    <div className="tab-pane fade show active">
                        {/* <FormUsers 
                            handleTabChange={handleTabChange} 
                            editData={editData}
                            setEditData={setEditData}
                            setEditDataCategories={setEditDataCategories}
                        /> */}
                        crear producto
                    </div>
                )}
                {activeTab === 'categorias' && (
                    <div className="tab-pane fade show active">
                        <h1 className="text-center mt-4 pt-4">Categorías</h1>
                        <h4 className="text-center mb-4">Lista de Categorías</h4>
                        <TableCategories 
                            loadingCategories={loadingCategories}
                            setLoadingCategories={setLoadingCategories}
                            categoriesData={categoriesData}
                            getCategories={getCategories}
                            handleTabChange={handleTabChange}
                            setEditDataCategories={setEditDataCategories}
                        />
                    </div>
                )}
                {activeTab === 'crear_categoria' && (
                    <div className="tab-pane fade show active">
                        <FormCategorias 
                            setEditDataCategories={setEditDataCategories}
                            editDataCategories={editDataCategories}
                            handleTabChange={handleTabChange}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Productos;
