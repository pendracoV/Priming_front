// src/admin/AdminLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import styled, { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@300;400;600;700&display=swap');

  body {
    font-family: 'Rubik', sans-serif;
    background-color: #F4F5FA;
    margin: 0;
    padding: 0;
    color: #212529;
  }
`;

const LayoutContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100vh;
  overflow: hidden;
`;

const SidebarArea = styled.div`
  width: 250px;
  display: flex;
  flex-direction: column;
`;


const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const Header = styled.header`
  background-color: #fff;
  padding: 15px 25px;
  font-size: 1.1rem;
  font-weight: 600;
  box-shadow: 0 2px 4px rgba(0,0,0,0.08);
`;

const ContentArea = styled.main`
  flex: 1;
  padding: 25px;
  overflow-y: auto;
`;

export default function AdminLayout() {
  return (
    <>
      <GlobalStyle />
      <LayoutContainer>
        <SidebarArea>
          <AdminSidebar />
        </SidebarArea>

        <MainContent>
          <Header>Panel de Administración</Header>

          <ContentArea>
            <Outlet />
          </ContentArea>
        </MainContent>
      </LayoutContainer>
    </>
  );
}
