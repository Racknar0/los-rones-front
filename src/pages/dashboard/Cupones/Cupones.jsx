import React, { useState, useEffect } from 'react';
import FormCupones from '../../../components/cupones/CuponesForm/FormCupones';
import CuponesTable from '../../../components/cupones/CuponesTable/CuponesTable';
import HttpService from '../../../services/HttpService';
import { errorAlert } from '../../../helpers/alerts';
import './Cupones.scss';

const Cupones = () => {
  const httpService = new HttpService();
  const [activeTab, setActiveTab] = useState('lista');
  const [cuponesData, setCuponesData] = useState([]);
  const [loading, setLoading] = useState(false);

  // 1) Función para traer todos los cupones
  const getCupones = async () => {
    try {
      setLoading(true);
      const response = await httpService.getData('/coupons');
      if (response.status === 200) {
        setCuponesData(response.data || []);
      } else {
        errorAlert('Error', 'No se pudo obtener la lista de cupones');
      }
    } catch (err) {
      console.error('Error fetching cupones:', err);
      errorAlert('Error', 'No se pudo obtener la lista de cupones');
    } finally {
      setLoading(false);
    }
  };

  // 2) Al montar, cargar la lista
  useEffect(() => {
    getCupones();
  }, []);

  // 3) Callback tras crear un cupón: refresca lista y vuelve a “lista”
  const handleCreated = () => {
    getCupones();
    setActiveTab('lista');
  };

  return (
    <div className="container-fluid mt-4 main_container">
      {/* Navegación de pestañas */}
      <ul className="nav nav-tabs">
        <li className="nav-item">
          <a
            href="#"
            className={`nav-link ${activeTab === 'lista' ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); setActiveTab('lista'); }}
          >
            📋 Lista de Cupones
          </a>
        </li>
        <li className="nav-item">
          <a
            href="#"
            className={`nav-link ${activeTab === 'crear' ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); setActiveTab('crear'); }}
          >
            ➕ Crear Cupón
          </a>
        </li>
      </ul>

      {/* Contenido de cada pestaña */}
      <div className="tab-content mt-3">
        {activeTab === 'lista' && (
          <div className="tab-pane fade show active">
            <CuponesTable
              loading={loading}
              setLoading={setLoading}
              cuponesData={cuponesData}
              getCupones={getCupones}
            />
          </div>
        )}
        {activeTab === 'crear' && (
          <div className="tab-pane fade show active">
            <FormCupones onCreated={handleCreated} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Cupones;
