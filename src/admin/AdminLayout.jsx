// src/admin/AdminLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import styled, { createGlobalStyle } from 'styled-components';

// Global style para toda la app (solo en el layout de admin)
const GlobalStyle = createGlobalStyle`
  body {
    font-family: 'Inter', sans-serif;
    margin: 0;
    padding: 0;
  }
`;

const LayoutContainer = styled.div`
  display: flex;
  height: 100vh; /* ocupa toda la altura de la ventana */
  width: 100%;
  margin: 0;
  padding: 0;
`;

const SidebarArea = styled.div`
  width: 250px; /* ancho fijo de la sidebar */
  background-color: #1f2937; /* fondo oscuro estilo Tailwind gray-800 */
  color: white;
  display: flex;
  flex-direction: column;
  height: 100%; /* ocupa toda la altura del layout */
`;

const ContentArea = styled.div`
  flex: 1; /* ocupa todo el espacio restante */
  background-color: #f3f6fb;
  padding: 2em;
  width: 100%;
  overflow-y: auto; /* scroll vertical si el contenido es largo */
`;

export default function AdminLayout() {
  return (
    <>
      <GlobalStyle />
      <LayoutContainer>
        <SidebarArea>
          <AdminSidebar />
        </SidebarArea>
        <ContentArea>
          <Outlet />
        </ContentArea>
      </LayoutContainer>
    </>
  );
}
