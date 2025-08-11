// src/admin/AdminDashboard.jsx

import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function AdminDashboard() {
  const { user } = useContext(AuthContext);

  return (
    <div>
      <h1>Bienvenido, {user?.nombre || 'Administrador'} 👋</h1>
      <p>Desde aquí puedes gestionar usuarios y configurar el sistema.</p>
    </div>
  );
}
