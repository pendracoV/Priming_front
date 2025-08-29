// src/admin/AdminSidebar.jsx
import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { AuthContext } from '../context/AuthContext';

const SidebarContainer = styled.div`
  display: flex;              /* Flex para distribución vertical */
  flex-direction: column;     /* Columna vertical */
  height: 100vh;              /* Ocupa toda la altura */
  padding: 2rem 1rem;
  background-color: #ffffffff;
  color: white;
  overflow-y: auto;
  
`;

const SidebarItem = styled(NavLink).attrs({ end: true })`
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  margin-bottom: 0.5rem;
  color: gray;
  text-decoration: none;
  border-radius: 0.5rem;
  font-size: 0.95rem;

  svg {
    margin-right: 0.75rem;
    width: 1.25rem;
    height: 1.25rem;
  }

  &.active {
    background-color: #52565eff; 
  }

  &:hover {
    background-color: #4b556336; 
  }
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: auto;
  padding: 0.5rem 1rem;
  width: 100%;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 0.9rem;
  background-color: #f87171; /* rojo claro Tailwind */
  transition: all 0.2s ease;

  &:hover {
    background-color: #b91c1c; /* rojo oscuro Tailwind */
  }

  svg {
    margin-right: 0.5rem;
    width: 1rem;
    height: 1rem;
  }
`;

const SidebarLogo = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
  justify-content: center;
`;

const LogoImage = styled.img`
  width: 75px;
  height: 75px;
`;

export default function AdminSidebar() {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <SidebarContainer>
      <SidebarLogo>
        <LogoImage src="/images/logo.png" alt="Logo Admin" />
      </SidebarLogo>

      <SidebarItem to="/admin" end>
        <svg fill="currentColor" viewBox="0 0 20 20"><path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"/><path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"/></svg>
        Inicio
      </SidebarItem>

      <SidebarItem to="/admin/ver-usuarios">
        <svg fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/></svg>
        Ver Usuarios
      </SidebarItem>

      <SidebarItem to="/admin/crear-usuario">
        <svg fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 4a3 3 0 00-3 3v6a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H5zm-1 9v-1h5v2H5a1 1 0 01-1-1zm7 1h4a1 1 0 001-1v-1h-5v2zm0-4h5V8h-5v2zM9 8H4v2h5V8z" clipRule="evenodd"/></svg>
        Crear Usuario
      </SidebarItem>

      <SidebarItem to="/admin/kanban">
        <svg fill="currentColor" viewBox="0 0 20 20"><path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>
        Perfil
      </SidebarItem>

      <LogoutButton onClick={handleLogout}>
        <svg fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd"/></svg>
        Cerrar sesión
      </LogoutButton>
    </SidebarContainer>
  );
}
