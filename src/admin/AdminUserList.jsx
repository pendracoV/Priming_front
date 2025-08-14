// src/admin/AdminUserList.jsx
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import API_URL from '../api/config'; // string base de la API

const Container = styled.div`
  padding: 20px;
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 20px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
`;

const Th = styled.th`
  padding: 10px;
  border-bottom: 1px solid #ccc;
  background-color: #f5f5f5;
`;

const Td = styled.td`
  padding: 10px;
  border-bottom: 1px solid #eee;
`;

const ErrorText = styled.p`
  color: red;
`;

function AdminUserList() {
  const [usuarios, setUsuarios] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const token = localStorage.getItem('token'); // tu token JWT
        if (!token) {
          setError('No se encontró token de autenticación');
          return;
        }

        // Instanciar axios con la URL base
        const api = axios.create({
          baseURL: API_URL,
          headers: {
            Authorization: `Bearer ${token}` // ⚠️ importante: "Bearer "
          }
        });

        const res = await api.get('/users'); // endpoint que retorna todos los usuarios
        setUsuarios(res.data);
      } catch (err) {
        console.error('Error al obtener usuarios:', err);
        setError('Error al obtener la lista de usuarios');
      }
    };

    fetchUsuarios();
  }, []);

  return (
    <Container>
      <Title>Lista de Usuarios Registrados</Title>
      {error && <ErrorText>{error}</ErrorText>}
      <Table>
        <thead>
          <tr>
            <Th>ID</Th>
            <Th>Nombre</Th>
            <Th>Correo Electrónico</Th>
            <Th>Tipo de Usuario</Th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map(user => (
            <tr key={user.id}>
              <Td>{user.id}</Td>
              <Td>{user.nombre}</Td>
              <Td>{user.correo_electronico}</Td>
              <Td>{user.tipo_usuario}</Td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}

export default AdminUserList;
