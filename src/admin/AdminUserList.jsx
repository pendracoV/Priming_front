// src/admin/AdminUserList.jsx
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import API_URL from '../api/config';
import Modal from '../components/Modal'; // 👈 importa tu modal

// --- Estilos ---
const Container = styled.div`
  padding: 20px;
  background: #fff;
  color: #111;
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 20px;
  font-weight: 600;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  margin-top: 20px;
  font-size: 0.95rem;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
  border-radius: 8px;
  overflow: hidden;
`;

const Th = styled.th`
  padding: 12px;
  background-color: #000000ff;
  color: #fff;
  text-align: left;
  font-weight: 600;
`;

const Td = styled.td`
  padding: 12px;
  border-bottom: 1px solid #eee;
  background-color: #fff;
`;

const Tr = styled.tr`
  &:nth-child(even) ${Td} {
    background-color: #f9f9f9;
  }

  &:hover ${Td} {
    background-color: #00000021;
  }
`;

const ErrorText = styled.p`
  color: red;
  font-weight: bold;
`;

const Filter = styled.select`
  padding: 6px 10px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 6px;
`;

const Button = styled.button`
  margin: 0 5px;
  padding: 6px 12px;
  border: none;
  background-color: ${props => props.danger ? '#e74c3c' : '#3498db'};
  color: white;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.85rem;
  transition: all 0.2s ease;

  &:hover {
    opacity: 0.9;
    transform: scale(1.03);
  }
`;

const Input = styled.input`
  padding: 6px;
  border: 1px solid #ccc;
  border-radius: 6px;
  width: 95%;
`;

const Select = styled.select`
  padding: 6px;
  border: 1px solid #ccc;
  border-radius: 6px;
  width: 100%;
`;

// --- Componente principal ---
function AdminUserList() {
  const [usuarios, setUsuarios] = useState([]);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('todos');
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({
    nombre: '',
    correo_electronico: '',
    tipo_usuario: ''
  });

  // Estados del modal
  const [modalOpen, setModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    title: '',
    message: '',
    onConfirm: null,
    confirmText: 'Confirmar',
    cancelText: 'Cancelar',
    showCancel: true
  });

  // Obtener lista de usuarios
  const fetchUsuarios = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No se encontró token de autenticación');
        return;
      }

      const res = await axios.get(`${API_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setUsuarios(res.data);
    } catch (err) {
      setError('Error al obtener la lista de usuarios');
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  // --- Acciones CRUD ---
  const confirmDelete = (id) => {
    setModalConfig({
      title: "Eliminar usuario",
      message: "¿Seguro que deseas eliminar este usuario?",
      onConfirm: () => handleDelete(id),
      confirmText: "Eliminar",
      cancelText: "Cancelar",
      showCancel: true
    });
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsuarios(usuarios.filter(u => u.id !== id));

      // Mensaje de éxito
      setModalConfig({
        title: "Éxito",
        message: "Usuario eliminado correctamente",
        onConfirm: () => setModalOpen(false),
        confirmText: "OK",
        showCancel: false
      });
      setModalOpen(true);

    } catch (err) {

      setModalConfig({
        title: "Error",
        message: "No se pudo eliminar el usuario",
        onConfirm: () => setModalOpen(false),
        confirmText: "Cerrar",
        showCancel: false
      });
      setModalOpen(true);
    }
  };

  const handleEditClick = (user) => {
    setEditingUser(user.id);
    setEditForm({
      nombre: user.nombre,
      correo_electronico: user.correo_electronico,
      tipo_usuario: user.tipo_usuario
    });
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSave = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(`${API_URL}/users/${id}`, editForm, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setUsuarios(usuarios.map(u => (u.id === id ? res.data : u)));
      setEditingUser(null);

      // Modal de éxito
      setModalConfig({
        title: "Éxito",
        message: "Usuario actualizado correctamente",
        onConfirm: () => setModalOpen(false),
        confirmText: "OK",
        showCancel: false
      });
      setModalOpen(true);

    } catch (err) {

      setModalConfig({
        title: "Error",
        message: "No se pudo actualizar el usuario",
        onConfirm: () => setModalOpen(false),
        confirmText: "Cerrar",
        showCancel: false
      });
      setModalOpen(true);
    }
  };

  // --- Filtrar usuarios ---
  const filteredUsuarios = filter === 'todos'
    ? usuarios
    : usuarios.filter(u => u.tipo_usuario === filter);

  return (
    <Container>
      <Title>Lista de Usuarios Registrados</Title>

      {error && <ErrorText>{error}</ErrorText>}

      <Filter value={filter} onChange={(e) => setFilter(e.target.value)}>
        <option value="todos">Todos</option>
        <option value="administrador">Administradores</option>
        <option value="evaluador">Evaluadores</option>
        <option value="niño">Niños</option>
      </Filter>

      <Table>
        <thead>
          <tr>
            <Th>ID</Th>
            <Th>Nombre</Th>
            <Th>Correo Electrónico</Th>
            <Th>Tipo de Usuario</Th>
            <Th>Acciones</Th>
          </tr>
        </thead>
        <tbody>
          {filteredUsuarios.length > 0 ? (
            filteredUsuarios.map(user => (
              <Tr key={user.id}>
                {editingUser === user.id ? (
                  <>
                    <Td>{user.id}</Td>
                    <Td>
                      <Input
                        type="text"
                        name="nombre"
                        value={editForm.nombre}
                        onChange={handleEditChange}
                      />
                    </Td>
                    <Td>
                      <Input
                        type="email"
                        name="correo_electronico"
                        value={editForm.correo_electronico}
                        onChange={handleEditChange}
                      />
                    </Td>
                    <Td>
                      <Select
                        name="tipo_usuario"
                        value={editForm.tipo_usuario}
                        onChange={handleEditChange}
                      >
                        <option value="administrador">Administrador</option>
                        <option value="evaluador">Evaluador</option>
                        <option value="niño">Niño</option>
                      </Select>
                    </Td>
                    <Td>
                      <Button onClick={() => handleEditSave(user.id)}>Guardar</Button>
                      <Button danger onClick={() => setEditingUser(null)}>Cancelar</Button>
                    </Td>
                  </>
                ) : (
                  <>
                    <Td>{user.id}</Td>
                    <Td>{user.nombre}</Td>
                    <Td>{user.correo_electronico}</Td>
                    <Td>{user.tipo_usuario}</Td>
                    <Td>
                      <Button onClick={() => handleEditClick(user)}>Editar</Button>
                      <Button danger onClick={() => confirmDelete(user.id)}>Eliminar</Button>
                    </Td>
                  </>
                )}
              </Tr>
            ))
          ) : (
            <Tr>
              <Td colSpan="5" style={{ textAlign: "center", padding: "20px" }}>
                No hay usuarios registrados
              </Td>
            </Tr>
          )}
        </tbody>
      </Table>

      {/* Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalConfig.title}
        onConfirm={modalConfig.onConfirm}
        confirmText={modalConfig.confirmText}
        cancelText={modalConfig.cancelText}
        showCancel={modalConfig.showCancel}
      >
        <p>{modalConfig.message}</p>
      </Modal>
    </Container>
  );
}

export default AdminUserList;
