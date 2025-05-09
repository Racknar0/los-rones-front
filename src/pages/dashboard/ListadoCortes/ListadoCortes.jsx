// src/components/ListadoCortes/ListadoCortes.jsx
import React, { useEffect, useState, useRef } from 'react';
import { DateRange } from 'react-date-range';
import HttpService from '../../../services/HttpService';
import Spinner from '../../../components/spinner/Spinner';
import useStore from '../../../store/useStore';

import './ListadoCortes.scss';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

const ListadoCortes = () => {
  const httpService   = new HttpService();
  const selectedStore = useStore(state => state.selectedStore);

  const [range, setRange]                = useState({
    startDate: new Date(),
    endDate:   new Date(),
    key:       'selection'
  });
  const [showCalendar, setShowCalendar] = useState(false);
  const [cortes, setCortes]             = useState([]);
  const [loading, setLoading]           = useState(false);
  const calendarRef                     = useRef(null);

  // 1) Al montar, traer TODOS los cortes de la tienda
  useEffect(() => {
    if (!selectedStore) return;
    fetchAllCortes();
  }, [selectedStore]);

  // Cerrar el picker si clic fuera
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

  const fetchAllCortes = async () => {
    setLoading(true);
    try {
      const resp = await httpService.postData(
        '/cortes/range',
        { storeId: selectedStore }
      );
      if (resp.status === 200) {
        setCortes(resp.data);
      } else {
        console.error('Error trayendo todos los cortes:', resp.statusText);
      }
    } catch (err) {
      console.error('fetchAllCortes error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchFilteredCortes = async ({ startDate, endDate }) => {
    setLoading(true);
    try {
      const resp = await httpService.postData(
        '/cortes/range',
        {
          storeId:    selectedStore,
          fechaInicial: startDate.toISOString().split('T')[0],
          fechaFinal:   endDate.toISOString().split('T')[0]
        }
      );
      if (resp.status === 200) {
        setCortes(resp.data);
      } else {
        console.error('Error trayendo cortes filtrados:', resp.statusText);
      }
    } catch (err) {
      console.error('fetchFilteredCortes error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = ranges => {
    setRange(ranges.selection);
    setShowCalendar(false);
    fetchFilteredCortes(ranges.selection);
  };

  return (
    <div className="listadoCortes container-fluid mt-4">
      <h1 className="mb-4">Listado de Cortes</h1>

      <div className="date-picker-wrapper w-100 mb-3">
        <button
          className="btn btn-range"
          onClick={() => setShowCalendar(v => !v)}
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
              showSelectionPreview
              moveRangeOnFirstSelection={false}
              editableDateInputs
              rangeColors={['#6564d8']}
            />
          </div>
        )}
      </div>

      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Folio Inicial</th>
              <th>Folio Final</th>
              <th>Venta Total</th>
              <th>Costo Total</th>
              <th>Efectivo</th>
              <th>Tarjeta</th>
              <th>Transferencia</th>
              <th>Comentarios</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="9" className="text-center py-4">
                  <Spinner color="#6564d8" styles={{ margin: '0 auto' }} />
                </td>
              </tr>
            ) : cortes.length === 0 ? (
              <tr>
                <td colSpan="9" className="text-center py-4">
                  No hay cortes para mostrar.
                </td>
              </tr>
            ) : (
              cortes.map(corte => (
                <tr key={corte.id}>
                  <td>
                    {new Date(corte.date).toLocaleDateString('es-ES', {
                      dateStyle: 'short'
                    })}
                  </td>
                  <td>{corte.folioInicial}</td>
                  <td>{corte.folioFinal}</td>
                  <td>${Number(corte.ventaTotal).toFixed(2)}</td>
                  <td>${Number(corte.costoTotal).toFixed(2)}</td>
                  <td>${Number(corte.efectivo).toFixed(2)}</td>
                  <td>${Number(corte.tarjeta).toFixed(2)}</td>
                  <td>${Number(corte.transferencia).toFixed(2)}</td>
                  <td>{corte.comentarios || '—'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListadoCortes;