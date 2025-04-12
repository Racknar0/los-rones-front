import React, { useEffect, useState } from 'react';
import HttpService from '../../../services/HttpService';
import { errorAlert, successAlert } from '../../../helpers/alerts';
import Buscador from '../../../components/stock/buscador/Buscador.jsx';
import DetalleProducto from '../../../components/stock/detalle/DetalleProducto.jsx';
import useStore from '../../../store/useStore.js';


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

  // Estado para el término de búsqueda
  const [searchTerm, setSearchTerm] = useState('');

  // Estados para el formulario de agregar stock
  const [storeId, setStoreId] = useState('1');
  const [quantity, setQuantity] = useState(1);
  const [expirationDates, setExpirationDates] = useState(['']);

  

  useEffect(() => {
    getProducts();
    // getStores(); //* Descomentar para obtener las tiendas desde el backend
  }, []);

  useEffect(() => {
    getProducts();
    setSelectedProduct(null);
        setQuantity(1);
        setExpirationDates(['']);
  }, [selectedStore]);

  const getProducts = async () => {
    try {
      setLoadingProducts(true);
      const response = await httpService.getData(`/product?storeId=${selectedStore}`);
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

  //* Descomentar para obtener las tiendas desde el backend
  // const getStores = async () => {
  //   try {
  //     const response = await httpService.getData('/stores');
  //     if (response.status === 200) {
  //       setMockStores(response.data || []);

  //     } else {
  //       errorAlert('Error', 'No se pudo obtener la lista de tiendas');
  //     }
  //   } catch (error) {
  //     console.error('Error fetching stores:', error);
  //     errorAlert('Error', 'No se pudo obtener la lista de tiendas');
  //   }
  // }

  // Filtramos los productos por nombre o código, sin importar mayúsculas/minúsculas
  const filteredProducts = productData.filter((prod) => {
    const term = searchTerm.toLowerCase();
    return (
      prod.name.toLowerCase().includes(term) ||
      prod.code.toLowerCase().includes(term)
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

  // Muestra en consola el payload que se enviaría
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

  return (
    <div className="container-fluid mt-4">
      <div className="row">
        {/* Panel izquierdo: Lista de productos */}
        <Buscador
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          loadingProducts={loadingProducts}
          filteredProducts={filteredProducts}
          selectedProduct={selectedProduct}
          handleSelectProduct={handleSelectProduct}
        />
        {/* Panel derecho: Detalle completo del producto y formulario de stock */}
        <DetalleProducto 
          selectedProduct={selectedProduct}
          storeId={storeId}
          quantity={quantity}
          expirationDates={expirationDates}
          handleCreateStock={handleCreateStock}
          handleQuantityChange={handleQuantityChange}
          handleDateChange={handleDateChange}
          // mockStores={mockStores} //* Descomentar para obtener las tiendas desde el backend
          setStoreId={setStoreId}
        />
      </div>
    </div>
  );
};

export default Stock;
