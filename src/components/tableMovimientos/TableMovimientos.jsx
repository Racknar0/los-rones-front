// src/components/TableRecibos/TableRecibos.jsx
import React, { useEffect, useState } from 'react';
import { DateRange } from 'react-date-range';
import HttpService from '../../services/HttpService';
import './TableMovimientos.scss'; // estilos personalizados

// estilos de react-date-range
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import Spinner from '../spinner/Spinner';
import useStore from '../../store/useStore';

const TableMovimientos = () => {
    const httpService = new HttpService();
    const selectedStore = useStore((state) => state.selectedStore);

    const [range, setRange] = useState({
        startDate: new Date(),
        endDate: new Date(),
        key: 'selection',
    });

    const [movimientos, setMovimientos] = useState([]);
    const [loading, setLoading] = useState(false);
    console.log(movimientos)

    // cada vez que cambie el rango, volvemos a cargar los movimientos
    useEffect(() => {
        fetchMovimientos();
    }, [range, selectedStore]);

    const fetchMovimientos = async () => {
        const payload = {
            startDate: range.startDate.toISOString(),
            endDate: range.endDate.toISOString(),
            storeId: selectedStore,
        };

        setLoading(true);
        try {
            //delay de 2 seg
            await new Promise((resolve) => setTimeout(resolve, 2000));
            const resp = await httpService.postData('/movements/filter', payload);
            console.log('movements:', resp.data);
            if (resp.status === 200) {
                setMovimientos(resp.data || []);
            } else {
                console.error('Error al traer recibos:', resp.statusText);
            }
        } catch (err) {
            console.error('Error fetchMovimientos:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSelect = (ranges) => setRange(ranges.selection);


    return (
        <div className="tableRecibos container-fluid mt-4">
            <h1 className="mb-4">Movimientos de Stock</h1>

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
                            <th>Acción</th>
                            <th>Tienda</th>
                            <th>Producto</th>
                            <th>Usuario</th>
                            <th>Fecha</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="10" className="text-center py-4">
                                    <Spinner color="#6564d8" styles={{ margin: '0 auto' }} />
                                </td>
                            </tr>
                        ) : movimientos.length === 0 ? (
                            <tr>
                                <td colSpan="10" className="text-center py-4">
                                    No hay movimientos para mostrar en este rango de fechas.
                                </td>
                            </tr>
                        ) : (
                            movimientos.map((r) => (
                                <tr key={r.id}>
                                    <td>
                                        {
                                            r.action === "CREATE" ? (
                                                <span style={{ fontSize: '2rem' }}>
                                                    ✅
                                                </span>
                                            ) : null
                                        }

                                        {
                                            r.action === "UPDATE" ? (
                                                <span style={{ fontSize: '2rem' }}>
                                                    🔄
                                                </span>
                                            ) : null
                                        }

                                        {
                                            r.action === "DELETE" ? (
                                                <span style={{ fontSize: '2rem' }}>
                                                    ❌
                                                </span>
                                            ) : null
                                        }
                                    </td>
                                    <td>{r.store.name}</td>
                                    <td>
                                        {r.product.name}
                                    </td>
                                    <td> {r.user.user}</td>
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
                                    
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

        </div>
    );
};

export default TableMovimientos;
