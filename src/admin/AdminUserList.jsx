// src/admin/AdminUserList.jsx
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import API_URL from '../api/config';
import Swal from "sweetalert2";
import { Edit, Trash2, Save, X, FileText, Eye } from 'lucide-react';
import { FaChild, FaUserTie, FaUserCog, FaUsers } from 'react-icons/fa';

// 🎨 Colores por tipo de usuario
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
  width: 95px;
  height: 95px;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: ${({ $active, $type }) =>
    $active ? userColors[$type] || '#ccc' : '#f3f3f3'};
  color: ${({ $active }) => ($active ? '#fff' : '#333')};
  cursor: pointer;
  font-weight: 600;
  text-align: center;
  transition: 0.25s ease;
  box-shadow: ${({ $active, $type }) =>
    $active ? `0 0 12px ${userColors[$type]}80` : '0 2px 6px rgba(0,0,0,0.1)'};

  svg {
    font-size: 1.7rem;
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
  color: white;
  font-weight: 600;
  text-align: left;
`;

const Td = styled.td`
  padding: 14px;
  border-bottom: 1px solid #eee;
  background: #fff;
`;

const Tr = styled.tr`
  &:nth-child(even) ${Td} {
    background: #f9f9f9;
  }
  &:hover ${Td} {
    background: #f1f5ff;
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
  color: white;
  border: none;
  border-radius: 8px;
  padding: 8px;
  cursor: pointer;
  transition: 0.2s;

  &:hover {
    transform: scale(1.05);
    opacity: 0.9;
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

/* ============================
   ESTILOS MODAL ENCUESTAS / RESULTADOS
   ============================ */

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.55);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

const ModalContainer = styled.div`
  background: #ffffff;
  border-radius: 14px;
  max-width: 950px;
  width: 95%;
  max-height: 90vh;
  padding: 22px 24px;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.25);
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
`;

const ModalTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
`;

const ModalSubtitle = styled.p`
  margin: 2px 0 0 0;
  font-size: 0.85rem;
  color: #6b7280;
`;

const CloseButton = styled.button`
  border: none;
  background: transparent;
  cursor: pointer;
  color: #6b7280;
  padding: 4px;
  border-radius: 999px;
  transition: 0.2s;

  &:hover {
    background: #f3f4f6;
    color: #111827;
    transform: scale(1.05);
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const ModalBody = styled.div`
  margin-top: 10px;
  padding-top: 8px;
  border-top: 1px solid #e5e7eb;
  overflow-y: auto;
`;

// Fila simple para un resultado (en la lista)
const EncuestaRow = styled.div`
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  padding: 10px 14px;
  margin-bottom: 8px;
  background: #f9fafb;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const RowLeft = styled.div`
  display: flex;
  flex-direction: column;
`;

const SmallText = styled.span`
  font-size: 0.8rem;
  color: #6b7280;
`;

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  font-size: 0.75rem;
  padding: 3px 8px;
  border-radius: 999px;
  background: #e0f2fe;
  color: #0369a1;
  font-weight: 600;
  margin-top: 4px;
`;

/* ====== Detalle Formulario Resultado ====== */

const DetailHeader = styled.div`
  margin-bottom: 12px;
`;

const DetailTitle = styled.h4`
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
  color: #111827;
`;

const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 12px;
  margin-top: 12px;
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const FieldLabel = styled.label`
  font-size: 0.8rem;
  color: #4b5563;
  font-weight: 600;
`;

const FieldInput = styled.input`
  padding: 7px 9px;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  font-size: 0.85rem;
`;

const FieldTextArea = styled.textarea`
  padding: 7px 9px;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  font-size: 0.85rem;
  min-height: 80px;
  resize: vertical;
`;

const DetailActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 16px;
`;

const SecondaryButton = styled.button`
  background: #f3f4f6;
  color: #374151;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  padding: 8px 14px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  &:hover {
    background: #e5e7eb;
  }
`;

const PrimaryButton = styled.button`
  background: #0090E7;
  color: #fff;
  border-radius: 8px;
  border: none;
  padding: 8px 14px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  &:hover {
    background: #0077bf;
  }
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

  // Estado para encuestas+resultados en modal
  const [showEncuestasModal, setShowEncuestasModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [encuestas, setEncuestas] = useState([]);
  const [encuestasLoading, setEncuestasLoading] = useState(false);
  const [encuestasError, setEncuestasError] = useState('');

  // Detalle de resultado
  const [selectedResultado, setSelectedResultado] = useState(null);
  const [selectedEncuestaId, setSelectedEncuestaId] = useState(null);
  const [resultadoForm, setResultadoForm] = useState(null);
  const [savingResultado, setSavingResultado] = useState(false);

  const fetchUsuarios = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsuarios(res.data);
    } catch (err) {
      setError('Error al obtener los usuarios');
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const toggleFilter = (type) => {
    if (type === 'todos') return setFilter(['todos']);

    let newFilters = filter.includes('todos')
      ? [type]
      : filter.includes(type)
      ? filter.filter((f) => f !== type)
      : [...filter, type];

    if (newFilters.length >= 3) newFilters = ['todos'];
    if (newFilters.length === 0) newFilters = ['todos'];

    setFilter(newFilters);
  };

  // === SWEETALERT ===
  const confirmDelete = (id) => {
    Swal.fire({
      title: "¿Eliminar usuario?",
      text: "No podrás revertir esta acción",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#E74C3C",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Eliminar",
    }).then((result) => {
      if (result.isConfirmed) handleDelete(id);
    });
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsuarios(usuarios.filter((u) => u.id !== id));

      Swal.fire({
        title: "Usuario eliminado",
        icon: "success",
        confirmButtonColor: "#0090E7",
      });

    } catch (err) {
      Swal.fire({
        title: "Error",
        text: "No se pudo eliminar el usuario",
        icon: "error",
        confirmButtonColor: "#0090E7",
      });
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

  const handleEditChange = (e) =>
    setEditForm({ ...editForm, [e.target.name]: e.target.value });

  const handleEditSave = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(`${API_URL}/users/${id}`, editForm, {
        headers: { Authorization: `Bearer ${token}` },
      });

      await fetchUsuarios(); // 🔥 Actualiza tabla correctamente
      setEditingUser(null);

      Swal.fire({
        title: "Usuario actualizado",
        icon: "success",
        confirmButtonColor: "#0090E7",
      });

    } catch (err) {
      Swal.fire({
        title: "Error",
        text: "No se pudo actualizar el usuario",
        icon: "error",
        confirmButtonColor: "#0090E7",
      });
    }
  };

  // 🧩 Abrir modal y cargar encuestas+resultados de un usuario niño
  const openEncuestasModal = async (user) => {
    setSelectedUser(user);
    setShowEncuestasModal(true);
    setEncuestas([]);
    setEncuestasError('');
    setEncuestasLoading(true);
    setSelectedResultado(null);
    setResultadoForm(null);
    setSelectedEncuestaId(null);

    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${API_URL}/encuestas/admin/usuario/${user.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setEncuestas(res.data || []);
    } catch (err) {
      console.error(err);
      setEncuestasError("No se pudieron cargar las encuestas de este usuario.");
    } finally {
      setEncuestasLoading(false);
    }
  };

  const closeEncuestasModal = () => {
    setShowEncuestasModal(false);
    setSelectedUser(null);
    setEncuestas([]);
    setEncuestasError('');
    setSelectedResultado(null);
    setResultadoForm(null);
    setSelectedEncuestaId(null);
  };

  const icons = {
    todos: <FaUsers />,
    niño: <FaChild />,
    evaluador: <FaUserTie />,
    administrador: <FaUserCog />,
  };

  const filteredUsuarios =
    filter.includes('todos')
      ? usuarios
      : usuarios.filter((u) => filter.includes(u.tipo_usuario));

  // ==== DETALLE RESULTADO ====

  // Ahora recibe directamente un "resultado" ya aplanado
  const openResultadoDetail = (resultado) => {
    setSelectedEncuestaId(resultado.encuesta_id);
    setSelectedResultado(resultado);
    setResultadoForm({
      ...resultado,
      last_played: resultado.last_played
        ? new Date(resultado.last_played).toISOString().slice(0, 16)
        : '',
    });
  };

  const handleResultadoChange = (e) => {
    const { name, value } = e.target;
    setResultadoForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleResultadoSave = async () => {
    if (!resultadoForm || !resultadoForm.id) return;

    try {
      setSavingResultado(true);
      const token = localStorage.getItem("token");

      const payload = {
        ...resultadoForm,
      };

      await axios.put(
        `${API_URL}/encuestas/admin/resultados/${resultadoForm.id}`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Swal.fire({
        title: "Resultado actualizado",
        icon: "success",
        confirmButtonColor: "#0090E7",
      });

      // Actualizar en memoria el resultado dentro de la encuesta correspondiente
      setEncuestas((prev) =>
        prev.map((enc) => {
          if (enc.id !== selectedEncuestaId) return enc;
          const nuevosResultados = (enc.resultados || []).map((r) =>
            r.id === resultadoForm.id ? { ...r, ...resultadoForm } : r
          );
          return { ...enc, resultados: nuevosResultados };
        })
      );

    } catch (err) {
      console.error(err);
      Swal.fire({
        title: "Error",
        text: "No se pudo actualizar el resultado.",
        icon: "error",
        confirmButtonColor: "#0090E7",
      });
    } finally {
      setSavingResultado(false);
    }
  };

  // Aplanamos resultados_encuesta para listar cada uno como fila independiente
  const resultadosPlano = encuestas.flatMap((enc) =>
    (enc.resultados || []).map((res) => ({
      ...res,
      encuesta_id: enc.id,
      encuesta_fecha: enc.fecha,
    }))
  );

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
              {type === "todos"
                ? "Todos"
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
                          name="nombre"
                          value={editForm.nombre}
                          onChange={handleEditChange}
                        />
                      </Td>
                      <Td>
                        <Input
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
                          {/* 👇 Solo niños tienen botón de encuestas */}
                          {user.tipo_usuario === 'niño' && (
                            <IconButton
                              title="Ver encuestas y resultados"
                              onClick={() => openEncuestasModal(user)}
                            >
                              <FileText />
                            </IconButton>
                          )}

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
                <Td colSpan="5" style={{ textAlign: "center" }}>
                  No hay usuarios registrados
                </Td>
              </Tr>
            )}
          </tbody>
        </Table>
      </TableWrapper>

      {/* MODAL ENCUESTAS / RESULTADOS */}
      {showEncuestasModal && (
        <ModalOverlay>
          <ModalContainer>
            <ModalHeader>
              <div>
                <ModalTitle>
                  {selectedResultado ? 'Detalle de Resultado' : 'Resultados del Niño'}
                </ModalTitle>
                <ModalSubtitle>
                  Usuario: <strong>{selectedUser?.nombre}</strong>{" "}
                  ({selectedUser?.correo_electronico})
                </ModalSubtitle>
              </div>
              <CloseButton onClick={closeEncuestasModal}>
                <X />
              </CloseButton>
            </ModalHeader>

            <ModalBody>
              {/* ====== MODO LISTA DE RESULTADOS (aplanados) ====== */}
              {!selectedResultado && (
                <>
                  {encuestasLoading && (
                    <SmallText>Cargando resultados...</SmallText>
                  )}

                  {encuestasError && (
                    <ErrorText>{encuestasError}</ErrorText>
                  )}

                  {!encuestasLoading && !encuestasError && resultadosPlano.length === 0 && (
                    <SmallText>No hay resultados asociados a este usuario.</SmallText>
                  )}

                  {!encuestasLoading && !encuestasError && resultadosPlano.length > 0 && (
                    resultadosPlano
                      
                      .map((res) => (
                        <EncuestaRow key={res.id}>
                          <RowLeft>
                            <SmallText>Resultado #{res.id}</SmallText>
                            <SmallText>
                              Fecha:{" "}
                              {res.encuesta_fecha
                                ? new Date(res.encuesta_fecha).toLocaleDateString()
                                : "Sin fecha"}
                            </SmallText>
                            <Badge>
                              Juego: {res.game_type || "-"} · Nivel:{" "}
                              {res.current_level ?? "-"}
                            </Badge>
                          </RowLeft>
                          <IconButton
                            title="Ver formulario de resultados"
                            onClick={() => openResultadoDetail(res)}
                          >
                            <Eye />
                          </IconButton>
                        </EncuestaRow>
                      ))
                  )}
                </>
              )}

              {/* ====== MODO DETALLE DE RESULTADO ====== */}
              {selectedResultado && resultadoForm && (
                <>
                  <DetailHeader>
                    <DetailTitle>
                      Resultado #{resultadoForm.id}
                    </DetailTitle>
                    <SmallText>
                      Última vez jugado:{" "}
                      {resultadoForm.last_played
                        ? new Date(resultadoForm.last_played).toLocaleString()
                        : "Sin registro"}
                    </SmallText>
                  </DetailHeader>

                  {/* Datos del juego */}
                  <DetailGrid>
                    <FieldGroup>
                      <FieldLabel>Tipo de juego</FieldLabel>
                      <FieldInput
                        name="game_type"
                        value={resultadoForm.game_type || ''}
                        onChange={handleResultadoChange}
                      />
                    </FieldGroup>
                    <FieldGroup>
                      <FieldLabel>Dificultad</FieldLabel>
                      <FieldInput
                        name="difficulty"
                        value={resultadoForm.difficulty || ''}
                        onChange={handleResultadoChange}
                      />
                    </FieldGroup>
                    <FieldGroup>
                      <FieldLabel>Nivel actual</FieldLabel>
                      <FieldInput
                        type="number"
                        name="current_level"
                        value={resultadoForm.current_level ?? ''}
                        onChange={handleResultadoChange}
                      />
                    </FieldGroup>
                    <FieldGroup>
                      <FieldLabel>Puntaje acumulado</FieldLabel>
                      <FieldInput
                        type="number"
                        name="accumulated_score"
                        value={resultadoForm.accumulated_score ?? ''}
                        onChange={handleResultadoChange}
                      />
                    </FieldGroup>
                    <FieldGroup>
                      <FieldLabel>Última vez jugado</FieldLabel>
                      <FieldInput
                        type="datetime-local"
                        name="last_played"
                        value={resultadoForm.last_played || ''}
                        onChange={handleResultadoChange}
                      />
                    </FieldGroup>
                  </DetailGrid>

                  {/* Bloque clínico */}
                  <DetailGrid>
                    <FieldGroup>
                      <FieldLabel>Resumen examen mental</FieldLabel>
                      <FieldTextArea
                        name="resumen_examen_mental"
                        value={resultadoForm.resumen_examen_mental || ''}
                        onChange={handleResultadoChange}
                      />
                    </FieldGroup>
                    <FieldGroup>
                      <FieldLabel>Antecedentes clínicos</FieldLabel>
                      <FieldTextArea
                        name="antecedentes_clinicos"
                        value={resultadoForm.antecedentes_clinicos || ''}
                        onChange={handleResultadoChange}
                      />
                    </FieldGroup>
                    <FieldGroup>
                      <FieldLabel>Diagnóstico de aprendizaje</FieldLabel>
                      <FieldTextArea
                        name="diagnostico_aprendizaje"
                        value={resultadoForm.diagnostico_aprendizaje || ''}
                        onChange={handleResultadoChange}
                      />
                    </FieldGroup>
                    <FieldGroup>
                      <FieldLabel>Problemas académicos</FieldLabel>
                      <FieldTextArea
                        name="problemas_academicos"
                        value={resultadoForm.problemas_academicos || ''}
                        onChange={handleResultadoChange}
                      />
                    </FieldGroup>
                    <FieldGroup>
                      <FieldLabel>Problemas de lectoescritura</FieldLabel>
                      <FieldTextArea
                        name="problemas_lectoescritura"
                        value={resultadoForm.problemas_lectoescritura || ''}
                        onChange={handleResultadoChange}
                      />
                    </FieldGroup>
                    <FieldGroup>
                      <FieldLabel>Evaluación pretest</FieldLabel>
                      <FieldTextArea
                        name="evaluacion_pretest"
                        value={resultadoForm.evaluacion_pretest || ''}
                        onChange={handleResultadoChange}
                      />
                    </FieldGroup>
                    <FieldGroup>
                      <FieldLabel>Evaluación postest</FieldLabel>
                      <FieldTextArea
                        name="evaluacion_postest"
                        value={resultadoForm.evaluacion_postest || ''}
                        onChange={handleResultadoChange}
                      />
                    </FieldGroup>
                    <FieldGroup>
                      <FieldLabel>Observaciones de sesión</FieldLabel>
                      <FieldTextArea
                        name="observaciones_sesion"
                        value={resultadoForm.observaciones_sesion || ''}
                        onChange={handleResultadoChange}
                      />
                    </FieldGroup>
                    <FieldGroup>
                      <FieldLabel>Observación conductual</FieldLabel>
                      <FieldTextArea
                        name="observacion_conductual"
                        value={resultadoForm.observacion_conductual || ''}
                        onChange={handleResultadoChange}
                      />
                    </FieldGroup>
                    <FieldGroup>
                      <FieldLabel>Recomendaciones</FieldLabel>
                      <FieldTextArea
                        name="recomendaciones"
                        value={resultadoForm.recomendaciones || ''}
                        onChange={handleResultadoChange}
                      />
                    </FieldGroup>
                    <FieldGroup>
                      <FieldLabel>Indicadores de logro</FieldLabel>
                      <FieldTextArea
                        name="indicadores_logro"
                        value={resultadoForm.indicadores_logro || ''}
                        onChange={handleResultadoChange}
                      />
                    </FieldGroup>
                  </DetailGrid>

                  <DetailActions>
                    <SecondaryButton
                      onClick={() => {
                        setSelectedResultado(null);
                        setResultadoForm(null);
                        setSelectedEncuestaId(null);
                      }}
                    >
                      Volver a resultados
                    </SecondaryButton>
                    <PrimaryButton onClick={handleResultadoSave} disabled={savingResultado}>
                      <Save style={{ width: 16, height: 16 }} />
                      {savingResultado ? 'Guardando...' : 'Guardar cambios'}
                    </PrimaryButton>
                  </DetailActions>
                </>
              )}
            </ModalBody>
          </ModalContainer>
        </ModalOverlay>
      )}
    </Container>
  );
}

export default AdminUserList;
