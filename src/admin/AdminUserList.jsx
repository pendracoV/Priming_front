import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import API_URL from '../api/config';
import Modal from '../components/Modal';
import { Edit, Trash2, Save, X } from 'lucide-react';
import { FaChild, FaUserTie, FaUserCog, FaUsers } from 'react-icons/fa';

// 🎨 Colores y estilo visual compartido
const userColors = {
  niño: '#FFA62B',
  evaluador: '#28C76F',
  administrador: '#0090E7',
};

// === Estilos ===
const Container = styled.div`
  background: #fff;
  color: #212529;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.07);
  font-family: 'Rubik', sans-serif;
`;

const Title = styled.h2`
  text-align: left;
  margin-bottom: 25px;
  font-weight: 700;
  color: #212529;
`;

const UserTypeSelector = styled.div`
  display: flex;
  justify-content: center;
  gap: 25px;
  margin-bottom: 25px;
  flex-wrap: wrap;
`;

const UserTypeCircle = styled.div`
  width: 90px;
  height: 90px;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: ${({ $active, $type }) =>
    $active ? userColors[$type] || '#ccc' : '#f3f3f3'};
  color: ${({ $active }) => ($active ? '#fff' : '#333')};
  font-weight: 600;
  text-align: center;
  cursor: pointer;
  box-shadow: ${({ $active, $type }) =>
    $active ? `0 0 12px ${userColors[$type]}80` : '0 2px 6px rgba(0,0,0,0.1)'};
  transition: all 0.25s ease;
  padding: 6px;

  svg {
    font-size: 1.5rem;
    margin-bottom: 6px;
  }

  span {
    font-size: 0.75rem;
    line-height: 1.1;
  }

  &:hover {
    transform: scale(1.07);
    background: ${({ $active, $type }) =>
      $active ? userColors[$type] : '#e8e8e8'};
  }
`;

const TableWrapper = styled.div`
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  font-size: 0.95rem;
  border-radius: 8px;
  overflow: hidden;
`;

const Th = styled.th`
  padding: 14px;
  background-color: #0090E7;
  color: #fff;
  text-align: left;
  font-weight: 600;
`;

const Td = styled.td`
  padding: 14px;
  border-bottom: 1px solid #eee;
  background-color: #fff;
`;

const Tr = styled.tr`
  &:nth-child(even) ${Td} {
    background-color: #f9f9f9;
  }

  &:hover ${Td} {
    background-color: #f1f5ff;
  }
`;

const Input = styled.input`
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 6px;
  width: 95%;
`;

const Select = styled.select`
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 6px;
  width: 100%;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
`;

const IconButton = styled.button`
  background-color: ${({ danger }) => (danger ? '#E74C3C' : '#0090E7')};
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    opacity: 0.9;
    transform: scale(1.05);
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

const ErrorText = styled.p`
  color: #E74C3C;
  font-weight: 600;
  margin-top: 10px;
