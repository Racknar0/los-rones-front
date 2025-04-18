import React, { useEffect, useState } from 'react';
import { CouponIcon } from '../../icons/CouponIcon';
import useStore from '../../../store/useStore';
import { confirmAlert, errorAlert, successAlert } from '../../../helpers/alerts';
import TotalValue from '../totalValue/TotalValue';
import CuponTotal from '../cuponTotal/CuponTotal';
import SelectMetodoPago from '../selectMetodoPago/SelectMetodoPago';
import Cambio from '../cambio/Cambio';
import './ProcesoPago.scss';
import HttpService from '../../../services/HttpService';

const ProcesoPago = () => {
    const totalCompra = useStore((s) => s.totalCompra);
    const setTotalCompra = useStore((s) => s.setTotalCompra);
    const totalCompraSinCupon = useStore((s) => s.totalCompraSinCupon);
    const tipoPago = useStore((s) => s.tipoPago);
    const setTipoPago = useStore((s) => s.setTipoPago);
    const setDineroRecibido = useStore((s) => s.setDineroRecibido);
    const cambio = useStore((s) => s.cambio);
    const setCambio = useStore((s) => s.setCambio);
    const cupones = useStore((s) => s.cupones);
    const selectedCoupon = useStore((s) => s.selectedCoupon);
    const setSelectedCoupon = useStore((s) => s.setSelectedCoupon);
    const cartItems = useStore((s) => s.cartItems);
    const selectedStore = useStore((s) => s.selectedStore);
    const jwtData = useStore((s) => s.jwtData);
    const resetFinisedSale = useStore((s) => s.resetFinisedSale);

    const [efectivo, setEfectivo] = useState('');
    const [cupon, setCupon] = useState('');

    const httpService = new HttpService();

    // ── Validación al salir del input ──
    const validarEfectivo = async (raw) => {
        const value = parseFloat(raw);

        if (isNaN(value)) { await errorAlert( 'Error', 'El monto recibido no es un número válido' ); setCambio(0); return; }
        if (value < 0) { await errorAlert( 'Error', 'El monto recibido no puede ser negativo' ); setCambio(0); return; }
        if (value < totalCompra) { await errorAlert( 'Error', 'El monto recibido no puede ser menor al total de la compra' ); setCambio(0); return; }

        // ✔ OK
        setDineroRecibido(value);
        setCambio(value - totalCompra);
    };


    const handleCuponChange = (e) => {
        setSelectedCoupon(null);
        const value = e.target.value;
        const cuponEncontrado = cupones.find((cupon) => cupon.code === value);
        if (cuponEncontrado) {
            setSelectedCoupon(cuponEncontrado);
        } else {
            setSelectedCoupon(null);
        }
    }


    const hadleFinalizarVenta = async () => {
        // Aquí puedes agregar la lógica para finalizar la venta
        // Por ejemplo, enviar los datos al servidor o realizar cualquier otra acción necesaria
        console.log('Venta finalizada');

        if (!cartItems.length) return errorAlert('Error', 'No hay productos en el carrito');
        if (!tipoPago) return errorAlert('Error', 'Seleccione un método de pago');
        if (!efectivo) return errorAlert('Error', 'Ingrese el monto recibido');
        if (efectivo < totalCompra) return errorAlert('Error', 'El monto recibido no puede ser menor al total de la compra');
        if (cambio < 0) return errorAlert('Error', 'El cambio no puede ser negativo');
        if (cambio > efectivo) return errorAlert('Error', 'El cambio no puede ser mayor al monto recibido');

        const confirm = await confirmAlert('Confirmar', '¿Está seguro de que desea registrar la venta?');
        if (!confirm) return;


        const calculateTotalSinCupon = () => {
            const base = cartItems.reduce((acc, item) => acc + parseFloat(item.product.salePrice), 0);
            return base;
        };

        const dataToSend = {
            storeId: parseInt(selectedStore),
            userId: jwtData.id,
            paymentMethod: tipoPago,
            total: totalCompra,
            received: parseFloat(efectivo),
            change: parseFloat(cambio),
            totalSinCupon: calculateTotalSinCupon(),
            cupon: selectedCoupon ? selectedCoupon.code : null,
            items: cartItems.map((item) => ({
                stockUnitId: item.id,
                productId: item.productId,
                price: item.product.salePrice,
                expirationDate: item.expirationDate,
                itemCoupon: item.itemCoupon ? item.itemCoupon.code : null,
            })),
        }

        try {
            const res = await httpService.postData('/sale', dataToSend);
            if (res.status === 201) {
                // Aquí puedes agregar la lógica para manejar la respuesta exitosa
                successAlert('Éxito', 'Venta finalizada correctamente');
                resetFinisedSale();
            } else {
                errorAlert('Error', 'No se pudo finalizar la venta');
            }
        } catch (error) {
            errorAlert('Error', 'Ocurrió un error al finalizar la venta');
        } finally {
            console.log('Finalización de venta completada');
        }

    }

    return (
        <div className="type_sale_container">

            {/* Componente para mostrar el total de la compra */}
            <TotalValue
                selectedCoupon={selectedCoupon}
                totalCompra={totalCompra}
                totalCompraSinCupon={totalCompraSinCupon}
            />

            {/* Componente para seleccionar un cupón general */}
            <CuponTotal
                cupon={cupon}
                setCupon={setCupon}
                handleCuponChange={handleCuponChange}
            />

            {/* Componente para seleccionar el método de pago */}
            <SelectMetodoPago
                tipoPago={tipoPago}
                setTipoPago={setTipoPago}
            />

            {/* Componente dar informacion de cuanto se recibio y cuanto es el cambio */}

            <Cambio 
                efectivo={efectivo}
                setEfectivo={setEfectivo}
                cambio={cambio}
                validarEfectivo={validarEfectivo}
            />

            <button className="d-flex btn_finalizar_venta mt-4 mx-auto" onClick={hadleFinalizarVenta}>
                <p>Finalizar venta</p>
            </button>
        </div>
    );
};
 
export default ProcesoPago;
