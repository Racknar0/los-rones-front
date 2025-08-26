import React from 'react';

import ExpirationsBoxes from './ExpirationsBoxes';
import './ExpirationsByStore.scss';

const ExpirationsByStore = ({ storesExpirations }) => {
  // storesExpirations: [{ storeName, products: [...] }]
  return (
    <div className="expirations-by-store-container">
      <h4 className="mb-3">Productos próximos a vencer por tienda (15 días)</h4>
      {/* Leyenda global de colores */}
      <div className="exp-legend-global mb-4 gap-2 d-flex justify-content-center">
        <span className="legend-item exp-green">15-10 días</span>
        <span className="legend-item exp-yellow">9-5 días</span>
        <span className="legend-item exp-red">Menos de 5 días</span>
      </div>
      <div className="stores-scroll">
        {storesExpirations && storesExpirations.length > 0 ? (
          storesExpirations.map((store, idx) => (
            <div className="store-expirations-box" key={store.storeName || idx}>
              <div className="store-title">{store.storeName}</div>
              <ExpirationsBoxes products={store.products} />
            </div>
          ))
        ) : (
          <div className="no-stores">No hay tiendas disponibles.</div>
        )}
      </div>
    </div>
  );
};

export default ExpirationsByStore;
