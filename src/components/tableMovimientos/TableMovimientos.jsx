// src/components/TableRecibos/TableRecibos.jsx
import React, { useEffect, useState, useRef } from 'react';
import { DateRange } from 'react-date-range';
import HttpService from '../../services/HttpService';
import './TableMovimientos.scss';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import Spinner from '../spinner/Spinner';
import useStore from '../../store/useStore';

const TableMovimientos = () => {
  const httpService   = new HttpService();
  const selectedStore = useStore(state => state.selectedStore);

  const [range, setRange]                   = useState({
    startDate: new Date(),
    endDate:   new Date(),
    key:       'selection'
  });
  const [showCalendar, setShowCalendar]    = useState(false);
  const [movimientos, setMovimientos]      = useState([]);
  const [loading, setLoading]              = useState(false);
  const calendarRef                         = useRef(null);

  // Cerrar el picker si el usuario hace click fuera
  useEffect(() => {
    const onClickOutside = e => {
      if (
        showCalendar &&
        calendarRef.current &&
        !calendarRef.current.contains(e.target)
      ) {
        setShowCalendar(false);
      }
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, [showCalendar]);

  // Cada vez que cambien fechas o tienda, recargar movimientos
  useEffect(() => {
    fetchMovimientos();
  }, [range, selectedStore]);

  const fetchMovimientos = async () => {
    setLoading(true);
    const payload = {
      startDate: range.startDate.toISOString(),
      endDate:   range.endDate.toISOString(),
      storeId:   selectedStore
    };
    try {
      // Simula un pequeño delay
      await new Promise(r => setTimeout(r, 500));
      const resp = await httpService.postData(
        '/movements/filter',
        payload
      );
      if (resp.status === 200) {
        setMovimientos(resp.data || []);
      } else {
        console.error('Error al traer movimientos:', resp.statusText);
      }
    } catch (err) {
      console.error('Error fetchMovimientos:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = ranges => {
    setRange(ranges.selection);
    // ocultar calendario al elegir
    setShowCalendar(false);
  };

  return (
    <div className="tableRecibos container-fluid mt-4">
      <h1 className="mb-4">Movimientos de Stock</h1>

      <div className="date-picker-wrapper  w-100">
        <button
          className="btn btn-range"
          onClick={() => setShowCalendar(show => !show)}
        >
          {showCalendar ? 'Clic afuera para cerrar' : 'Seleccionar rango'}
        </button>

        {showCalendar && (
          <div className="calendar-popover" ref={calendarRef}>
            <DateRange
              ranges={[range]}
              onChange={handleSelect}
              months={2}
              direction="horizontal"
              showSelectionPreview={true}
              moveRangeOnFirstSelection={false}
              editableDateInputs={true}
              rangeColors={['#6564d8']}
            />
          </div>
        )}
      </div>

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
                <td colSpan="5" className="text-center py-4">
                  <Spinner color="#6564d8" styles={{ margin: '0 auto' }} />
                </td>
              </tr>
            ) : movimientos.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-4">
                  No hay movimientos para mostrar en este rango de fechas.
                </td>
              </tr>
            ) : (
              movimientos.map(r => (
                <tr key={r.id}>
                  <td>
                    {r.action === 'CREATE' && <span>✅</span>}
                    {r.action === 'UPDATE' && <span>🔄</span>}
                    {r.action === 'DELETE' && <span>❌</span>}
                  </td>
                  <td>{r.store.name}</td>
                  <td>{r.product.name}</td>
                  <td>{r.user.user}</td>
                  <td>
                    {new Date(r.createdAt).toLocaleString('es-ES', {
                      dateStyle: 'short',
                      timeStyle: 'short',
                      hour12: false
                    })}
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
