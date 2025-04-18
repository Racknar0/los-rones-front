import React from 'react'
import Spinner from '../../spinner/Spinner'
import './Search.scss'
import useStore from '../../../store/useStore';

const Search = ({
  searchTerm,
  setSearchTerm,
  loadingProducts,
  filteredProducts,
  selectedProduct,
  handleSelectProduct,
  openStockModal,
  loadingButtonStock
}) => {


  const { role } = useStore((state) => state.jwtData);

  const getStockClass = (stock) => {
    if (!stock?.stockunit || !stock?.stockunit.length) return 'low'; // Si no hay stock
    const quantity = stock?.stockunit?.length; // Cantidad de unidades de stock
    if (quantity >= 10) return 'high';
    if (quantity >= 5) return 'medium';
    return 'low';
  }

  return (
      <div className="col-md-4 border-end buscador_container">
          {
              ['Admin'].includes(role) && (
                  <>
                  {
                    loadingButtonStock ? (
                      <div className='spinner_container_btn'> <Spinner color="#6564d8" /> </div>
                    ) : (
                      <button className="btn_modificar_stock" onClick={() => {openStockModal()}}>
                        🛠️ Modificar Stock
                      </button>
                    )
                  }
                </>
              )
          }
          
          <h5>📦 Listado de productos</h5>
          <input className="form-control mb-2 form_buscador" placeholder="🔎 Buscar..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          <ul className="list-group">
            {loadingProducts ? (
              <div className='spinner_container'> <Spinner color="#6564d8" /> </div>
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
                  <div className='left'>
                    <p className='fw-bold'>{prod.name.charAt(0).toUpperCase() + prod.name.slice(1)}</p>
                    <p className='text'>Código: {prod.code.toUpperCase()}</p>
                    <p>{prod.category.name.charAt(0).toUpperCase() + prod.category.name.slice(1)}</p>
                  </div>
                  <div className='right'>
                    <div className={`color_stock ${getStockClass(prod)}`}>
                    {/* <div className={`color_stock ${getStockClass(prod?.stockunit?.length)}`}> */}
                    </div>
                  </div>
                </li>
              ))
            ) : (
              <li className="list-group-item">No se encontraron productos</li>
            )}
          </ul>
        </div>

  )
}

export default Search