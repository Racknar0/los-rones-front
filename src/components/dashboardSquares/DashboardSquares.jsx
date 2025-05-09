import React from 'react';
import './DashboardSquares.scss';

const DashboardSquares = ({ dataSales }) => {
  // Asegurarnos de tener un array
  const sales = Array.isArray(dataSales) ? dataSales : [];

  // Helpers para parsear y formatear
  const toNumber = v => parseFloat(v) || 0;
  const formatCurrency = num =>
    num
      .toFixed(2)
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      .replace(/^/, '$');

  // 1) TOTAL VENTAS = suma de totalAmount de todas las ventas
  const totalVentas = sales.reduce(
    (sum, sale) => sum + toNumber(sale.totalAmount),
    0
  );

  // 2) TOTAL PRODUCTOS = cantidad total de saleItems
  const totalProductos = sales.reduce(
    (sum, sale) => sum + (sale.saleItems?.length || 0),
    0
  );

  // 3) TOTAL EFECTIVO
  const totalEfectivo = sales
    .filter(s => s.paymentMethod === 'efectivo')
    .reduce((sum, sale) => sum + toNumber(sale.totalAmount), 0);

  // 4) TOTAL TARJETA
  const totalTarjeta = sales
    .filter(s => s.paymentMethod === 'tarjeta')
    .reduce((sum, sale) => sum + toNumber(sale.totalAmount), 0);

  // 5) TOTAL TRANSFERENCIAS (antes "OTRO")
  const totalTransferencias = sales
    .filter(s => s.paymentMethod === 'transferencia')
    .reduce((sum, sale) => sum + toNumber(sale.totalAmount), 0);

  // 6) TOTAL CAMBIOS (siempre cero)
  const totalCambios = 0;

  // 7) TOTAL COSTO = suma de purchasePrice de cada producto vendido
  const totalCosto = sales.reduce((sumSale, sale) => {
    const subtotal = (sale.saleItems || []).reduce(
      (sumItem, it) => sumItem + toNumber(it.product.purchasePrice),
      0
    );
    return sumSale + subtotal;
  }, 0);

  // 8) TOTAL GANANCIAS = totalVentas - totalCosto
  const totalGanancias = totalVentas - totalCosto;

  // Array de métricas dinámico
  const metrics = [
    { title: 'TOTAL VENTAS', value: formatCurrency(totalVentas) },
    { title: 'TOTAL PRODUCTOS', value: totalProductos },
    { title: 'TOTAL EFECTIVO', value: formatCurrency(totalEfectivo) },
    { title: 'TOTAL TARJETA', value: formatCurrency(totalTarjeta) },
    { title: 'TOTAL TRANSFERENCIAS', value: formatCurrency(totalTransferencias) },
    { title: 'TOTAL CAMBIOS', value: formatCurrency(totalCambios) },
    { title: 'TOTAL COSTO', value: formatCurrency(totalCosto) },
    { title: 'TOTAL GANANCIAS', value: formatCurrency(totalGanancias) },
  ];

  return (
    <div className="dashboard-container">
      {metrics.map((m, i) => (
        <div key={i} className="dashboard-square">
          <span className="dashboard-title">{m.title}</span>
          <span className="dashboard-value">{m.value}</span>
        </div>
      ))}
    </div>
  );
};

export default DashboardSquares;