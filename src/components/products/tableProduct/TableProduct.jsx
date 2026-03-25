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
import ExcelJS from 'exceljs';
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
  const exportarProductos = async () => {
    const toNumberOrNull = (value) => {
      const parsed = Number(value);
      return Number.isFinite(parsed) ? parsed : null;
    };

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Productos', {
      views: [{ state: 'frozen', ySplit: 4 }],
    });

    const columns = [
      { header: 'Categoria', key: 'categoria', width: 22 },
      { header: 'Nombre', key: 'nombre', width: 36 },
      { header: 'Codigo', key: 'codigo', width: 18 },
      { header: 'Codigo de Barras', key: 'codigoBarras', width: 22 },
      { header: 'Precio Compra', key: 'precioCompra', width: 15 },
      { header: 'Precio Venta', key: 'precioVenta', width: 15 },
      { header: 'Perecedero', key: 'perecedero', width: 14 },
      { header: 'Tiene Impuesto', key: 'tieneImpuesto', width: 16 },
    ];

    worksheet.columns = columns;

    const todayText = new Date().toLocaleString('es-MX');
    worksheet.mergeCells(1, 1, 1, columns.length);
    worksheet.getCell('A1').value = 'Reporte de Productos';
    worksheet.getCell('A1').font = { bold: true, size: 16, color: { argb: 'FF1F2937' } };
    worksheet.getCell('A1').alignment = { horizontal: 'center', vertical: 'middle' };

    worksheet.mergeCells(2, 1, 2, columns.length);
    worksheet.getCell('A2').value = `Generado: ${todayText}`;
    worksheet.getCell('A2').font = { italic: true, size: 11, color: { argb: 'FF4B5563' } };
    worksheet.getCell('A2').alignment = { horizontal: 'center', vertical: 'middle' };

    worksheet.getRow(4).values = columns.map((c) => c.header);

    filteredProducts.forEach((u) => {
      worksheet.addRow({
        categoria: u.category?.name || '',
        nombre: u.name || '',
        codigo: u.code || '',
        codigoBarras: u.barcode || '',
        precioCompra: toNumberOrNull(u.purchasePrice),
        precioVenta: toNumberOrNull(u.salePrice),
        perecedero: u.perishable === true ? 'Si' : 'No',
        tieneImpuesto: u.hasTax === true ? 'Si' : 'No',
      });
    });

    const headerRow = worksheet.getRow(4);
    headerRow.eachCell((cell) => {
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF374151' },
      };
      cell.alignment = { horizontal: 'left', vertical: 'middle', indent: 1 };
      cell.border = {
        top: { style: 'thin', color: { argb: 'FFD1D5DB' } },
        left: { style: 'thin', color: { argb: 'FFD1D5DB' } },
        bottom: { style: 'thin', color: { argb: 'FFD1D5DB' } },
        right: { style: 'thin', color: { argb: 'FFD1D5DB' } },
      };
    });

    worksheet.autoFilter = {
      from: { row: 4, column: 1 },
      to: { row: 4, column: columns.length },
    };

    for (let rowNumber = 5; rowNumber <= worksheet.rowCount; rowNumber += 1) {
      const row = worksheet.getRow(rowNumber);
      const isEven = rowNumber % 2 === 0;

      row.eachCell((cell) => {
        cell.alignment = { vertical: 'middle' };
        cell.border = {
          top: { style: 'thin', color: { argb: 'FFE5E7EB' } },
          left: { style: 'thin', color: { argb: 'FFE5E7EB' } },
          bottom: { style: 'thin', color: { argb: 'FFE5E7EB' } },
          right: { style: 'thin', color: { argb: 'FFE5E7EB' } },
        };
        if (isEven) {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFF9FAFB' },
          };
        }
      });

      [5, 6].forEach((columnIndex) => {
        const cell = row.getCell(columnIndex);
        if (typeof cell.value === 'number') {
          cell.numFmt = '$#,##0.00';
        }
      });
    }

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
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
