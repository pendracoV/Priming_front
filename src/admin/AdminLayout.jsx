// src/admin/AdminLayout.jsx

import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import styled from 'styled-components';

const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
`;

const SidebarArea = styled.div`
  width: 250px;
  background-color: #1e2a38;
  color: white;
`;

const ContentArea = styled.div`
  flex: 1;
  padding: 2rem;
  background-color: #f3f6fb;
`;

export default function AdminLayout() {
  return (
    <LayoutContainer>
      <SidebarArea>
        <AdminSidebar />
      </SidebarArea>
      <ContentArea>
        <Outlet />
      </ContentArea>
    </LayoutContainer>
  );
}
