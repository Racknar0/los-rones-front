// Ventas.jsx
import React, { use, useEffect, useState } from 'react';
import HttpService from '../../../services/HttpService';
import { errorAlert } from '../../../helpers/alerts';
import useStore from '../../../store/useStore';
import SaleSearch from '../../../components/ventas/buscador/SaleSearch';
import SalePanel from '../../../components/ventas/panel/SalePanel';
import './Ventas.scss';
import Modal from '../../../components/modal/Modal';
import PlusIcon from '../../../components/icons/PlusIcon';
import ModalPerecedero from '../../../components/ventas/modalPerecedero/ModalPerecedero';

const Ventas = () => {
  const httpService = new HttpService();
  const selectedStore = useStore((s) => s.selectedStore);


  // — estados —
  const [productData, setProductData] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [cartItems, setCartItems]   = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

 // Para darle estilo al ultimo producto agregado al carrito
  const [lastAddedIndex, setLastAddedIndex] = useState(null);

  const totalCompra = useStore((state) => state.totalCompra);
  const setTotalCompra = useStore((state) => state.setTotalCompra);


  useEffect(() => {
     console.log('cartItems useEffect', cartItems);
     
    // Calcular el total de la compra sumando los precios de los productos en el carrito se debe parsear a numero
    const total = cartItems.reduce((acc, item) => {
      const price = parseFloat(item.product.salePrice) || 0; // Asegurarse de que el precio sea un número
      return acc + price;
    }, 0);
    setTotalCompra(total);

  }, [cartItems]);


  // — efecto: recarga al cambiar tienda —
  useEffect(() => {
    fetchProducts();
  }, [selectedStore]);

  const fetchProducts = async () => {
    setCartItems([]); 
    setLoadingProducts(true);
    try {
      const res = await httpService.getData(`/product?storeId=${selectedStore}`);
      if (res.status === 200) setProductData(res.data || []);
      else errorAlert('Error', 'No se pudo obtener la lista de productos');
    } catch {
      errorAlert('Error', 'No se pudo obtener la lista de productos');
    } finally {
      setLoadingProducts(false);
    }
  };

  const filteredProducts = productData.filter(p => {
    const term = searchTerm.toLowerCase();
    return p.name.toLowerCase().includes(term) || p.code.toLowerCase().includes(term);
  });

  // — este es el “handler” que añade el primer stockunit disponible —
  const handleSelectProduct = (product) => {
    if (product.perishable) {
      return handleSelectPerecedero(product);
    }


    // 1) si no hay unidades, nada que hacer
    if (!product.stockunit?.length) {
      return errorAlert('Sin stock', 'No hay unidades disponibles de este producto');
    }
    // 2) tomamos la primera unidad (o la más antigua, etc.)
    const unit = product.stockunit[0];

    // 3) Removemos la unidad del array de unidades
    const updatedStockUnits = product.stockunit.filter((_, index) => index !== 0);

    // 4) Actualizamos el producto con las unidades restantes
    const updatedProduct = { ...product, stockunit: updatedStockUnits };
    
    // 5) Actualizar el productData con el producto actualizado
    const updatedProductData = productData.map(p => p.id === product.id ? updatedProduct : p);
    setProductData(updatedProductData);

    // // 6) Añadir al carrito
    // setCartItems(prev => [...prev, unit]);

    // 6) Añadir al carrito y marcar el índice recién añadido
    setCartItems(prev => {
      const newIndex = prev.length;
        setLastAddedIndex(newIndex);
       // después de 1s, quita el highlight
        setTimeout(() => setLastAddedIndex(null), 100);
        return [...prev, unit];
     });
  
  };

  const handleSelectPerecedero = (product) => {

    if (!product.stockunit?.length) {
      return errorAlert('Sin stock', 'No hay unidades disponibles de este producto');
    }

    //Abrir modal para seleccionar el producto perecedero
    setShowModal(true)
    setSelectedProduct(product); // Guardar el producto perecedero seleccionado
  }


  // — quita del carrito según stockUnitId único —
  const handleRemoveFromCart = (unit) => {
    // Remover el stock unit del carrito
    setCartItems(prev => prev.filter(item => item.id !== unit.id));

    // Añadir el stock unit de vuelta al producto perecedero
    const updatedProductData = productData.map(p => {
      if (p.id === unit.product.id) {
        return {
          ...p,
          stockunit: [...p.stockunit, unit], // Añadir la unidad de vuelta al stock
        };
      }
      return p;
    });
    setProductData(updatedProductData);
  };

  return (
    <div className="container-fluid mt-4 main_container">
      <h1 className="text-center mb-5">Panel de Ventas</h1>
      <div className="row bg-light">
        <SaleSearch
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          loadingProducts={loadingProducts}
          filteredProducts={filteredProducts}
          handleSelectProduct={handleSelectProduct}
        />

        <SalePanel
          cartItems={cartItems}
          onRemoveFromCart={handleRemoveFromCart}
          lastAddedIndex={lastAddedIndex}
        />
      </div>

      {/* Modal para agregar productos perecederos */}
      <Modal show={showModal} onClose={() => setShowModal(false)} title="Agregar producto perecedero">
        <ModalPerecedero
          selectedProduct={selectedProduct}
          setSelectedProduct={setSelectedProduct}
          setProductData={setProductData}
          setShowModal={setShowModal}
          productData={productData}
          setCartItems={setCartItems}
          setLoadingProducts={setLoadingProducts}
          setLastAddedIndex={setLastAddedIndex}

        />
        <div className="modal-footer">
          <button
            className="btn btn-danger"
            onClick={() => {
              // Clear the modal and reset selected product
              setShowModal(false);
              setSelectedProduct(null);
            }}
          >
            Cerrar
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Ventas;