`;

// === COMPONENTE PRINCIPAL ===
function AdminUserList() {
  const [usuarios, setUsuarios] = useState([]);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState(['todos']);
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({
    nombre: '',
    correo_electronico: '',
    tipo_usuario: '',
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    title: '',
    message: '',
    onConfirm: null,
    confirmText: 'Confirmar',
    cancelText: 'Cancelar',
    showCancel: true,
  });

  const fetchUsuarios = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No se encontró token de autenticación');
        return;
      }

      const res = await axios.get(`${API_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsuarios(res.data);
    } catch (err) {
      console.error('Error al obtener usuarios:', err);
      setError('Error al obtener la lista de usuarios');
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const toggleFilter = (type) => {
    if (type === 'todos') {
      setFilter(['todos']);
      return;
    }

    let newFilters = filter.includes('todos')
      ? [type]
      : filter.includes(type)
      ? filter.filter((f) => f !== type)
      : [...filter, type];

    if (newFilters.length >= 3) newFilters = ['todos'];
    if (newFilters.length === 0) newFilters = ['todos'];

    setFilter(newFilters);
  };

  const confirmDelete = (id) => {
    setModalConfig({
      title: 'Eliminar usuario',
      message: '¿Seguro que deseas eliminar este usuario?',
      onConfirm: () => handleDelete(id),
      confirmText: 'Eliminar',
      cancelText: 'Cancelar',
      showCancel: true,
    });
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsuarios(usuarios.filter((u) => u.id !== id));

      setModalConfig({
        title: 'Éxito',
        message: 'Usuario eliminado correctamente',
        onConfirm: () => setModalOpen(false),
        confirmText: 'OK',
        showCancel: false,
      });
      setModalOpen(true);
    } catch (err) {
      console.error('Error al eliminar usuario:', err);
      setModalConfig({
        title: 'Error',
        message: 'No se pudo eliminar el usuario',
        onConfirm: () => setModalOpen(false),
        confirmText: 'Cerrar',
        showCancel: false,
      });
      setModalOpen(true);
    }
  };

  const handleEditClick = (user) => {
    setEditingUser(user.id);
    setEditForm({
      nombre: user.nombre,
      correo_electronico: user.correo_electronico,
      tipo_usuario: user.tipo_usuario,
    });
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSave = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(`${API_URL}/users/${id}`, editForm, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsuarios(usuarios.map((u) => (u.id === id ? res.data : u)));
      setEditingUser(null);

      setModalConfig({
        title: 'Éxito',
        message: 'Usuario actualizado correctamente',
        onConfirm: () => setModalOpen(false),
        confirmText: 'OK',
        showCancel: false,
      });
      setModalOpen(true);
    } catch (err) {
      console.error('Error al actualizar usuario:', err);
      setModalConfig({
        title: 'Error',
        message: 'No se pudo actualizar el usuario',
        onConfirm: () => setModalOpen(false),
        confirmText: 'Cerrar',
        showCancel: false,
      });
      setModalOpen(true);
    }
  };

  const icons = {
    todos: <FaUsers />,
    niño: <FaChild />,
    evaluador: <FaUserTie />,
    administrador: <FaUserCog />,
  };

  const filteredUsuarios =
    filter.includes('todos') || filter.length === 0
      ? usuarios
      : usuarios.filter((u) => filter.includes(u.tipo_usuario));

  return (
    <Container>
      <Title>Lista de Usuarios Registrados</Title>

      {error && <ErrorText>{error}</ErrorText>}

      <UserTypeSelector>
        {['todos', 'niño', 'evaluador', 'administrador'].map((type) => (
          <UserTypeCircle
            key={type}
            $type={type}
            $active={filter.includes(type)}
            onClick={() => toggleFilter(type)}
          >
            {icons[type]}
            <span>
              {type === 'todos'
                ? 'Todos'
                : type.charAt(0).toUpperCase() + type.slice(1)}
            </span>
          </UserTypeCircle>
        ))}
      </UserTypeSelector>

      <TableWrapper>
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
              filteredUsuarios.map((user) => (
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
                        <ActionButtons>
                          <IconButton onClick={() => handleEditSave(user.id)}>
                            <Save />
                          </IconButton>
                          <IconButton danger onClick={() => setEditingUser(null)}>
                            <X />
                          </IconButton>
                        </ActionButtons>
                      </Td>
                    </>
                  ) : (
                    <>
                      <Td>{user.id}</Td>
                      <Td>{user.nombre}</Td>
                      <Td>{user.correo_electronico}</Td>
                      <Td>{user.tipo_usuario}</Td>
                      <Td>
                        <ActionButtons>
                          <IconButton onClick={() => handleEditClick(user)}>
                            <Edit />
                          </IconButton>
                          <IconButton danger onClick={() => confirmDelete(user.id)}>
                            <Trash2 />
                          </IconButton>
                        </ActionButtons>
                      </Td>
                    </>
                  )}
                </Tr>
              ))
            ) : (
              <Tr>
                <Td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>
                  No hay usuarios registrados
                </Td>
              </Tr>
            )}
          </tbody>
        </Table>
      </TableWrapper>

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