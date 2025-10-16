import React from 'react'
import { Navigate, Routes } from 'react-router'
import Dashboard from '../pages/dashboard/Dashboard/Dashboard'
import Login from '../pages/Login'
import { Route } from 'react-router'
import PrivateRoute from './PrivateRoute'
import Layout from '../pages/dashboard/Layout/Layout'
import Productos from '../pages/dashboard/Productos/Productos'
import Usuarios from '../pages/dashboard/Usuarios/Usuarios'
import Cupones from '../pages/dashboard/Cupones/Cupones'
import Recibos from '../pages/dashboard/Recibos/Recibos'
import Cortes from '../pages/dashboard/Cortes/Cortes'
import Reportes from '../pages/dashboard/Ventas/Ventas'
import Ventas from '../pages/dashboard/Ventas/Ventas'
import Apartados from '../pages/dashboard/Apartados/Apartados'
import CambioTienda from '../pages/dashboard/CambioTienda/CambioTienda'
import Stock from '../pages/dashboard/Stock/Stock'
import Movimientos from '../pages/dashboard/Movimientos/Movimientos'
import ListadoCortes from '../pages/dashboard/ListadoCortes/ListadoCortes'
import BarcodeManager from '../pages/dashboard/BarcodeManager/BarcodeManager'

const AppRoutes = () => {
  
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      
      {/* Ruta principal que incluye el sidenav y el contenido */}
      <Route path="/dashboard" element={<Layout />}>
        {/* Definir rutas dentro de Layout */}
        <Route index element={<Navigate to="reportes" replace />} />
        <Route path="reportes" element={<PrivateRoute element={<Dashboard />} />} />
        <Route path="ventas" element={<PrivateRoute element={<Ventas />} />} />
        <Route path="productos" element={<PrivateRoute element={<Productos />} />} />
        <Route path="stock" element={<PrivateRoute element={<Stock />} />} />
        <Route path="movimientos" element={<PrivateRoute element={<Movimientos />} />} />
        <Route path="usuarios" element={<PrivateRoute element={<Usuarios />} />} />
        <Route path="cupones" element={<PrivateRoute element={<Cupones />} />} />
        <Route path="recibos" element={<PrivateRoute element={<Recibos />} />} />
        <Route path="cortes" element={<PrivateRoute element={<Cortes />} />} />
        <Route path="apartados" element={<PrivateRoute element={<Apartados />} />} />
        <Route path="cambio-tienda" element={<PrivateRoute element={<CambioTienda />} />} />
        <Route path="listado-cortes" element={<PrivateRoute element={<ListadoCortes />} />} />
        <Route path="codigos-barras" element={<PrivateRoute element={<BarcodeManager />} />} />
        {/* Otras rutas pueden ser agregadas aquí */}
      </Route>

      <Route path="*" element={<Navigate to="/dashboard/reportes" replace />} />
    </Routes>
  )
}

export default AppRoutes