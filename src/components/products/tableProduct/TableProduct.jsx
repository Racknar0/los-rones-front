// src/components/products/tableProduct/TableProduct.jsx
import React, { useEffect, useState } from 'react';
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
import useStore from '../../../store/useStore';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

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
  const BACK_HOST = import.meta.env.VITE_BACK_HOST;
  const { role } = useStore((state) => state.jwtData);

  // NUEVO estado para filtro de búsqueda
  const [searchTerm, setSearchTerm] = useState('');

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
      console.error('Error deleting producto', error);
      errorAlert('Error', 'No se pudo eliminar el producto');
    } finally {
      setLoadingProduct(false);
    }
  };

  // ----------------------------------------------------
  // Filtrar productos según searchTerm (categoría, nombre, código o código de barras)
  // ----------------------------------------------------
  const filteredProducts = (productData || []).filter((u) => {
    const term = searchTerm.trim().toLowerCase();
    if (term === '') return true;
    return (
      u.category?.name.toLowerCase().includes(term) ||
      u.name.toLowerCase().includes(term) ||
      u.code.toLowerCase().includes(term) ||
      (u.barcode && u.barcode.toLowerCase().includes(term))
    );
  });

  // ----------------------------------------------------
  // Exportar productos filtrados a Excel
  // ----------------------------------------------------
  const exportarProductos = () => {
    // 1) Preparar filas
    const rows = filteredProducts.map((u) => ({
      Categoría:  u.category?.name || '',
      Nombre:     u.name || '',
      Código:     u.code || '',
      'Código de Barras': u.barcode || '',
      'Precio Compra': u.purchasePrice != null ? u.purchasePrice : '',
      'Precio Venta':  u.salePrice != null ? u.salePrice : '',
      Perecedero: u.perishable === true ? 'Sí' : 'No',
      'Tiene Impuesto': u.hasTax === true ? 'Sí' : 'No',
    }));

    // 2) Crear hoja y libro
    const worksheet = XLSX.utils.json_to_sheet(rows, {
      header: [
        'Categoría',
        'Nombre',
        'Código',
        'Precio Compra',
        'Precio Venta',
        'Perecedero',
        'Tiene Impuesto',
      ],
    });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Productos');

    // 3) Generar buffer y disparar descarga
    const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { type: 'application/octet-stream' });
    const fileName = `productos_${new Date().toISOString().slice(0, 10)}.xlsx`;
    saveAs(blob, fileName);
  };

  return (
    <div className="table_container">
      <h2 className="mb-3">Lista de Productos</h2>

      {/* ———————– FILTRO Y BOTÓN DE EXPORTAR ———————– */}
      <div className="row mb-3  d-flex flex-column">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control form_buscador"
            placeholder="🔎 Buscar por categoría, nombre, código o código de barras..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <button
            className="btn btn-success  btn-exportar"
            onClick={exportarProductos}
            disabled={filteredProducts.length === 0}
          >
            Exportar Productos
          </button>
        </div>
      </div>

      {/* ———————– TABLA DE PRODUCTOS ———————– */}
      <table className="table table-striped table-hover">
        <thead>
          <tr>
            {['Admin', 'Moderador'].includes(role) && <th>Acciones</th>}
            <th>Categoría</th>
            <th>Nombre</th>
            <th>Código</th>
            <th>Código de Barras</th>
            {['Admin', 'Moderador'].includes(role) && <th>$ Compra</th>}
            <th>$ Venta</th>
            <th>Perecedero</th>
            <th>I. Impuesto</th>
            <th>Imagen</th>
          </tr>
        </thead>
        <tbody>
          {loadingProduct ? (
            <tr>
              <td colSpan="9" className="text-center py-4">
                <Spinner color="#6564d8" />
              </td>
            </tr>
          ) : filteredProducts.length === 0 ? (
            <tr>
              <td colSpan="9" className="text-center py-4">
                No hay productos que coincidan con el filtro.
              </td>
            </tr>
          ) : (
            filteredProducts.map((u, index) => (
              <tr key={index}>
                {['Admin', 'Moderador'].includes(role) && (
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
                      <EditIcon width={20} height={20} fill="#fff" />
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDeleteProduct(u.id)}
                    >
                      <DeleteIcon width={20} height={20} fill="#fff" />
                    </button>
                  </td>
                )}
                <td>{u.category?.name || 'No disponible'}</td>
                <td>{u.name || 'No disponible'}</td>
                <td>{u.code || 'No disponible'}</td>
                <td>
                  {u.barcode ? (
                    <span className="badge bg-secondary" style={{ fontFamily: 'monospace' }}>
                      {u.barcode}
                    </span>
                  ) : (
                    <span className="text-muted">Sin código</span>
                  )}
                </td>
                {['Admin', 'Moderador'].includes(role) && (
                  <td>{u.purchasePrice ?? 'No disponible'}</td>
                )}
                <td>{u.salePrice ?? 'No disponible'}</td>
                <td>{u.perishable === true ? 'Sí' : 'No'}</td>
                <td>{u.hasTax === true ? 'Sí' : 'No'}</td>
                <td>
                  <ZoomableImage
                    src={u.image ? `${BACK_HOST}/${u.image}` : productDefaultImg}
                    alt="Producto"
                    thumbnailWidth={50}
                    thumbnailHeight={50}
                  />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TableProduct;
