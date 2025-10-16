import React, { useState, useEffect, useRef } from 'react';
import JsBarcode from 'jsbarcode';
import { errorAlert, successAlert } from '../../helpers/alerts';
import useStore from '../../store/useStore';
import './BarcodePrinter.scss';
import HttpService from '../../services/HttpService';

const BarcodePrinter = () => {
    const [productData, setProductData] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [printPreview, setPrintPreview] = useState(false);
    
    const httpService = new HttpService();
    const selectedStore = useStore((state) => state.selectedStore);
    const printRef = useRef();

    useEffect(() => {
        fetchProducts();
    }, [selectedStore]);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const response = await httpService.getData(`/product?storeId=${selectedStore}`);
            if (response.status === 200) {
                // Solo productos que tienen código de barras
                const productsWithBarcode = response.data.filter(product => product.barcode);
                setProductData(productsWithBarcode);
            } else {
                errorAlert('Error', 'No se pudo obtener la lista de productos');
            }
        } catch (error) {
            console.error('Error fetching products:', error);
            errorAlert('Error', 'No se pudo obtener la lista de productos');
        } finally {
            setLoading(false);
        }
    };

    const filteredProducts = productData.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.barcode && product.barcode.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const handleProductSelect = (product, quantity = 1) => {
        const existingIndex = selectedProducts.findIndex(p => p.id === product.id);
        
        if (existingIndex !== -1) {
            // Si ya existe, actualizar cantidad
            const updated = [...selectedProducts];
            updated[existingIndex].quantity = quantity;
            setSelectedProducts(updated);
        } else {
            // Si no existe, agregar nuevo
            setSelectedProducts(prev => [...prev, { ...product, quantity }]);
        }
    };

    const handleQuantityChange = (productId, quantity) => {
        if (quantity <= 0) {
            // Remover si cantidad es 0 o menor
            setSelectedProducts(prev => prev.filter(p => p.id !== productId));
        } else {
            // Actualizar cantidad
            setSelectedProducts(prev => 
                prev.map(p => p.id === productId ? { ...p, quantity } : p)
            );
        }
    };

    const removeProduct = (productId) => {
        setSelectedProducts(prev => prev.filter(p => p.id !== productId));
    };

    const generateBarcodes = () => {
        setPrintPreview(true);
        
        // Esperar a que el DOM se actualice y luego generar los códigos de barras
        setTimeout(() => {
            selectedProducts.forEach((product, productIndex) => {
                for (let i = 0; i < product.quantity; i++) {
                    const canvasId = `barcode-${productIndex}-${i}`;
                    const canvas = document.getElementById(canvasId);
                    if (canvas) {
                        JsBarcode(canvas, product.barcode, {
                            format: "CODE128",
                            width: 2,
                            height: 60,
                            displayValue: true,
                            fontSize: 12,
                            margin: 5
                        });
                    }
                }
            });
        }, 100);
    };

    const handlePrint = () => {
        if (selectedProducts.length === 0) {
            errorAlert('Error', 'Selecciona al menos un producto para imprimir');
            return;
        }

        generateBarcodes();
        
        // Esperar a que se generen los códigos de barras y luego imprimir
        setTimeout(() => {
            window.print();
        }, 500);
    };

    const clearSelection = () => {
        setSelectedProducts([]);
        setPrintPreview(false);
    };

    return (
        <div className="barcode-printer">
            <div className="header">
                <h2>🖨️ Impresión de Códigos de Barras</h2>
                <p>Selecciona los productos para imprimir sus códigos de barras</p>
            </div>

            {!printPreview ? (
                <div className="selection-area">
                    {/* Buscador */}
                    <div className="search-section">
                        <div className="input-group mb-3">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Buscar productos por nombre, código o código de barras..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="row">
                        {/* Lista de productos disponibles */}
                        <div className="col-md-6">
                            <h4>Productos Disponibles</h4>
                            <div className="products-list">
                                {loading ? (
                                    <div className="text-center">
                                        <div className="spinner-border" role="status">
                                            <span className="visually-hidden">Cargando...</span>
                                        </div>
                                    </div>
                                ) : filteredProducts.length === 0 ? (
                                    <div className="alert alert-info">
                                        No hay productos con código de barras disponibles
                                    </div>
                                ) : (
                                    filteredProducts.map(product => (
                                        <div key={product.id} className="product-item">
                                            <div className="product-info">
                                                <h6>{product.name}</h6>
                                                <small>Código: {product.code}</small>
                                                <br />
                                                <small>Barcode: {product.barcode}</small>
                                            </div>
                                            <div className="product-actions">
                                                <input
                                                    type="number"
                                                    min="1"
                                                    max="50"
                                                    defaultValue="1"
                                                    className="form-control quantity-input"
                                                    id={`qty-${product.id}`}
                                                />
                                                <button
                                                    className="btn btn-primary btn-sm"
                                                    onClick={() => {
                                                        const qty = parseInt(document.getElementById(`qty-${product.id}`).value);
                                                        handleProductSelect(product, qty);
                                                    }}
                                                >
                                                    Agregar
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Productos seleccionados */}
                        <div className="col-md-6">
                            <h4>Productos Seleccionados</h4>
                            <div className="selected-products">
                                {selectedProducts.length === 0 ? (
                                    <div className="alert alert-secondary">
                                        No hay productos seleccionados
                                    </div>
                                ) : (
                                    selectedProducts.map(product => (
                                        <div key={product.id} className="selected-item">
                                            <div className="item-info">
                                                <h6>{product.name}</h6>
                                                <small>{product.barcode}</small>
                                            </div>
                                            <div className="item-controls">
                                                <input
                                                    type="number"
                                                    min="1"
                                                    max="50"
                                                    value={product.quantity}
                                                    onChange={(e) => handleQuantityChange(product.id, parseInt(e.target.value))}
                                                    className="form-control quantity-input"
                                                />
                                                <button
                                                    className="btn btn-danger btn-sm"
                                                    onClick={() => removeProduct(product.id)}
                                                >
                                                    ❌
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            {selectedProducts.length > 0 && (
                                <div className="actions">
                                    <button
                                        className="btn btn-success"
                                        onClick={() => generateBarcodes()}
                                    >
                                        📋 Vista Previa
                                    </button>
                                    <button
                                        className="btn btn-primary"
                                        onClick={handlePrint}
                                    >
                                        🖨️ Imprimir
                                    </button>
                                    <button
                                        className="btn btn-secondary"
                                        onClick={clearSelection}
                                    >
                                        🗑️ Limpiar
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                /* Vista previa de impresión */
                <div className="preview-area">
                    <div className="preview-actions no-print">
                        <button
                            className="btn btn-primary"
                            onClick={handlePrint}
                        >
                            🖨️ Imprimir
                        </button>
                        <button
                            className="btn btn-secondary"
                            onClick={() => setPrintPreview(false)}
                        >
                            ← Volver a editar
                        </button>
                    </div>
                    
                    <div ref={printRef} className="print-content">
                        <div className="barcodes-grid">
                            {selectedProducts.map((product, productIndex) => 
                                Array.from({ length: product.quantity }, (_, i) => (
                                    <div key={`${product.id}-${i}`} className="barcode-label">
                                        <div className="product-name">{product.name}</div>
                                        <canvas id={`barcode-${productIndex}-${i}`}></canvas>
                                        <div className="product-code">Código: {product.code}</div>
                                        <div className="product-price">${product.salePrice}</div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BarcodePrinter;
