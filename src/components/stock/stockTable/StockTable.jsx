import React from 'react';
import './StockTable.scss'; // Asegúrate de tener tus estilos

const StockTable = ({
  stockUnits,
  selectedStockIds,
  setSelectedStockIds,
  toggleStockSelection,
}) => {
  // Ordenar stockUnits por createdAt en orden ascendente (las más antiguas primero)
  const sortedStockUnits = [...stockUnits].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  // Para la fecha de vencimiento solo se muestra la fecha (por ejemplo "04-marzo-2025")
  const formatLocaleDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Para la fecha de creación se muestra fecha y hora
  const formatLocaleDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="modal-body">
      {sortedStockUnits.length === 0 ? (
        <p>No hay unidades de stock para este producto en esta tienda.</p>
      ) : (
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedStockIds(sortedStockUnits.map((s) => s.id));
                    } else {
                      setSelectedStockIds([]);
                    }
                  }}
                  checked={selectedStockIds.length === sortedStockUnits.length}
                />
              </th>
              <th>#</th>
              <th>Tienda</th>
              <th>Fecha de Vencimiento</th>
              <th>Fecha de Creación</th>
              {/* <th>Acción</th> */}
            </tr>
          </thead>
          <tbody>
            {sortedStockUnits.map((stock, index) => (
              <tr key={stock.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedStockIds.includes(stock.id)}
                    onChange={() => toggleStockSelection(stock.id)}
                  />
                </td>
                {/* Enumeración: se usa el índice + 1 */}
                <td>{index + 1}</td>
                <td>{stock.store?.name}</td>
                <td>
                  {stock.expirationDate
                    ? formatLocaleDate(stock.expirationDate)
                    : 'N/A'}
                </td>
                <td>{formatLocaleDateTime(stock.createdAt)}</td>
                {/* <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={async () => {
                      // Aquí integras la eliminación individual (por ejemplo, usando httpService.deleteData)
                      console.log(`Eliminar stock unit ${stock.id}`);
                    }}
                  >
                    Eliminar
                  </button>
                </td> */}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default StockTable;
