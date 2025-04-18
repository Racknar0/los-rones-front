import React from 'react';
import './SalePanel.scss';
import { CouponIcon } from '../../icons/CouponIcon';
import { DeleteIcon } from '../../icons/DeleteIcon';
import ProcesoPago from '../procesopago/ProcesoPago';

const SalePanel = ({  cartItems, onRemoveFromCart, lastAddedIndex }) => {
  return (
    <div className="col-md-8 sale_panel_container pt-4">
      <h5 className="text-center fs-3">Detalles de la Venta</h5>

      <table className="table table-bordered mt-4 ms-4 coupon_table">
        <thead className="table-light">
          <tr>
            <th>Producto</th>
            <th>Código</th>
            <th>Precio</th>
            <th>Vencimiento</th>
            <th>Cupón</th>
            <th className="th_coupon_body">
              <DeleteIcon width="20px" height="20px" />
            </th>
          </tr>
        </thead>
        <tbody>
          {cartItems.length > 0 ? (
            cartItems.map((item, index) => (
              <tr key={index} 
                className={`table_row ${index === lastAddedIndex ? 'highlight' : ''}`}
              >
                <td>{item.product.name}</td>
                <td>{item.product.code}</td>
                <td>${item.product.salePrice}</td>
                <td>{item.expirationDate ? new Date(item.expirationDate).toLocaleDateString() : 'N/A'}</td>
                <td className="text-center">
                  <button className="btn btn-primary btn-sm">
                    <CouponIcon width="20px" height="20px" />
                  </button>
                </td>
                <td className="text-center">
                  <DeleteIcon
                    className="delete_icon"
                    width="20px"
                    height="20px"
                    onClick={() => {
                      console.log('item', item);
                      onRemoveFromCart(item); 
                    }}
                  />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="text-center">
                No hay productos en el carrito. Selecciona uno a la izquierda.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <hr className="mt-5 ms-4" />
      <h5 className="text-center fs-3 mt-5">Proceso de Pago</h5>
      <ProcesoPago  />
    </div>
  );
};

export default SalePanel;
