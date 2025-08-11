// src/admin/AdminUserList.jsx
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import api from '../api/config';

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
        const res = await api.get('/users'); // Asegúrate que esta ruta esté habilitada en el backend
        setUsuarios(res.data);
      } catch (err) {
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
