// src/admin/AdminDashboard.jsx
import React, { useContext } from 'react';
import styled from 'styled-components';
import { AuthContext } from '../context/AuthContext';
import { ArrowUpRight, Users, UserCheck, Shield } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

// --- Estilos generales ---
const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const Title = styled.h1`
  font-size: 1.6rem;
  font-weight: 700;
  margin-bottom: 5px;
  color: #212529;
`;

const Subtitle = styled.p`
  color: #6C757D;
  margin-bottom: 25px;
`;

const CardsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
`;

const Card = styled.div`
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.07);
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all 0.25s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 5px 12px rgba(0, 0, 0, 0.1);
  }
`;

const CardLeft = styled.div`
  display: flex;
  flex-direction: column;
`;

const StatLabel = styled.span`
  font-size: 0.9rem;
  color: #6C757D;
`;

const StatNumber = styled.span`
  font-size: 1.8rem;
  font-weight: 700;
  color: #212529;
`;

const IconWrapper = styled.div`
  background-color: ${({ color }) => color || '#0090E7'};
  width: 50px;
  height: 50px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

const StatChange = styled.div`
  margin-top: 8px;
  display: flex;
  align-items: center;
  color: #28a745;
  font-weight: 600;
  font-size: 0.95rem;
`;

const ChangeIcon = styled(ArrowUpRight)`
  width: 18px;
  height: 18px;
  margin-left: 4px;
`;

// --- Gráfica ---
const ChartContainer = styled.div`
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.07);
  padding: 25px;
  margin-top: 2rem;
`;

const ChartTitle = styled.h2`
  font-size: 1.1rem;
  color: #212529;
  margin-bottom: 1rem;
  font-weight: 600;
`;

export default function AdminDashboard() {
  const { user } = useContext(AuthContext);

  const data = [
    { name: 'Niños', cantidad: 100, color: '#0090E7' },
    { name: 'Evaluadores', cantidad: 50, color: '#28a745' },
    { name: 'Administradores', cantidad: 5, color: '#6C63FF' },
  ];

  return (
    <PageContainer>
      <Title>Bienvenido, {user?.nombre || 'Administrador'} 👋</Title>
      <Subtitle>Desde aquí puedes gestionar usuarios y configurar el sistema.</Subtitle>

      {/* --- Tarjetas --- */}
      <CardsContainer>
        <Card>
          <CardLeft>
            <StatLabel>Niños</StatLabel>
            <StatNumber>100</StatNumber>
            <StatChange>
              +26% <ChangeIcon />
            </StatChange>
          </CardLeft>
          <IconWrapper color="#0090E7">
            <Users size={24} />
          </IconWrapper>
        </Card>

        <Card>
          <CardLeft>
            <StatLabel>Evaluadores</StatLabel>
            <StatNumber>50</StatNumber>
            <StatChange>
              +5% <ChangeIcon />
            </StatChange>
          </CardLeft>
          <IconWrapper color="#28a745">
            <UserCheck size={24} />
          </IconWrapper>
        </Card>

        <Card>
          <CardLeft>
            <StatLabel>Administradores</StatLabel>
            <StatNumber>5</StatNumber>
            <StatChange>
              +14.6% <ChangeIcon />
            </StatChange>
          </CardLeft>
          <IconWrapper color="#6C63FF">
            <Shield size={24} />
          </IconWrapper>
        </Card>
      </CardsContainer>

      {/* --- Gráfica --- */}
      <ChartContainer>
        <ChartTitle>Distribución de usuarios</ChartTitle>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" stroke="#6C757D" />
            <YAxis stroke="#6C757D" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                borderRadius: '10px',
                boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
              }}
            />
            <Bar
              dataKey="cantidad"
              radius={[8, 8, 0, 0]}
              fill="#0090E7"
              isAnimationActive
            >
              {data.map((entry, index) => (
                <cell
                  key={`cell-${index}`}
                  fill={entry.color}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </PageContainer>
  );
}
