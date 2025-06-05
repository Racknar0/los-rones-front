// src/components/TableRecibos/TableMovimientos.jsx
import React, { useEffect, useState, useRef } from 'react';
import { DateRange } from 'react-date-range';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import HttpService from '../../services/HttpService';
import './TableMovimientos.scss';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import Spinner from '../spinner/Spinner';
import useStore from '../../store/useStore';

const TableMovimientos = () => {
  const httpService   = new HttpService();
  const selectedStore = useStore(state => state.selectedStore);

  // Rango de fechas para el picker
  const [range, setRange]                   = useState({
    startDate: new Date(),
    endDate:   new Date(),
    key:       'selection'
  });
  const [showCalendar, setShowCalendar]    = useState(false);
  const [movimientos, setMovimientos]      = useState([]);
  const [loading, setLoading]              = useState(false);
  const calendarRef                         = useRef(null);

  // NUEVOS estados para los filtros
  const [searchTerm, setSearchTerm]         = useState('');
  const [actionFilter, setActionFilter]     = useState(''); // '' = Todos

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

  // Cuando cargue por primera vez o cambie la tienda, traer movimientos del día de hoy
  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    setRange({
      startDate: today,
      endDate:   new Date(),
      key:       'selection'
    });
    fetchMovimientos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedStore]);

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
        setMovimientos([]);
      }
    } catch (err) {
      console.error('Error fetchMovimientos:', err);
      setMovimientos([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = ranges => {
    setRange(ranges.selection);
    // ocultar calendario al elegir
    setShowCalendar(false);
  };

  // ----------------------------------------------------
  // Filtramos movimientos en función de searchTerm y actionFilter:
  // ----------------------------------------------------
  const filteredMovimientos = movimientos.filter(r => {
    const term = searchTerm.trim().toLowerCase();

    // 1) Coincidencia texto (tienda, producto o usuario)
    const matchesSearch =
      term === '' ||
      r.store?.name.toLowerCase().includes(term) ||
      r.product?.name.toLowerCase().includes(term) ||
      r.user?.user.toLowerCase().includes(term);

    // 2) Coincidencia acción
    const matchesAction =
      actionFilter === '' || // '' significa “Todos”
      r.action === actionFilter;

    return matchesSearch && matchesAction;
  });

  // ----------------------------------------------------
  // Exportar movimientos filtrados a Excel
  // ----------------------------------------------------
  const exportarMovimientos = () => {
    // 1) Prepara las filas basadas en filteredMovimientos
    const rows = filteredMovimientos.map(mov => {
      return {
        Acción:      mov.action,
        Tienda:      mov.store?.name || '',
        Producto:    mov.product?.name || '',
        Usuario:     mov.user?.user || '',
        Fecha:       new Date(mov.createdAt).toLocaleString('es-ES', {
                       dateStyle: 'short',
                       timeStyle: 'short',
                       hour12: false
                     })
      };
    });

    // 2) Crea la hoja y el libro
    const worksheet = XLSX.utils.json_to_sheet(rows, {
      header: ['Acción', 'Tienda', 'Producto', 'Usuario', 'Fecha']
    });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Movimientos');

    // 3) Genera el buffer y dispara la descarga
    const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { type: 'application/octet-stream' });
    const fileName = `movimientos_${new Date().toISOString().slice(0,10)}.xlsx`;
    saveAs(blob, fileName);
  };

  return (
    <div className="tableMovimientos container-fluid mt-4">
      <h1 className="mb-4">Movimientos de Stock</h1>

      {/* ———————– RANGO DE FECHAS ———————– */}
      <div className="date-picker-wrapper w-100 mb-2 d-flex flex-column">
        <button
          className="btn btn-range me-2"
          onClick={() => setShowCalendar(show => !show)}
        >
          {showCalendar ? 'Clic afuera para cerrar' : 'Seleccionar rango'}
        </button>
        {/* BOTÓN PARA EXPORTAR A EXCEL */}
        <button
          className="btn btn-success btn-exportar"
          onClick={exportarMovimientos}
          disabled={filteredMovimientos.length === 0}
        >
          Exportar Movimientos
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

      {/* ———————– FILTROS DE BÚSQUEDA Y TIPO DE MOVIMIENTO ———————– */}
      <div className="row mt-3 mb-3">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control mb-2 form_buscador"
            placeholder="🔎 Buscar por tienda, producto o usuario..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <select
            className="form-select mb-2 form_buscador"
            value={actionFilter}
            onChange={e => setActionFilter(e.target.value)}
          >
            <option value="">Todos los movimientos</option>
            <option value="CREATE">CREATE</option>
            <option value="DELETE">DELETE</option>
          </select>
        </div>
      </div>

      {/* ———————– TABLA DE RESULTADOS ———————– */}
      <div className="table-responsive mt-2">
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
            ) : filteredMovimientos.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-4">
                  No hay movimientos que coincidan con los filtros.
                </td>
              </tr>
            ) : (
              filteredMovimientos.map(r => (
                <tr key={r.id}>
                  <td>
                    {r.action === 'CREATE' && <span>✅</span>}
                    {r.action === 'UPDATE' && <span>🔄</span>}
                    {r.action === 'DELETE' && <span>❌</span>}
                  </td>
                  <td>{r.store?.name}</td>
                  <td>{r.product?.name}</td>
                  <td>{r.user?.user}</td>
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
