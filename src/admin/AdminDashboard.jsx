// src/admin/AdminDashboard.jsx
import React, { useContext } from 'react';
import styled from 'styled-components';
import { AuthContext } from '../context/AuthContext';

const Card = styled.div`
  background-color: white;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  border-radius: 0.5rem;
  padding: 1rem; /* sm:p-6 equivalente */
  margin-top: 2rem;
  padding: 1rem;      /* espacio interno */
  width: 25%;       /* ancho fijo */
  margin: 0.5rem;     /* espacio alrededor */
`;

const CardContent = styled.div`
  display: flex;
  align-items: center;
`;

const CardsContainer = styled.div`
  display: flex;          /* activa flexbox */
  gap: 1rem;              /* espacio entre tarjetas */
  flex-wrap: wrap;        /* permite que se muevan a otra fila si no caben */
  margin-top: 2rem;
`;


const Stats = styled.div`
  flex-shrink: 0;
`;

const StatNumber = styled.span`
  font-size: 1.5rem; /* text-2xl */
  font-weight: bold;
  color: #111827; /* text-gray-900 */
`;

const StatLabel = styled.h3`
  font-size: 0.875rem; /* text-base */
  font-weight: normal;
  color: #6b7280; /* text-gray-500 */
`;

const StatChange = styled.div`
  margin-left: auto;
  display: flex;
  align-items: center;
  color: #10b981; /* text-green-500 */
  font-weight: bold;
  font-size: 1rem; /* text-base */
`;

const ChangeIcon = styled.svg`
  width: 1.25rem; /* w-5 */
  height: 1.25rem;
  margin-left: 0.25rem;
`;

export default function AdminDashboard() {
  const { user } = useContext(AuthContext);

  return (
    <div>
      <h1>Bienvenido, {user?.nombre || 'Administrador'} 👋</h1>
      <p>Desde aquí puedes gestionar usuarios y configurar el sistema.</p>
    <CardsContainer>
            <Card>
        <CardContent>
          <Stats>
            <StatNumber>100</StatNumber>
            <StatLabel>Niños</StatLabel>
          </Stats>
          <StatChange>
            26%
            <ChangeIcon fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z" clipRule="evenodd"/>
            </ChangeIcon>
          </StatChange>
        </CardContent>
      </Card>
            <Card>
        <CardContent>
          <Stats>
            <StatNumber>50</StatNumber>
            <StatLabel>Evaluadores</StatLabel>
          </Stats>
          <StatChange>
            5%
            <ChangeIcon fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z" clipRule="evenodd"/>
            </ChangeIcon>
          </StatChange>
        </CardContent>
      </Card>
            <Card>
        <CardContent>
          <Stats>
            <StatNumber>5</StatNumber>
            <StatLabel>Administradores</StatLabel>
          </Stats>
          <StatChange>
            14.6%
            <ChangeIcon fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z" clipRule="evenodd"/>
            </ChangeIcon>
          </StatChange>
        </CardContent>
      </Card>
    </CardsContainer>

    </div>
  );
}
