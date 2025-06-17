import React, { use, useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import TableDashboard from '../../../components/tableDashboard/TableDashboard';
import DashboardSquares from '../../../components/dashboardSquares/DashboardSquares';
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
    // 1) Prepara las filas
    
    const rows = [];
    dataSales.forEach(sale => {
      sale.saleItems.forEach(item => {
        const precioFinal = parseFloat(item.unitPrice);
        const costo       = parseFloat(item.product.purchasePrice);
        rows.push({
          Ticket:       sale.id,
          Producto:     item.product.name,
          Precio_Final: precioFinal,
          Costo:        costo,
          Dif:          precioFinal - costo,
        });
      });
    });

    // 2) Crea la hoja y el libro
    const worksheet = XLSX.utils.json_to_sheet(rows, {
      header: ['Ticket','Producto','Precio_Final','Costo','Dif']
    });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Ventas');

    // 3) Genera el buffer y dispara la descarga
    const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { type: 'application/octet-stream' });
    saveAs(blob, `ventas_${new Date().toISOString().slice(0,10)}.xlsx`);
  };

  return (
    <div>
      <h1 className="mb-4">Dashboard</h1>
      <DashboardSquares dataSales={dataSales}/>
      <div className="mb-5 mt-5 w-100 d-flex justify-content-center">
        <button className="exportar_btn" onClick={exportarVentas}>
          Exportar Ventas
        </button>
      </div>
      <TableDashboard setDataSales={setDataSales}/>
    </div>
  );
};

export default Dashboard;
