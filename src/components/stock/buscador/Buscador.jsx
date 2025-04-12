import React from 'react'
import Spinner from '../../spinner/Spinner'
import './Buscador.scss'

const Buscador = ({
  searchTerm,
  setSearchTerm,
  loadingProducts,
  filteredProducts,
  selectedProduct,
  handleSelectProduct,
}) => {


  const getStockClass = (quantity) => {
    if (quantity >= 10) return 'high';
    if (quantity >= 5) return 'medium';
    return 'low';
  }

  return (
      <div className="col-md-4 border-end buscador_container">
          <h5>📦 Listado de productos</h5>
          <input className="form-control mb-2 form_buscador" placeholder="Buscar..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
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
                    <div className={`color_stock ${getStockClass(prod.stockUnits.length)}`}>
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

export default Buscador