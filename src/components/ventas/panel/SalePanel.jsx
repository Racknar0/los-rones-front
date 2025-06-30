import React from 'react';
import './SalePanel.scss';
import { CouponIcon } from '../../icons/CouponIcon';
import { DeleteIcon } from '../../icons/DeleteIcon';
import ProcesoPago from '../procesopago/ProcesoPago';
import useStore from '../../../store/useStore';
import ProcesoPagoCambio from '../procesopago/ProcesoPagoCambio';

const SalePanel = ({
    cartItems,
    onRemoveFromCart,
    lastAddedIndex,
    fetchProducts,
}) => {
    const { applyItemCoupon, removeItemCoupon, cupones } = useStore();
    const dataCambio = useStore((state) => state.dataCambio);

    const handleItemCoupon = (unit, code) => {
        const cup = cupones.find((c) => c.code === code);
        if (cup) applyItemCoupon(unit.id, cup);
        else removeItemCoupon(unit.id); // para vacío o no válido
    };

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
                        {dataCambio?.cambioActivo ? null : (
                            <th className="text-center">Cupón</th>
                        )}
                        <th className="th_coupon_body">
                            <DeleteIcon width="20px" height="20px" />
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {cartItems.length > 0 ? (
                        cartItems.map((item, index) => (
                            <tr
                                key={index}
                                className={`table_row ${
                                    index === lastAddedIndex ? 'highlight' : ''
                                }`}
                            >
                                <td>{item.product.name}</td>
                                <td>{item.product.code}</td>
                                <td>
                                    {item.itemCoupon ? (
                                        <span className="before_coupon">
                                            ${item.product.salePrice}
                                        </span>
                                    ) : null}
                                    ${item.priceWithItemCoupon}
                                </td>
                                <td>
                                    {item.expirationDate
                                        ? new Date(
                                              item.expirationDate
                                          ).toLocaleDateString()
                                        : 'N/A'}
                                </td>
                                {dataCambio?.cambioActivo ? null : (
                                    <td className="text-center">
                                        <input
                                            className="form-control"
                                            defaultValue={
                                                item.itemCoupon?.code || ''
                                            }
                                            onBlur={(e) =>
                                                handleItemCoupon(
                                                    item,
                                                    e.target.value
                                                        .trim()
                                                        .toUpperCase()
                                                )
                                            }
                                        />
                                    </td>
                                )}
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
                                No hay productos en el carrito. Selecciona uno a
                                la izquierda.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            <hr className="mt-5 ms-4" />
            <h5 className="text-center fs-3 mt-5">
              {
                dataCambio?.cambioActivo
                    ? 'Proceso de Cambio'
                    : 'Proceso de Pago'
              }
            </h5>

            {dataCambio?.cambioActivo ? (
                <ProcesoPagoCambio />
            ) : (
                <ProcesoPago fetchProducts={fetchProducts} />
            )}
        </div>
    );
};

export default SalePanel;
