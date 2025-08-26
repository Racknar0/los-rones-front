import React, { use, useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import TableDashboard from '../../../components/tableDashboard/TableDashboard';
import DashboardSquares from '../../../components/dashboardSquares/DashboardSquares';
import ExpirationsByStore from '../../../components/dashboardSquares/ExpirationsByStore';
import HttpService from '../../../services/HttpService';
import './Dashboard.scss';
import useStore from '../../../store/useStore';
import { useNavigate } from 'react-router';

const Dashboard = () => {

  const { roleId } = useStore((state) => state.jwtData);
  const navigate = useNavigate();

  useEffect(() => {
    // validar si el usuario tiene permisos para ver el dashboard
    if (roleId !== 2) {
      navigate('/dashboard/ventas');
    }

  }, []);

  const [dataSales, setDataSales] = useState([]);

  const exportarVentas = () => {
    const rows = [];
    dataSales.forEach(sale => {
      sale.saleItems.forEach(item => {
        rows.push({
          Ticket: sale.ticketNumber,
          Fecha: new Date(sale.createdAt).toLocaleDateString('es-MX'), // solo fecha
          Sucursal: sale.store?.name || '',
          Usuario: sale.user?.name || '',
          'Metodo Pago': sale.paymentMethod,
          'Total Ticket': parseFloat(sale.totalAmount).toFixed(2),
          Producto: item.product.name,
          'Codigo Producto': item.product.code || '',
          Impuesto: item.product.hasTax ? 'Sí' : 'No',
          Costo: parseFloat(item.product.purchasePrice).toFixed(2),
          'Precio Publico': parseFloat(item.product.salePrice).toFixed(2),
          'Vendido Por': item.sellwhitcoupon ? parseFloat(item.sellwhitcoupon).toFixed(2) : '',
          Cupón: item.itemCouponCode || '',
          'Descuento': item.couponDiscountValue !== undefined ? item.couponDiscountValue : '',
        });
      });
    });

    const worksheet = XLSX.utils.json_to_sheet(rows, {
      header: [
        'Ticket', 'Fecha', 'Sucursal', 'Usuario', 'Metodo Pago', 'Total Ticket',
        'Producto', 'Codigo Producto', 'Impuesto', 'Costo', 'Precio Publico', 'Vendido Por', 'Cupón', 'Descuento'
      ]
    });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Ventas');

    const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { type: 'application/octet-stream' });
    saveAs(blob, `ventas_${new Date().toISOString().slice(0,10)}.xlsx`);
  };

  // Estado para expiraciones reales por tienda
  const [storesExpirations, setStoresExpirations] = useState([]);
  const [loadingExpirations, setLoadingExpirations] = useState(true);

  useEffect(() => {
    const fetchExpirations = async () => {
      setLoadingExpirations(true);
      try {
        const httpService = new HttpService();
        const res = await httpService.getData('/product/expiring-perishables-by-store');
        if (res.status === 200) {
          setStoresExpirations(res.data);
        }
      } catch (err) {
        setStoresExpirations([]);
      } finally {
        setLoadingExpirations(false);
      }
    };
    fetchExpirations();
  }, []);

  return (
    <div>
      <h1 className="mb-4">Dashboard</h1>
      <DashboardSquares dataSales={dataSales}/>
      <div className="mb-5 mt-5 w-100 d-flex justify-content-center">
        <button className="exportar_btn" onClick={exportarVentas}>
          Exportar Ventas
        </button>
      </div>
      {/* Cajas de productos próximos a vencer por tienda */}
      {loadingExpirations ? (
        <div className="text-center my-4">Cargando productos próximos a vencer...</div>
      ) : (
        <ExpirationsByStore storesExpirations={storesExpirations} />
      )}
      <TableDashboard setDataSales={setDataSales}/>
    </div>
  );
};

export default Dashboard;
