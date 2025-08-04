// src/admin/AdminSidebar.jsx

import React from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

const SidebarContainer = styled.div`
  padding: 2rem 1rem;
`;

const SidebarItem = styled(NavLink)`
  display: block;
  margin-bottom: 1rem;
  padding: 0.5rem 1rem;
  color: white;
  text-decoration: none;
  border-radius: 4px;

  &.active {
    background-color: #32455a;
  }

  &:hover {
    background-color: #2a3b4d;
  }
`;

export default function AdminSidebar() {
  return (
    <SidebarContainer>
      <h2>Admin</h2>
      <SidebarItem to="/admin">Inicio</SidebarItem>
      <SidebarItem to="/admin/crear-usuario">Crear Usuario</SidebarItem>
      <SidebarItem to="/admin/ver-usuarios">Ver Usuarios</SidebarItem>
    </SidebarContainer>
  );
}
