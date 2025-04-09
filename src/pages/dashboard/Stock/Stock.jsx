import React, { useEffect, useState } from 'react';
import HttpService from '../../../services/HttpService';
import { errorAlert } from '../../../helpers/alerts';

const mockStores = [
  { id: 1, name: 'Tienda Centro' },
  { id: 2, name: 'Tienda Norte' },
];

const Stock = () => {
  // Estados para los productos y la selección
  const [productData, setProductData] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Estado para el término de búsqueda
  const [searchTerm, setSearchTerm] = useState('');

  // Estados para el formulario de agregar stock
  const [storeId, setStoreId] = useState('1');
  const [quantity, setQuantity] = useState(1);
  const [expirationDates, setExpirationDates] = useState(['']);

  const httpService = new HttpService();

  useEffect(() => {
    getProducts();
  }, []);

  const getProducts = async () => {
    try {
      setLoadingProducts(true);
      const response = await httpService.getData('/product');
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
  const handleCreateStock = () => {
    const payload = {
      productId: selectedProduct.id,
      storeId: parseInt(storeId),
      expirationDates: selectedProduct.perishable ? expirationDates : [],
    };
    console.log('📦 Payload para enviar:', payload);
    alert('Stock creado en consola!');
  };

  return (
    <div className="container-fluid mt-4">
      <div className="row">
        {/* Panel izquierdo: Lista de productos */}
        <div className="col-md-4 border-end">
          <h5>📦 Productos</h5>
          <input
            className="form-control mb-2"
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <ul className="list-group">
            {loadingProducts ? (
              <li className="list-group-item">Cargando productos...</li>
            ) : filteredProducts.length ? (
              filteredProducts.map((prod) => (
                <li
                  key={prod.id}
                  className={`list-group-item list-group-item-action ${
                    selectedProduct?.id === prod.id ? 'active' : ''
                  }`}
                  onClick={() => handleSelectProduct(prod)}
                  style={{ cursor: 'pointer' }}
                >
                  {prod.name} - {prod.code}
                </li>
              ))
            ) : (
              <li className="list-group-item">No se encontraron productos</li>
            )}
          </ul>
        </div>

        {/* Panel derecho: Detalle completo del producto y formulario de stock */}
        <div className="col-md-8">
          {selectedProduct ? (
            <div>
              <h5>Detalles del Producto</h5>
              <p>
                <strong>ID:</strong> {selectedProduct.id}
              </p>
              <p>
                <strong>Nombre:</strong> {selectedProduct.name}
              </p>
              <p>
                <strong>Código:</strong> {selectedProduct.code}
              </p>
              <p>
                <strong>Categoría:</strong>{' '}
                {selectedProduct.category?.name || 'Sin categoría'}
              </p>
              <p>
                <strong>Precio de Compra:</strong> {selectedProduct.purchasePrice}
              </p>
              <p>
                <strong>Precio de Venta:</strong> {selectedProduct.salePrice}
              </p>
              <p>
                <strong>Status:</strong> {selectedProduct.status}
              </p>
              <p>
                <strong>Perecedero:</strong> {selectedProduct.perishable ? 'Sí' : 'No'}
              </p>
              <p>
                <strong>Fecha de Creación:</strong>{' '}
                {new Date(selectedProduct.createdAt).toLocaleString()}
              </p>
              <p>
                <strong>Fecha de Actualización:</strong>{' '}
                {new Date(selectedProduct.updatedAt).toLocaleString()}
              </p>
              {selectedProduct.image && (
                <div>
                  <p>
                    <strong>Imagen:</strong>
                  </p>
                  <img
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    style={{ maxWidth: '300px' }}
                  />
                </div>
              )}

              {/* Formulario para agregar stock */}
              <h5 className="mt-4">➕ Agregar al Stock</h5>

              {/* Selector de tienda */}
              <div className="mb-3">
                <label className="form-label">Tienda</label>
                <select
                  className="form-select"
                  value={storeId}
                  onChange={(e) => setStoreId(e.target.value)}
                >
                  {mockStores.map((store) => (
                    <option key={store.id} value={store.id}>
                      {store.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Cantidad a agregar */}
              <div className="mb-3">
                <label className="form-label">Cantidad a agregar</label>
                <div className="d-flex align-items-center">
                  <button
                    className="btn btn-secondary btn-sm me-2"
                    onClick={() => handleQuantityChange(quantity - 1)}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    className="form-control text-center"
                    value={quantity}
                    min={1}
                    style={{ maxWidth: '80px' }}
                    onChange={(e) => handleQuantityChange(parseInt(e.target.value))}
                  />
                  <button
                    className="btn btn-secondary btn-sm ms-2"
                    onClick={() => handleQuantityChange(quantity + 1)}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Fechas de vencimiento si el producto es perecedero */}
              {selectedProduct.perishable && (
                <div className="mb-3">
                  <label className="form-label">Fechas de vencimiento</label>
                  {expirationDates.map((date, i) => (
                    <input
                      key={i}
                      type="date"
                      className="form-control mb-2"
                      value={date}
                      onChange={(e) => handleDateChange(i, e.target.value)}
                    />
                  ))}
                </div>
              )}

              <button className="btn btn-success" onClick={handleCreateStock}>
                Crear unidades de stock
              </button>
            </div>
          ) : (
            <p className="text-muted">
              Selecciona un producto de la izquierda para ver sus detalles y agregar stock.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Stock;
