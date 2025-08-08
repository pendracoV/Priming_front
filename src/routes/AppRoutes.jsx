// src/routes/AppRoutes.jsx

import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet, useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { validateLevelAccess, getLastAccessibleLevel } from '../utils/gameValidation';
import AdminUserCreate from '../admin/AdminUserCreate';

// Páginas públicas
import Login from '../pages/Login';

// Páginas privadas comunes
import Perfil from '../pages/Perfil';

// Páginas de evaluador
import AsignarAcompanante from '../pages/AsignarAcompanante';
import NinosList from '../pages/NinosListPage';
import SeleccionMundos from '../Game/SeleccionMundos';
import NivelCognados from '../Game/levels/NivelCognados';
import NivelParesMinimos from '../Game/levels/NivelParesMinimos';
import Encuesta from '../Game/Encuesta';
import Registro from '../pages/Register';

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

// Solo rutas públicas (login/registro) cuando NO hay sesión
const PublicRoute = ({ restricted = false }) => {
  const { user } = useContext(AuthContext);
  if (restricted && user) {
    return <Navigate to="/perfil" replace />;
  }
  return <Outlet />;
};

// ✅ NUEVO: Middleware para proteger acceso a niveles
const ProtectedLevelRoute = ({ children, gameType }) => {
  const { user } = useContext(AuthContext);
  const { dificultad, nivel } = useParams();

  // Validar que el usuario puede acceder a este nivel
  const canAccess = validateLevelAccess(user, gameType, dificultad, nivel);
  
  if (!canAccess) {
    console.log(`🚫 Acceso denegado al nivel ${gameType}/${dificultad}/${nivel}`);
    
    // Obtener el último nivel al que SÍ puede acceder
    const lastAccessibleLevel = getLastAccessibleLevel(user, gameType, dificultad);
    
    // Redirigir al último nivel válido
    const redirectPath = `/nivel/${gameType}/${dificultad}/${lastAccessibleLevel}`;
    console.log(`↩️ Redirigiendo a: ${redirectPath}`);
    
    return <Navigate to={redirectPath} replace />;
  }

  // Si puede acceder, renderizar el componente
  return children;
};

// ✅ NUEVO: Wrapper específico para Cognados
const ProtectedCognadosLevel = () => {
  return (
    <ProtectedLevelRoute gameType="cognados">
      <NivelCognados />
    </ProtectedLevelRoute>
  );
};

// ✅ NUEVO: Wrapper específico para Pares Mínimos
const ProtectedParesMinimosLevel = () => {
  return (
    <ProtectedLevelRoute gameType="pares-minimos">
      <NivelParesMinimos />
    </ProtectedLevelRoute>
  );
};

// ✅ NUEVO: Middleware para validar parámetros de nivel
const ValidateLevelParams = ({ children, gameType }) => {
  const { dificultad, nivel } = useParams();

  // Validar que los parámetros son válidos
  const validDifficulties = ['facil', 'medio', 'dificil'];
  const nivelNumerico = parseInt(nivel);

  // Verificar dificultad válida
  if (!validDifficulties.includes(dificultad)) {
    console.log(`🚫 Dificultad inválida: ${dificultad}`);
    return <Navigate to="/seleccion-mundo" replace />;
  }

  // Verificar nivel numérico válido
  if (isNaN(nivelNumerico) || nivelNumerico < 1) {
    console.log(`🚫 Nivel inválido: ${nivel}`);
    return <Navigate to={`/nivel/${gameType}/facil/1`} replace />;
  }

  // Verificar rango de niveles según game type y dificultad
  let maxLevel = 5; // Por defecto
  if (gameType === 'cognados' && dificultad === 'facil') {
    maxLevel = 10;
  }

  if (nivelNumerico > maxLevel) {
    console.log(`🚫 Nivel fuera de rango: ${nivel} (máximo: ${maxLevel})`);
    return <Navigate to={`/nivel/${gameType}/${dificultad}/${maxLevel}`} replace />;
  }

  return children;
};

