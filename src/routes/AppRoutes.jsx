import React from 'react'
import { Navigate, Routes } from 'react-router'
import Dashboard from '../pages/dashboard/Dashboard'
import Login from '../pages/Login'
import { Route } from 'react-router'
import PrivateRoute from './PrivateRoute'
import Layout from '../pages/dashboard/Layout'
import Productos from '../pages/dashboard/Productos'
import Usuarios from '../pages/dashboard/Usuarios'

const AppRoutes = () => {
  return (
    <Routes>
        <Route path="/login" element={<Login />} />
      
      {/* Ruta principal que incluye el sidenav y el contenido */}
      <Route path="/dashboard" element={<Layout />}>
        {/* Definir rutas dentro de Layout */}
        <Route index element={<Navigate to="statics" replace />} />
        <Route path="statics" element={<PrivateRoute element={<Dashboard />} />} />
        <Route path="productos" element={<PrivateRoute element={<Productos />} />} />
        <Route path="usuarios" element={<PrivateRoute element={<Usuarios />} />} />
        {/* Otras rutas pueden ser agregadas aquí */}
      </Route>
    </Routes>
  )
}

export default AppRoutes