// src/components/TableRecibos/TableRecibos.jsx
import React, { useEffect, useState, useRef } from 'react';
import { DateRange } from 'react-date-range';
import HttpService from '../../services/HttpService';
import './TableDashboard.scss';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import Modal from '../modal/Modal';
import EyeIcon from '../icons/EyeIcon';
import Spinner from '../spinner/Spinner';
import IconBillBlue from '../icons/BillBlueIcon';
import useStore from '../../store/useStore';

const TableDashboard = ({
  setDataSales
}) => {
  const httpService = new HttpService();
  const BACK_HOST   = import.meta.env.VITE_BACK_HOST;
  const selectedStore = useStore((state) => state.selectedStore);

  // 1) Calculamos los límites de hoy
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  // 2) Estado del rango inicial = todo el día de hoy
  const [range, setRange] = useState({
    startDate: todayStart,
    endDate:   todayEnd,
    key:       'selection'
  });
  const [showCalendar, setShowCalendar] = useState(false);
  const calendarRef = useRef(null);

  const [recibos, setRecibos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState(null);

  // cerrar picker al hacer click fuera
  useEffect(() => {
    const handleClickOutside = e => {
      if (
        showCalendar &&
        calendarRef.current &&
        !calendarRef.current.contains(e.target)
      ) {
        setShowCalendar(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showCalendar]);

  // 3) Al montarse, traigo los recibos de hoy
  useEffect(() => {
    fetchRecibos(range.startDate, range.endDate);
  }, []); // <-- solo la primera vez

  useEffect(() => {
    fetchRecibos(range.startDate, range.endDate);
  }, [selectedStore]); // <-- cada vez que cambia la tienda

  // fetchRecibos reutilizable: recibe dos Date
  const fetchRecibos = async (start, end) => {
    setLoading(true);
    const payload = {
      startDate: start.toISOString(),
      endDate:   end.toISOString(),
      storeId:   selectedStore
    };
    try {
      // opcional: simula retraso
      await new Promise(res => setTimeout(res, 500));
      const resp = await httpService.postData('/sale/filter', payload);
      if (resp.status === 200) {
        // Filtrar la data omitiendo los res.data que tienen isDeleted : true
        const filteredData = resp.data.filter(item => !item.isDeleted);
        // Actualizar el estado con los datos filtrados

        console.log('Recibos traídos:', resp.data);
        console.log('Recibos filtrados:', filteredData);
        setRecibos(filteredData || []);
        setDataSales(filteredData || []); 
      

      } else {
        console.error('Error al traer recibos:', resp.statusText);
      }
    } catch (err) {
      console.error('Error fetchRecibos:', err);
    } finally {
      setLoading(false);
    }
  };

  // 4) Cuando el usuario selecciona un rango, actualizamos y volvemos a traer
  const handleSelect = ranges => {
    const { startDate, endDate } = ranges.selection;
    setRange(ranges.selection);
    setShowCalendar(false);
    fetchRecibos(startDate, endDate);
  };

  const openModal = recibo => {
    setSelected(recibo);
    setShowModal(true);
  };

  return (


    <div className="TableDashboard container-fluid mt-4">


      <div className="date-picker-wrapper mb-3 w-100">
        <button
          className="btn btn-range"
          onClick={() => setShowCalendar(v => !v)}
        >
          {showCalendar ? 'Cerrar selector' : 'Seleccionar rango'}
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
                <td colSpan="6" className="text-center py-4">
                  <Spinner color="#6564d8" styles={{ margin: '0 auto' }} />
                </td>
              </tr>
            ) : recibos.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-4">
                  No hay recibos en ese rango
                </td>
              </tr>
            ) : (
              recibos.map(r => (
                <tr key={r.id}>
                  <td>
                    <span
                      role="button"
                      className="ms-4"
                      title="Ver más detalles"
                      onClick={() => openModal(r)}
                    >
                      <EyeIcon />
                    </span>
                  </td>
                  <td>{r.ticketNumber}</td>
                  <td>${parseFloat(r.totalAmount).toFixed(2)}</td>
                  <td>{r.paymentMethod}</td>
                  <td>
                    {new Date(r.createdAt).toLocaleString('es-ES', {
                      dateStyle: 'short',
                      timeStyle: 'short',
                      hour12: false
                    })}
                  </td>
                  <td>
                    <span
                      role="button"
                      title="Ver Ticket"
                      onClick={() =>
                        window.open(
                          `${BACK_HOST}/sale/generate-pdf/${r.id}`,
                          '_blank'
                        )
                      }
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

      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        title={selected ? `Recibo #${selected.ticketNumber}` : 'Detalles'}
      >
        {selected && (
          <div>
            <ul className="list-unstyled row mb-4">
              <li className="col-12 col-md-6">
                <div className="chip">
                  <strong>Ticket:</strong> {selected.ticketNumber}
                </div>
              </li>
            </ul>
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
                  {selected.saleItems.map(item => (
                    <tr key={item.id}>
                      <td>{item.product.name}</td>
                      <td>${parseFloat(item.unitPrice).toFixed(2)}</td>
                      <td>{item.itemCouponCode || 'N/A'}</td>
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

export default TableDashboard;
