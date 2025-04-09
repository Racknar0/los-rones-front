import React, { useEffect } from 'react';
import './TableProduct.scss';
import { DeleteIcon } from '../../icons/DeleteIcon';
import { EditIcon } from '../../icons/EditIcon';
import Spinner from '../../spinner/Spinner';
import {
    confirmAlert,
    errorAlert,
    successAlert,
} from '../../../helpers/alerts';
import HttpService from '../../../services/HttpService';
import productDefaultImg from '../../../assets/product_default.png';
import ZoomableImage from '../../ZoomableImage/ZoomableImage';

const TableProduct = ({
    productData,
    getProducts,
    loadingProduct,
    setLoadingProduct,
    handleTabChange,
    setEditDataProduct,
    setEditDataCategories,
}) => {
    const httpService = new HttpService();

    console.log(productData);

    const BACK_HOST = import.meta.env.VITE_BACK_HOST;

    useEffect(() => {
        getProducts();
        setEditDataProduct({ edit: false, productToEdit: null });
        setEditDataCategories({ edit: false, categorieToEdit: null });
    }, []);

    const handleDeleteProduct = async (id) => {
        const confirmDelete = await confirmAlert(
            '¿Está seguro que desea eliminar este producto?',
            'Esta acción no se puede deshacer.',
            'warning'
        );

        if (!confirmDelete) return;

        try {
            setLoadingProduct(true);
            const response = await httpService.deleteData('/product', id);
            if (response.status === 200) {
                successAlert(
                    'Producto eliminado',
                    `El producto ha sido eliminado exitosamente.`
                );
                getProducts();
            } else {
                errorAlert('Error', 'No se pudo eliminar el producto');
            }
        } catch (error) {
            console.error('Error deleting categoría', error);
            errorAlert('Error', 'No se pudo eliminar el producto');
        } finally {
            setLoadingProduct(false);
        }
    };

    return (
        <div className="table_container">
            <table className="table table-striped table-hover">
                <thead>
                    <tr>
                        <th>Acciones</th>
                        <th>Categoría</th>
                        <th>Nombre</th>
                        <th>Código</th>
                        <th>Precio de compra</th>
                        <th>Precio de venta</th>
                        <th>Perecedero</th>
                        <th>Imagen</th>
                        <th>Última modificación</th>
                    </tr>
                </thead>
                <tbody>
                    {!loadingProduct &&
                        productData &&
                        productData.length > 0 &&
                        productData.map((u, index) => (
                            <tr key={index}>
                                <td>
                                    <button
                                        className="btn btn-sm btn-primary me-2"
                                        onClick={() => {
                                            handleTabChange('crear_producto');
                                            setEditDataProduct({
                                                edit: true,
                                                productToEdit: u,
                                            });
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
                                        onClick={() =>
                                            handleDeleteProduct(u.id)
                                        }
                                    >
                                        <DeleteIcon
                                            width={20}
                                            height={20}
                                            fill="#fff"
                                        />
                                    </button>
                                </td>
                                <td>{u.category?.name || 'No disponible'}</td>
                                <td>{u.name || 'No disponible'}</td>
                                <td>{u.code || 'No disponible'}</td>
                                <td>{u.purchasePrice || 'No disponible'}</td>
                                <td>{u.salePrice || 'No disponible'}</td>
                                <td>{u.perishable === true ? 'Si' : 'No'}</td>
                                <td>
                                    <ZoomableImage
                                        src={
                                        u.image
                                            ? `${BACK_HOST}/${u.image}`
                                            : productDefaultImg
                                        }
                                        alt="Producto"
                                        thumbnailWidth={50}
                                        thumbnailHeight={50}
                                    />
                                    </td>
                                <td>
                                    {u.updatedAt.split('T')[0] ||
                                        'No disponible'}
                                </td>
                            </tr>
                        ))}
                </tbody>
            </table>
            {loadingProduct && (
                <div className="spinner_container">
                    <Spinner color="#6564d8" />
                </div>
            )}
        </div>
    );
};

export default TableProduct;
