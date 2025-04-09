import React, { useEffect, useState } from 'react';
import { errorAlert, successAlert } from '../../../helpers/alerts';
import HttpService from '../../../services/HttpService';
import Spinner from '../../spinner/Spinner';
import './FormProduct.scss'

const FormProduct = ({
    editDataProduct,
    setEditDataProduct,
    handleTabChange,
    categoriesData,
    getProducts,
    getCategories,
    setEditDataCategories
}) => {

    useEffect(() => {
        setEditDataCategories({ edit: false, categorieToEdit: null, });
        getCategories()
    }, [])

    const httpService = new HttpService();
    const [loading, setLoading] = useState(false);

    const [product, setProduct] = useState({
        name: '',
        code: '',
        categoryId: '',
        purchasePrice: '',
        salePrice: '',
        perishable: false,
        image: null,
    });

    useEffect(() => {
        if (editDataProduct.edit && editDataProduct.productToEdit) {
            const {
                name,
                code,
                categoryId,
                purchasePrice,
                salePrice,
                perishable,
            } = editDataProduct.productToEdit;
            setProduct({
                name,
                code,
                categoryId,
                purchasePrice,
                salePrice,
                perishable,
                image: null,
            });
        }
    }, [editDataProduct]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setProduct((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleImageChange = (e) => {
        setProduct((prev) => ({
            ...prev,
            image: e.target.files[0],
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { name, code, categoryId, purchasePrice, salePrice } = product;

        if (!name || !code || !categoryId || !purchasePrice || !salePrice) {
            return errorAlert('Error', 'Por favor, completa todos los campos.');
        }

        const formData = new FormData();

        // Agrega manualmente el archivo con la key "productImage"
        if (product.image) {
            formData.append('productImage', product.image);
        }
        
        // Agrega el resto de los campos
        formData.append('name', product.name);
        formData.append('code', product.code);
        formData.append('categoryId', product.categoryId);
        formData.append('purchasePrice', product.purchasePrice);
        formData.append('salePrice', product.salePrice);
        formData.append('perishable', product.perishable);

        setLoading(true);
        try {
            let response;
            if (editDataProduct.edit) {
                response = await httpService.putFormData(
                    '/product',
                    editDataProduct.productToEdit.id,
                    formData
                );
            } else {
                response = await httpService.postFormData('/product', formData);
            }

            if (response.status === 201 || response.status === 200) {
                successAlert(
                    editDataProduct.edit
                        ? 'Producto actualizado'
                        : 'Producto creado',
                    `El producto ha sido ${
                        editDataProduct.edit ? 'actualizado' : 'creado'
                    } exitosamente.`
                );
                setEditDataProduct({ edit: false, productToEdit: null });
                handleTabChange('productos');
                getProducts();
            } else {
                errorAlert('Error', 'Algo salió mal al guardar el producto');
            }
        } catch (error) {
            console.error('Error guardando producto:', error);
            errorAlert('Error', 'Hubo un problema al guardar el producto');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form_main_container">
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Nombre</label>
                    <input
                        type="text"
                        className="form-control"
                        name="name"
                        value={product.name}
                        onChange={handleChange}
                        required
                        placeholder='Nombre del producto'
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Código</label>
                    <input
                        type="text"
                        className="form-control"
                        name="code"
                        value={product.code}
                        onChange={handleChange}
                        required
                        placeholder='XXXXX'
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Categoría</label>
                    <select
                        className="form-select"
                        name="categoryId"
                        value={product.categoryId}
                        onChange={handleChange}
                        required
                    >
                        <option value="" disabled>Selecciona una categoría</option>
                        {categoriesData.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-3">
                    <label className="form-label">Precio de compra</label>
                    <input
                        type="number"
                        className="form-control"
                        name="purchasePrice"
                        value={product.purchasePrice}
                        onChange={handleChange}
                        required
                        placeholder='Cunto le costo a la tienda'
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Precio de venta</label>
                    <input
                        type="number"
                        className="form-control"
                        name="salePrice"
                        value={product.salePrice}
                        onChange={handleChange}
                        required
                        placeholder='En cuanto se vende al cliente'
                    />
                </div>

                <div className="mb-3 form-check">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        name="perishable"
                        checked={product.perishable}
                        onChange={handleChange}
                    />
                    <label className="form-check-label">¿Es perecedero?</label>
                </div>

                <div className="mb-3">
                    <label className="form-label">Imagen</label>
                    <input
                        type="file"
                        className="form-control"
                        name="productImage"
                        accept="image/*"
                        onChange={handleImageChange}
                    />
                </div>

                {!loading ? (
                    <button type="submit" className="btn_submit">
                        {editDataProduct.edit
                            ? 'Actualizar producto'
                            : 'Crear producto'}
                    </button>
                ) : (
                    <div className="d-flex justify-content-center align-items-center mt-4">
                        <Spinner color="#6564d8" />
                    </div>
                )}
            </form>
        </div>
    );
};

export default FormProduct;
