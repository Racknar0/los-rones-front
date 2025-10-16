import React, { useState, useRef, useEffect } from 'react';
import { errorAlert, successAlert } from '../../../helpers/alerts';
import HttpService from '../../../services/HttpService';
import useStore from '../../../store/useStore';
import './BarcodeScanner.scss';

const BarcodeScanner = ({ onProductFound, productData, setProductData }) => {
    const [barcode, setBarcode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const inputRef = useRef(null);
    const httpService = new HttpService();
    const selectedStore = useStore((state) => state.selectedStore);

    // Auto-focus al montar el componente
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!barcode.trim()) {
            errorAlert('Error', 'Por favor ingresa un código de barras');
            return;
        }
        await searchByBarcode(barcode.trim());
    };

    const searchByBarcode = async (barcodeValue) => {
        setIsLoading(true);
        try {
            const response = await httpService.getData(`/product/barcode/${barcodeValue}?storeId=${selectedStore}`);
            
            if (response.status === 200) {
                const product = response.data;
                
                // Verificar si el producto tiene stock
                if (!product.stockunit || product.stockunit.length === 0) {
                    errorAlert('Sin stock', 'El producto no tiene unidades disponibles en esta tienda');
                    return;
                }

                // Llamar a la función para agregar el producto al carrito
                onProductFound(product);
                setBarcode(''); // Limpiar el campo
                successAlert('¡Encontrado!', `Producto: ${product.name}`);
                
            } else {
                errorAlert('No encontrado', 'No se encontró ningún producto con ese código de barras');
            }
        } catch (error) {
            console.error('Error al buscar producto:', error);
            const message = error.response?.data?.message || 'Error al buscar el producto';
            errorAlert('Error', message);
        } finally {
            setIsLoading(false);
            // Mantener el foco en el input para escaneos rápidos
            if (inputRef.current) {
                inputRef.current.focus();
            }
        }
    };

    // Función para escaneo rápido (cuando se presiona Enter)
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    return (
        <div className="barcode-scanner">
            <div className="scanner-header">
                <h5>🔍 Escáner de Código de Barras</h5>
                <p className="text-muted small">
                    Escanea o escribe el código de barras del producto
                </p>
            </div>
            
            <form onSubmit={handleSubmit} className="scanner-form">
                <div className="input-group">
                    <input
                        ref={inputRef}
                        type="text"
                        className="form-control"
                        value={barcode}
                        onChange={(e) => setBarcode(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Código de barras..."
                        disabled={isLoading}
                        autoComplete="off"
                    />
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={isLoading || !barcode.trim()}
                    >
                        {isLoading ? (
                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        ) : (
                            '🔍 Buscar'
                        )}
                    </button>
                </div>
            </form>
            
            <div className="scanner-tips">
                <small className="text-muted">
                    💡 Tip: Usa un lector de códigos de barras USB para escaneo automático
                </small>
            </div>
        </div>
    );
};

export default BarcodeScanner;
