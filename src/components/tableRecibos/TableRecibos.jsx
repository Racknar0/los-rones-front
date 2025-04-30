// src/components/TableRecibos/TableRecibos.jsx
import React, { useEffect, useState } from 'react';
import { DateRange } from 'react-date-range';
import HttpService from '../../services/HttpService';
import './TableRecibos.scss'; // estilos personalizados

// estilos de react-date-range
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import Modal from '../modal/Modal';
import EyeIcon from '../icons/EyeIcon';
import Spinner from '../spinner/Spinner';
import IconBillBlue from '../icons/BillBlueIcon';

const TableRecibos = () => {
    const httpService = new HttpService();
    const BACK_HOST = import.meta.env.VITE_BACK_HOST;

    const [range, setRange] = useState({
        startDate: new Date(),
        endDate: new Date(),
        key: 'selection',
    });

    const [recibos, setRecibos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selected, setSelected] = useState(null);
    console.log(recibos)

    // cada vez que cambie el rango, volvemos a cargar los recibos
    useEffect(() => {
        fetchRecibos();
    }, [range]);

    const fetchRecibos = async () => {
        const payload = {
            startDate: range.startDate.toISOString(),
            endDate: range.endDate.toISOString(),
        };

        setLoading(true);
        try {
            //delay de 2 seg
            await new Promise((resolve) => setTimeout(resolve, 2000));
            const resp = await httpService.postData('/sale/filter', payload);
            if (resp.status === 200) {
                setRecibos(resp.data || []);
            } else {
                console.error('Error al traer recibos:', resp.statusText);
            }
        } catch (err) {
            console.error('Error fetchRecibos:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSelect = (ranges) => setRange(ranges.selection);

    const openModal = (recibo) => {
        setSelected(recibo);
        setShowModal(true);
    };

    return (
        <div className="tableRecibos container-fluid mt-4">
            <h1 className="mb-4">Recibos</h1>

            {/* Selector de rango */}
            <DateRange
                ranges={[range]}
                onChange={handleSelect}
                months={1}
                direction="horizontal"
            />

            {/* Tabla */}
            <div className="table-responsive mt-4">
                <table className="table table-striped table-hover">
                    <thead>
                        <tr>
                            <th>Ver más</th>
                            <th># Ticket</th>
                            <th>Total</th>
                            <th>Método Pago</th>
                            <th>Fecha</th>
                            <th>Ticket</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="10" className="text-center py-4">
                                    <Spinner color="#6564d8" styles={{ margin: '0 auto' }} />
                                </td>
                            </tr>
                        ) : recibos.length === 0 ? (
                            <tr>
                                <td colSpan="10" className="text-center py-4">
                                    No hay recibos en ese rango
                                </td>
                            </tr>
                        ) : (
                            recibos.map((r) => (
                                <tr key={r.id}>
                                    <td>
                                        <span
                                            role="button"
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => openModal(r)}
                                            title="Ver más detalles"
                                            className='ms-4'
                                        >
                                            <EyeIcon />
                                        </span>
                                    </td>
                                    <td>{r.id}</td>
                                    <td>
                                        ${parseFloat(r.totalAmount).toFixed(2)}
                                    </td>
                                    <td>{r.paymentMethod}</td>
                                    <td>
                                        {new Date(r.createdAt).toLocaleString(
                                            'es-ES',
                                            {
                                                dateStyle: 'short',
                                                timeStyle: 'short',
                                                hour12: false,
                                            }
                                        )}
                                    </td>
                                    <td>
                                        <span
                                            role="button"
                                            style={{ cursor: 'pointer' }}
                                            onClick={() =>
                                                window.open(
                                                    `${BACK_HOST}/sale/generate-pdf/${r.id}`,
                                                    '_blank'
                                                )
                                            }
                                            title="Ver Ticket"
                                        >
                                            <IconBillBlue width={24} height={24} />
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal de detalles */}
            <Modal
                show={showModal}
                onClose={() => setShowModal(false)}
                title={selected ? `Recibo #${selected.id}` : 'Detalles'}
            >
                {selected && (
                    <div>
                        {/* Datos generales */}
                        <ul className="list-unstyled row mb-4">
                            <li className='col-12 col-md-6'>
                                <div className='chip'>
                                    <strong>Ticket:</strong> {selected.id}
                                </div>
                            </li>
                            <li className='col-12 col-md-6'>
                                <div className='chip'>
                                    <strong>Subtotal:</strong> $
                                    {parseFloat( selected.totalWithoutCoupon ).toFixed(2)}
                                </div>
                            </li>
                            <li className='col-12 col-md-6'>
                                <div className='chip'>
                                    <strong>Total:</strong> $
                                    {parseFloat(selected.totalAmount).toFixed(2)}
                                </div>
                            </li>
                            <li className='col-12 col-md-6'>
                                <div className='chip'>
                                    <strong>Método de pago:</strong> {selected.paymentMethod}
                                </div>
                            </li>
                            <li className='col-12 col-md-6'>
                                <div className='chip'>
                                    <strong>Recibido:</strong> $
                                    {parseFloat(selected.receivedAmount).toFixed(2)}
                                </div>
                            </li>
                            <li className='col-12 col-md-6'>
                                <div className='chip'>
                                    <strong>Cambio:</strong> $
                                    {parseFloat(selected.changeAmount).toFixed(2)}
                                </div>
                            </li>
                            <li className='col-12 col-md-6'>
                                <div className='chip'>
                                    <strong>Cupón:</strong> {selected.couponCode || 'N/A'}
                                </div>
                            </li>
                            <li className='col-12 col-md-6'>
                                <div className='chip'>
                                    <strong>Fecha:</strong> {new Date(selected.createdAt).toLocaleString(
                                        'es-ES',
                                        {
                                            dateStyle: 'short',
                                            timeStyle: 'short',
                                            hour12: false,
                                        }
                                    )}
                                </div>
                            </li>
                            <li className='col-12 col-md-6'>
                                <div className='chip'>
                                    <strong>Usuario:</strong> {selected.user?.name || '—'}
                                </div>
                            </li>
                            <li className='col-12 col-md-6'>
                                <div className='chip'>
                                    <strong>Sucursal:</strong> {selected.store?.name || '—'}
                                </div>
                            </li>
                        </ul>

                        {/* Tabla de ítems */}
                        <h5 className="mt-4">Ítems de la venta</h5>
                        <div className="table-responsive">
                            <table className="table table-bordered">
                                <thead>
                                    <tr>
                                        <th>Producto</th>
                                        <th>Precio Unit.</th>
                                        <th>Cupón ítem</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selected.saleItems.map((item) => (
                                        <tr key={item.id}>
                                            <td>{item.product.name}</td>
                                            <td>
                                                $
                                                {parseFloat(
                                                    item.unitPrice
                                                ).toFixed(2)}
                                            </td>
                                            <td>
                                                {item.itemCouponCode || 'N/A'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default TableRecibos;
