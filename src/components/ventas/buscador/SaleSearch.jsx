import React from 'react'
import Spinner from '../../spinner/Spinner'
import './SaleSearch.scss'
import useStore from '../../../store/useStore';
import PlusIcon from '../../icons/PlusIcon';

const SaleSearch = ({
  searchTerm,
  setSearchTerm,
  loadingProducts,
  filteredProducts,
  handleSelectProduct,
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
          <h5>📦 Listado de productos</h5>
          <input className="form-control mb-2 form_buscador" placeholder="🔎 Buscar..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          <ul className="list-group">
            {loadingProducts ? (
              <div className='spinner_container'> <Spinner color="#6564d8" /> </div>
            ) : filteredProducts.length ? (
              filteredProducts.map((prod) => (
                <li
                  key={prod.id}
                  className={`list-group-item list-group-item-action`}
                  style={{ cursor: 'pointer' }}
                >
                  <div className='left'>
                    <p className='fw-bold name_text'>{prod.name.charAt(0).toUpperCase() + prod.name.slice(1)} 
                      {
                        prod?.perishable && (
                          <span className='chip'>v</span>
                        )
                      }
                    </p>

                    <p className='fs-5'>{prod.category.name.charAt(0).toUpperCase() + prod.category.name.slice(1)} - <strong>{prod?.stockunit?.length} unidades </strong></p>
                    
                    <p className='text fs-5'>COD: {prod.code.toUpperCase()} - $: <strong>${prod.salePrice}</strong></p>
                  </div>
                  <div className='right'>
                    <div className={`color_stock ${getStockClass(prod)}`}>
                    {/* <div className={`color_stock ${getStockClass(prod?.stockunit?.length)}`}> */}
                    </div>
                  </div>
                  <div className='btn_add_container'>
                    <button className="btn_add" onClick={() => handleSelectProduct  (prod)}>
                      <PlusIcon width={20} height={20} fill="#fff" />
                    </button>
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

export default SaleSearch