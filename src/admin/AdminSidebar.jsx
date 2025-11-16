// src/admin/AdminSidebar.jsx
import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { AuthContext } from '../context/AuthContext';

const SidebarContainer = styled.div`
  width: 250px;
  min-height: 100vh;
  position: relative;
  background: linear-gradient(180deg, #ffffff 0%, #e2f2ff 40%, #a8d8ff 100%);
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0 6px rgba(0, 0, 0, 0.15);
  overflow: hidden;

  /* Overlay sutil para suavizar la transición */
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(0,0,0,0.1) 100%);
    pointer-events: none;
  }
`;




const SidebarLogo = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 25px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const LogoImage = styled.img`
  width: 45px;
  height: 45px;
  margin-right: 10px;
  border-radius: 10px;
`;

const LogoText = styled.span`
  font-size: 1.1rem;
  font-weight: 700;
  background: linear-gradient(90deg, #004c91, #0090e7);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const NavList = styled.nav`
  display: flex;
  flex-direction: column;
  padding-top: 15px;
  flex: 1;
`;

const SidebarItem = styled(NavLink)`
  position: relative;
  display: flex;
  align-items: center;
  padding: 12px 25px;
  color: #1f2937; /* gris oscuro, excelente legibilidad sobre azul claro */
  text-decoration: none;
  font-size: 0.95rem;
  font-weight: 500;
  transition: all 0.25s ease;
  border-left: 3px solid transparent;
  z-index: 1;

  svg {
    margin-right: 12px;
    width: 20px;
    height: 20px;
    flex-shrink: 0;
    opacity: 0.85;
  }

  &.active {
    background: rgba(0, 144, 231, 0.25);
    backdrop-filter: blur(4px);
    color: #0d1b2a;
    border-left-color: #0090e7;
    text-shadow: 0 1px 2px rgba(255, 255, 255, 0.6);
  }

  &:hover {
    background: rgba(0, 144, 231, 0.2);
    color: #0d1b2a;
    text-shadow: 0 1px 2px rgba(255, 255, 255, 0.7);
  }
`;

const LogoutButton = styled.button`
  margin: 20px 25px;
  background-color: #E74C3C;
  border: none;
  color: white;
  border-radius: 6px;
  padding: 10px 15px;
  cursor: pointer;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  transition: all 0.25s ease;

  svg {
    margin-right: 10px;
    width: 18px;
    height: 18px;
  }

  &:hover {
    background-color: #C0392B;
  }
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
        <LogoText>Admin</LogoText>
      </SidebarLogo>

      <NavList>
        <SidebarItem to="/admin" end>
          <svg fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
            <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
          </svg>
          Inicio
        </SidebarItem>

        <SidebarItem to="/admin/ver-usuarios">
          <svg fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
              clipRule="evenodd"
            />
          </svg>
          Ver Usuarios
        </SidebarItem>

        <SidebarItem to="/admin/crear-usuario">
          <svg fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M5 4a3 3 0 00-3 3v6a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H5zm-1 9v-1h5v2H5a1 1 0 01-1-1zm7 1h4a1 1 0 001-1v-1h-5v2zm0-4h5V8h-5v2zM9 8H4v2h5V8z"
              clipRule="evenodd"
            />
          </svg>
          Crear Usuario
        </SidebarItem>

        <SidebarItem to="/admin/kanban">
          <svg fill="currentColor" viewBox="0 0 20 20">
            <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
          Perfil
        </SidebarItem>
      </NavList>

      <LogoutButton onClick={handleLogout}>
        <svg fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
            clipRule="evenodd"
          />
        </svg>
        Cerrar sesión
      </LogoutButton>
    </SidebarContainer>
  );
}
