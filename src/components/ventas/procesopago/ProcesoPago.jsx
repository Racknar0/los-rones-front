import React, { useState } from 'react';
import CardIcon from '../../icons/CardIcon';
import CashIcon from '../../icons/CashIcon';
import TransferIcon from '../../icons/TransferenciaIcon';
import { CouponIcon } from '../../icons/CouponIcon';
import useStore from '../../../store/useStore';
import { errorAlert } from '../../../helpers/alerts';
import './ProcesoPago.scss';

const ProcesoPago = () => {
    const totalCompra = useStore((s) => s.totalCompra);
    const tipoPago = useStore((s) => s.tipoPago);
    const setTipoPago = useStore((s) => s.setTipoPago);
    const setDineroRecibido = useStore((s) => s.setDineroRecibido);
    const cambio = useStore((s) => s.cambio);
    const setCambio = useStore((s) => s.setCambio);

    const [efectivo, setEfectivo] = useState('');
    const [cupon, setCupon] = useState('');

    // ── Validación al salir del input ──
    const validarEfectivo = async (raw) => {
        const value = parseFloat(raw);

        if (isNaN(value)) {
            await errorAlert(
                'Error',
                'El monto recibido no es un número válido'
            );
            setCambio(0);
            return;
        }

        if (value < 0) {
            await errorAlert(
                'Error',
                'El monto recibido no puede ser negativo'
            );
            setCambio(0);
            return;
        }

        if (value < totalCompra) {
            await errorAlert(
                'Error',
                'El monto recibido no puede ser menor al total de la compra'
            );
            setCambio(0);
            return;
        }

        // ✔ OK
        setDineroRecibido(value);
        setCambio(value - totalCompra);
    };

    return (
        <div className="type_sale_container">
            <div className="total_container">
                <div className="total">
                    <p className="total_title">Total a pagar</p>
                    <p className="total_value">${totalCompra}</p>
                </div>
            </div>

            <p className="fs-4 mt-4 text-center">
                Aplicar un cupón al total de la compra
            </p>
            <div className="coupon_total_cntainer d-flex flex-column align-items-center">
                <input
                    type="text"
                    placeholder="Código del cupón"
                    className="form-control"
                />
            </div>

            <p className="fs-4 mt-4 text-center">
                Selecciona el método de pago
            </p>
            <div className="btns_container">
                <button
                    className={`btn_card ${
                        tipoPago === 'tarjeta' ? 'active' : ''
                    }`}
                    onClick={() => setTipoPago('tarjeta')}
                >
                    <CardIcon width="40" height="40" />
                    <p>Tarjeta</p>
                </button>
                <button
                    className={`btn_card ${
                        tipoPago === 'efectivo' ? 'active' : ''
                    }`}
                    onClick={() => setTipoPago('efectivo')}
                >
                    <CashIcon width="40" height="40" />
                    <p>Efectivo</p>
                </button>
                <button
                    className={`btn_card ${
                        tipoPago === 'transferencia' ? 'active' : ''
                    }`}
                    onClick={() => setTipoPago('transferencia')}
                >
                    <TransferIcon width="40" height="40" />
                    <p>Transferencia</p>
                </button>
            </div>

            {/* Siempre visible */}
            <p className="fs-4 mt-4 text-center">Ingrese el monto recibido</p>
            <div className="efectivo_cambio_container">
                <div className="efectivo_container">
                    <label htmlFor="efectivo">Recibido</label>
                    <input
                        type="number"
                        id="efectivo"
                        placeholder="0"
                        min="0"
                        value={efectivo}
                        onChange={(e) => setEfectivo(e.target.value)}
                        onBlur={() => validarEfectivo(efectivo)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault(); // evita un submit accidental
                                e.target.blur(); // dispara onBlur una sola vez
                            }
                        }}
                    />
                </div>
                <div className="cambio_container">
                    <label htmlFor="cambio">Cambio</label>
                    <input
                        type="number"
                        id="cambio"
                        placeholder="0"
                        disabled
                        value={cambio}
                    />
                </div>
            </div>

            <button className="d-flex btn_finalizar_venta mt-4 mx-auto">
                <CouponIcon width="30" height="30" />
                <p>Finalizar venta</p>
            </button>
        </div>
    );
};

export default ProcesoPago;
