import React, { useEffect, useState } from 'react';
import HttpService from '../../../services/HttpService';
import {
    confirmAlert,
    errorAlert,
    successAlert,
    warningAlert,
} from '../../../helpers/alerts';
import Search from '../../../components/stock/buscador/Search.jsx';
import DetalleProducto from '../../../components/stock/detalle/DetalleProducto.jsx';
import useStore from '../../../store/useStore.js';
import './Stock.scss';
import Modal from '../../../components/modal/Modal.jsx';
import StockTable from '../../../components/stock/stockTable/StockTable.jsx';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

// const mockStores = [
//   { id: 1, name: 'Tienda Centro' },
//   { id: 2, name: 'Tienda Norte' },
// ];

const Stock = () => {
    const httpService = new HttpService();
    const selectedStore = useStore((state) => state.selectedStore);

    // Estados para los productos y la selección
    const [productData, setProductData] = useState([]);
    const [loadingProducts, setLoadingProducts] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    // const [mockStores, setMockStores] = useState([]); //* Descomentar para obtener las tiendas desde el backend
    const setSelectedStore = useStore((state) => state.setSelectedStore);
    const [loaddingButtonStock, setLoadingButtonStock] = useState(false);

    // Estado para el término de búsqueda
    const [searchTerm, setSearchTerm] = useState('');

    // Estados para el formulario de agregar stock
    const [quantity, setQuantity] = useState(1);
    const [expirationDates, setExpirationDates] = useState(['']);

    // Estados para el modal de stock
    const [showModal, setShowModal] = useState(false);
    const [stockUnits, setStockUnits] = useState([]);
    const [selectedStockIds, setSelectedStockIds] = useState([]);

    console.log('selectedStockIds:', selectedStockIds);
    console.log('stockUnits:', stockUnits);

    useEffect(() => {
        getProducts();
        // getStores(); //* Descomentar para obtener las tiendas desde el backend
    }, []);

    useEffect(() => {
        getProducts();
    }, [selectedStore]);

    const getProducts = async () => {
        setSelectedProduct(null);
        setQuantity(1);
        setExpirationDates(['']);
        setSelectedStockIds([]);

        try {
            setLoadingProducts(true);
            const response = await httpService.getData(
                `/product?storeId=${selectedStore}`
            );
            if (response.status === 200) {
                setProductData(response.data || []);
            } else {
                errorAlert('Error', 'No se pudo obtener la lista de productos');
            }
        } catch (error) {
            console.error('Error fetching products:', error);
            errorAlert('Error', 'No se pudo obtener la lista de productos');
        } finally {
            setLoadingProducts(false);
        }
    };

    // Filtramos los productos por nombre o código, sin importar mayúsculas/minúsculas
    const filteredProducts = productData.filter((prod) => {
        const term = searchTerm.toLowerCase();
        return (
            prod.name.toLowerCase().includes(term) ||
            prod.code.toLowerCase().includes(term) ||
            prod.category.name.toLowerCase().includes(term)
        );
    });

    // Al seleccionar un producto, lo establecemos y reiniciamos cantidad y fechas
    const handleSelectProduct = (product) => {
        setSelectedProduct(product);
        setQuantity(1);
        setExpirationDates(['']);
    };

    // Maneja el cambio de cantidad, asegurando mínimo 1; si es perecedero, ajusta el array de fechas.
    const handleQuantityChange = (newQty) => {
        const newQuantity = Math.max(1, newQty);
        setQuantity(newQuantity);
        if (selectedProduct?.perishable) {
            const dates = Array(newQuantity)
                .fill('')
                .map((_, i) => expirationDates[i] || '');
            setExpirationDates(dates);
        }
    };

    // Actualiza la fecha de vencimiento en la posición indicada
    const handleDateChange = (index, value) => {
        const newDates = [...expirationDates];
        newDates[index] = value;
        setExpirationDates(newDates);
    };

    // Envía el payload para crear stock y actualiza la lista de productos
    const handleCreateStock = async (payload) => {
        try {
            const response = await httpService.postData('/stock', payload);
            if (response.status === 201) {
                successAlert('Éxito', 'Stock creado exitosamente');
                setSelectedProduct(null);
                setQuantity(1);
                setExpirationDates(['']);
                getProducts();
            } else {
                errorAlert('Error', 'No se pudo crear el stock');
            }
        } catch (error) {
            console.error('Error al crear stock:', error);
            errorAlert('Error', 'No se pudo crear el stock');
        }
    };

    // Función para simular el envío del formulario de crear stock
    const simulateCreateStock = () => {
        // Para productos perecederos, se puede validar que se hayan ingresado todas las fechas
        if (selectedProduct?.perishable) {
            if (
                !expirationDates ||
                expirationDates.length < quantity ||
                expirationDates.some((date) => !date || date.trim() === '')
            ) {
                console.error(
                    'Error: El producto perecedero requiere fechas de vencimiento para cada unidad.'
                );
                alert(
                    'Debe ingresar todas las fechas de vencimiento para el producto perecedero.'
                );
                return;
            }
        }

        const payload = {
            productId: selectedProduct.id,
            storeId: selectedStore,
            quantity,
            ...(selectedProduct.perishable && { expirationDates }),
        };
        console.log('Simulación de envío de stock:', payload);
        // Llamar a handleCreateStock con el payload
        handleCreateStock(payload);
    };

    // Abrir el modal y obtener el stock para el producto seleccionado y la tienda actual
    const openStockModal = async () => {
        console.log('Abrir modal de stock para el producto:', selectedProduct);
        console.log('Tienda seleccionada:', selectedStore);

        if (!selectedProduct) {
            errorAlert('Error', 'Seleccione un producto para ver el stock');
            return;
        }
        try {
            setLoadingButtonStock(true);
            const response = await httpService.getData(
                `/stock/${selectedProduct.id}/stockunits?storeId=${selectedStore}`
            );
            if (response.status === 200) {
                console.log('Stock units:', response.data);
                setStockUnits(response.data);
                setSelectedStockIds([]); // resetear selección
                setShowModal(true);
            } else {
                errorAlert('Error', 'No se pudo obtener el stock');
            }
        } catch (error) {
            console.error('Error fetching stock units:', error);
            errorAlert('Error', 'No se pudo obtener el stock');
        } finally {
            setLoadingButtonStock(false);
        }
    };

    // Manejar la selección de un checkbox en la tabla de stock
    const toggleStockSelection = (stockId) => {
        if (selectedStockIds.includes(stockId)) {
            setSelectedStockIds(
                selectedStockIds.filter((id) => id !== stockId)
            );
        } else {
            setSelectedStockIds([...selectedStockIds, stockId]);
        }
    };

    // // Función para borrar las stock units seleccionadas
    const handleBulkDelete = async () => {
        if (selectedStockIds.length === 0) {
            warningAlert(
                'Advertencia',
                'Seleccione al menos una unidad de stock para eliminar'
            );
            return;
        }

        const confirm = await confirmAlert(
            'Confirmar acción',
            `¿Está seguro de que desea eliminar las unidades de stock seleccionadas?`,
            'warning'
        );
        if (!confirm) return;

        try {
            const response = await httpService.deleteDataWithBody('/stock', {
                ids: selectedStockIds,
            });
            if (response.status === 200) {
                successAlert(
                    'Éxito',
                    'Unidades de stock eliminadas exitosamente'
                );
                getProducts(); // Refrescar la lista de productos
            } else {
                errorAlert(
                    'Error',
                    'No se pudo eliminar las unidades de stock'
                );
            }
        } catch (error) {
            console.error('Error al eliminar stock units:', error);
            errorAlert('Error', 'No se pudo eliminar las unidades de stock');
        } finally {
            setShowModal(false);
        }
    };

    const handleExportStock = () => {
        // 1) Prepara las filas
        const rows = [];
        console.log(filteredProducts)

        filteredProducts.forEach(prod => {
              rows.push({
                Nombre:       prod.name,
                Categoria:   prod.category.name || 'Sin categoría',
                Codigo:     prod.code,
                Incl_Impuesto: prod.hasTax ? "Si" : "No",
                Perecedero:     prod.perishable ? "Si" : "No",
                Precio_Compra:     prod.purchasePrice,
                Precio_Venta:     prod.salePrice,
                Stock: prod.stockunit.length
              });

          });

          // 2) Crea la hoja y el libro
        const worksheet = XLSX.utils.json_to_sheet(rows, {
        header: ['Nombre','Categoria','Codigo','Incl_Impuesto','Perecedero','Precio_Compra','Precio_Venta','Stock']
        });

        const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Stock');

            // 3) Genera el buffer y dispara la descarga
            const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
            const blob = new Blob([wbout], { type: 'application/octet-stream' });
            saveAs(blob, `stock_${new Date().toISOString().slice(0,10)}.xlsx`);
    }

    return (
        <div className="container-fluid mt-4 main_container">
            <h1 className="text-center  mb-5">Gestión de Stock</h1>

            <button
            className="btn btn-success exportar_btn"
            onClick={handleExportStock}
            >
            Exportar Stock
            </button>

            <div className="row">
                {/* Panel izquierdo: Lista de productos */}
                <Search
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    loadingProducts={loadingProducts}
                    filteredProducts={filteredProducts}
                    selectedProduct={selectedProduct}
                    handleSelectProduct={handleSelectProduct}
                    openStockModal={openStockModal}
                    loadingButtonStock={loaddingButtonStock}
                />
                {/* Panel derecho: Detalle completo del producto y formulario de stock */}
                <DetalleProducto
                    selectedProduct={selectedProduct}
                    quantity={quantity}
                    expirationDates={expirationDates}
                    handleCreateStock={simulateCreateStock}
                    handleQuantityChange={handleQuantityChange}
                    handleDateChange={handleDateChange}
                />
            </div>

            <Modal
                show={showModal}
                onClose={() => setShowModal(false)}
                title="Gestionar Stock"
            >
                <StockTable
                    stockUnits={stockUnits}
                    selectedStockIds={selectedStockIds}
                    setSelectedStockIds={setSelectedStockIds}
                    toggleStockSelection={toggleStockSelection}
                />
                <div className="modal-footer">
                    {selectedStockIds.length > 0 && (
                        <span className="selected-count fw-bold me-auto">
                            {selectedStockIds.length} seleccionados
                        </span>
                    )}
                    <button
                        className="btn btn-danger"
                        onClick={handleBulkDelete}
                    >
                        Eliminar Seleccionados
                    </button>
                </div>
            </Modal>
        </div>
    );
};

export default Stock;