// ✅ NUEVO: Middleware combinado (Validación + Protección)
const SecureLevelRoute = ({ children, gameType }) => {
  return (
    <ValidateLevelParams gameType={gameType}>
      <ProtectedLevelRoute gameType={gameType}>
        {children}
      </ProtectedLevelRoute>
    </ValidateLevelParams>
  );
};

// ─── Definición de Rutas ──────────────────────────────────────────────────────

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        
        {/* 1) PÚBLICAS (login / registro) */}
        <Route element={<PublicRoute restricted={true} />}>
          <Route path="/login" element={<Login />} />
        </Route>

        {/* 2) PRIVADAS (cualquier usuario autenticado) */}
        <Route element={<PrivateRoute />}>
          <Route path="/perfil" element={<Perfil />} />

          {/* 2a) Evaluador */}
          <Route element={<RoleRoute allowedRoles={['evaluador']} />}>
            <Route path="/asignar-nino" element={<AsignarAcompanante />} />
            <Route path="/ninoslist" element={<NinosList />} />
            <Route path="/seleccion-mundo" element={<SeleccionMundos />} />
            
            {/* ✅ RUTAS PROTEGIDAS DE NIVELES */}
            <Route 
              path="/nivel/cognados/:dificultad/:nivel" 
              element={
                <SecureLevelRoute gameType="cognados">
                  <NivelCognados />
                </SecureLevelRoute>
              } 
            />
            
            <Route 
              path="/nivel/pares-minimos/:dificultad/:nivel" 
              element={
                <SecureLevelRoute gameType="pares-minimos">
                  <NivelParesMinimos />
                </SecureLevelRoute>
              } 
            />
            
            <Route path="/encuesta" element={<Encuesta />} />
          </Route>

          {/* 2b) Administrador */}
          <Route element={<RoleRoute allowedRoles={['administrador']} />}>
            <Route path="/admin/crear-usuario" element={<AdminUserCreate />} />
          </Route>
        </Route>

        {/* 3) REGISTRO PÚBLICO */}
        <Route path="/registro" element={<Registro />} />

        {/* 4) REDIRECCIONES ESPECÍFICAS */}
        
        {/* Redirigir rutas de niveles sin parámetros válidos */}
        <Route path="/nivel" element={<Navigate to="/seleccion-mundo" replace />} />
        <Route path="/nivel/cognados" element={<Navigate to="/nivel/cognados/facil/1" replace />} />
        <Route path="/nivel/pares-minimos" element={<Navigate to="/nivel/pares-minimos/facil/1" replace />} />
        
        {/* Redirigir home a perfil si está logueado, sino a login */}
        <Route 
          path="/" 
          element={
            <PrivateRoute>
              <Navigate to="/perfil" replace />
            </PrivateRoute>
          } 
        />

        {/* 5) CATCH-ALL: redirigir a login */}
        <Route path="*" element={<Navigate to="/login" replace />} />

      </Routes>
    </BrowserRouter>
  );
}

// ✅ FUNCIONES DE UTILIDAD ADICIONALES

// Función para logging de navegación (opcional, para debugging)
export const logNavigation = (from, to, reason = '') => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`🧭 Navegación: ${from} → ${to} ${reason ? `(${reason})` : ''}`);
  }
};

// Función para limpiar localStorage de niveles inválidos
export const cleanInvalidLevelStates = (user) => {
  if (!user) return;
  
  const keys = Object.keys(localStorage);
  const gameStateKeys = keys.filter(key => key.startsWith('gameState_'));
  
  gameStateKeys.forEach(key => {
    try {
      const data = JSON.parse(localStorage.getItem(key));
      const maxAge = 24 * 60 * 60 * 1000; // 24 horas
      
      if (Date.now() - data.sessionTimestamp > maxAge) {
        localStorage.removeItem(key);
        console.log(`🗑️ Estado de juego expirado eliminado: ${key}`);
      }
    } catch (error) {
      localStorage.removeItem(key);
      console.log(`🗑️ Estado de juego corrupto eliminado: ${key}`);
    }
  });
};