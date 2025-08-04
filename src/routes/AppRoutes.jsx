// src/routes/AppRoutes.jsx

import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

// Páginas públicas
import Login from '../pages/Login';
import Registro from '../pages/Register';

// Páginas privadas comunes
import Perfil from '../pages/Perfil';

// Páginas de evaluador
import AsignarAcompanante from '../pages/AsignarAcompanante';
import NinosList from '../pages/NinosListPage';
import SeleccionMundos from '../Game/SeleccionMundos';
import NivelCognados from '../Game/levels/NivelCognados';
import NivelParesMinimos from '../Game/levels/NivelParesMinimos';
import Encuesta from '../Game/Encuesta';

// Páginas de administrador
import AdminLayout from '../admin/AdminLayout';
import AdminDashboard from '../admin/AdminDashboard';
import AdminUserCreate from '../admin/AdminUserCreate';
import AdminUserList from '../admin/AdminUserList';

// ─── Middlewares de Ruta ───────────────────────────────────────────────────────

// Solo usuarios autenticados
const PrivateRoute = () => {
  const { user } = useContext(AuthContext);
  if (!user) return <Navigate to="/login" replace />;
  return <Outlet />;
};

// Solo roles específicos
const RoleRoute = ({ allowedRoles }) => {
  const { user } = useContext(AuthContext);
  if (!user) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(user.tipo_usuario)) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};

// Solo rutas públicas cuando NO hay sesión
const PublicRoute = ({ restricted = false }) => {
  const { user } = useContext(AuthContext);
  if (restricted && user) {
    return <Navigate to="/perfil" replace />;
  }
  return <Outlet />;
};

// ─── Definición de Rutas ──────────────────────────────────────────────────────

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* 1) Rutas públicas */}
        <Route element={<PublicRoute restricted={true} />}>
          <Route path="/login" element={<Login />} />
        </Route>
        <Route path="/registro" element={<Registro />} />

        {/* 2) Rutas privadas (usuario autenticado) */}
        <Route element={<PrivateRoute />}>
          <Route path="/perfil" element={<Perfil />} />

          {/* 2a) Rutas de evaluador */}
          <Route element={<RoleRoute allowedRoles={['evaluador']} />}>
            <Route path="/asignar-nino" element={<AsignarAcompanante />} />
            <Route path="/ninoslist" element={<NinosList />} />
            <Route path="/seleccion-mundo" element={<SeleccionMundos />} />
            <Route path="/nivel/cognados/:dificultad/:nivel" element={<NivelCognados />} />
            <Route path="/nivel/pares-minimos/:dificultad/:nivel" element={<NivelParesMinimos />} />
            <Route path="/encuesta" element={<Encuesta />} />
          </Route>

          {/* 2b) Rutas de administrador */}
          <Route element={<RoleRoute allowedRoles={['administrador']} />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="crear-usuario" element={<AdminUserCreate />} />
              <Route path="ver-usuarios" element={<AdminUserList />} />
            </Route>
          </Route>
        </Route>

        {/* 3) Catch-all: redirigir a login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
