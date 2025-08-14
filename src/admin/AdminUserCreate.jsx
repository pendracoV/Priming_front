// AdminUserCreate.jsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import Modal from '../components/Modal';
import axios from 'axios';
import API_URL from '../api/config';

const api = axios.create({ baseURL: API_URL });

const Container = styled.div`
  max-width: 400px;
  margin: 40px auto;
  padding: 20px;
  border-radius: 8px;
  background-color: #f8f9fa;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;
const Title = styled.h2` text-align: center; margin-bottom: 1.5rem; `;
const Form = styled.form` display: flex; flex-direction: column; `;
const Label = styled.label` font-weight: bold; margin-bottom: 5px; `;
const Input = styled.input`
  padding: 8px; margin-bottom: 15px;
  border: 1px solid #ccc; border-radius: 4px;
`;
const Select = styled.select`
  padding: 8px; margin-bottom: 15px;
  border: 1px solid #ccc; border-radius: 4px;
`;
const Button = styled.button`
  padding: 10px; background: #007bff; color: white;
  border: none; border-radius: 4px; cursor: pointer;
  &:hover { background: #0056b3; }
`;

export default function AdminUserCreate() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nombre: '',
    correo_electronico: '',
    contrasena: '',
    tipo_usuario: 'niño',
    // Evaluador
    codigo: '',
    tipo: '',
    tipo_documento: '',
    // Niño
    edad: '',
    grado: '',
    colegio: '',
    jornada: '',
  });

  const [modal, setModal] = useState({ isOpen: false });
  const [errors, setErrors] = useState({});
  const [passwordValidation, setPasswordValidation] = useState({ hasUpperCase: false, hasNumber: false });

  useEffect(() => {
    const { contrasena } = form;
    setPasswordValidation({
      hasUpperCase: /[A-Z]/.test(contrasena),
      hasNumber: /[0-9]/.test(contrasena),
    });
  }, [form.contrasena]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const showModal = (title, message, type, onConfirm = null, confirmText = 'Aceptar', showCancel = false) => {
    setModal({ isOpen: true, title, message, type, onConfirm: onConfirm || closeModal, confirmText, showCancel });
  };
  const closeModal = () => setModal((prev) => ({ ...prev, isOpen: false }));

  const validateForm = () => {
    const newErrors = {};
    if (!form.nombre.trim()) newErrors.nombre = 'El nombre es obligatorio';
    if (!form.correo_electronico.trim()) newErrors.correo_electronico = 'El correo electrónico es obligatorio';
    if (!form.contrasena.trim()) newErrors.contrasena = 'La contraseña es obligatoria';

    if (form.contrasena && !passwordValidation.hasUpperCase)
      newErrors.contrasena = 'La contraseña debe contener al menos una letra mayúscula';
    if (form.contrasena && !passwordValidation.hasNumber)
      newErrors.contrasena = 'La contraseña debe contener al menos un número';

    if (form.tipo_usuario === 'evaluador') {
      if (!form.codigo.trim()) newErrors.codigo = 'El código es obligatorio';
      if (!form.tipo.trim()) newErrors.tipo = 'El tipo es obligatorio';
      if (!form.tipo_documento.trim()) newErrors.tipo_documento = 'El tipo de documento es obligatorio';
    }

    if (form.tipo_usuario === 'niño') {
      if (!form.edad.trim()) newErrors.edad = 'La edad es obligatoria';
      if (!form.grado.trim()) newErrors.grado = 'El grado es obligatorio';
      if (!form.colegio.trim()) newErrors.colegio = 'El colegio es obligatorio';
      if (!form.jornada.trim()) newErrors.jornada = 'La jornada es obligatoria';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      showModal('Error de validación', 'Por favor, corrige los errores del formulario.', 'error');
      return;
    }

    try {
      showModal('Procesando', 'Creando usuario...', 'info');

      const payload = { ...form }; // Enviamos todos los campos, backend usará solo los que necesite
      const response = await api.post('/register', payload);

      closeModal();
      showModal('Usuario creado', `✅ Usuario creado con éxito (ID: ${response.data.id})`, 'success', () => {
        closeModal();
        setForm({
          nombre: '',
          correo_electronico: '',
          contrasena: '',
          tipo_usuario: 'niño',
          codigo: '',
          tipo: '',
          tipo_documento: '',
          edad: '',
          grado: '',
          colegio: '',
          jornada: '',
        });
      });
    } catch (err) {
      closeModal();
      const errorMsg = err.response?.data?.error || 'Error al crear usuario';
      showModal('Error', errorMsg, 'error');
    }
  };

  return (
    <>
      <Container>
        <Title>Crear Nuevo Usuario</Title>
        <Form onSubmit={handleSubmit}>
          <Label>Nombre</Label>
          <Input name="nombre" value={form.nombre} onChange={handleChange} />
          {errors.nombre && <small style={{ color: 'red' }}>{errors.nombre}</small>}

          <Label>Correo Electrónico</Label>
          <Input type="email" name="correo_electronico" value={form.correo_electronico} onChange={handleChange} />
          {errors.correo_electronico && <small style={{ color: 'red' }}>{errors.correo_electronico}</small>}

          <Label>Contraseña</Label>
          <Input type="password" name="contrasena" value={form.contrasena} onChange={handleChange} />
          {errors.contrasena && <small style={{ color: 'red' }}>{errors.contrasena}</small>}

          <Label>Tipo de Usuario</Label>
          <Select name="tipo_usuario" value={form.tipo_usuario} onChange={handleChange}>
            <option value="niño">Niño</option>
            <option value="evaluador">Evaluador</option>
            <option value="administrador">Administrador</option>
          </Select>

          {form.tipo_usuario === 'niño' && (
            <>
              <Label>Edad</Label>
              <Select name="edad" value={form.edad} onChange={handleChange}>
                <option value="">Seleccione edad</option>
                <option value="5">5 años</option>
                <option value="6">6 años</option>
                <option value="7">7 años</option>
              </Select>
              {errors.edad && <small style={{ color: 'red' }}>{errors.edad}</small>}

              <Label>Grado</Label>
              <Select name="grado" value={form.grado} onChange={handleChange}>
                <option value="">Seleccione grado</option>
                <option value="0">Grado 0</option>
                <option value="1">Grado 1</option>
                <option value="2">Grado 2</option>
                <option value="3">Grado 3</option>
              </Select>
              {errors.grado && <small style={{ color: 'red' }}>{errors.grado}</small>}

              <Label>Colegio</Label>
              <Input name="colegio" value={form.colegio} onChange={handleChange} />
              {errors.colegio && <small style={{ color: 'red' }}>{errors.colegio}</small>}

              <Label>Jornada</Label>
              <Select name="jornada" value={form.jornada} onChange={handleChange}>
                <option value="">Seleccione jornada</option>
                <option value="mañana">Mañana</option>
                <option value="tarde">Tarde</option>
                <option value="continua">Continua</option>
              </Select>
              {errors.jornada && <small style={{ color: 'red' }}>{errors.jornada}</small>}
            </>
          )}

          {form.tipo_usuario === 'evaluador' && (
            <>
              <Label>Código</Label>
              <Input name="codigo" value={form.codigo} onChange={handleChange} />
              {errors.codigo && <small style={{ color: 'red' }}>{errors.codigo}</small>}

              <Label>Tipo de Evaluador</Label>
              <Select name="tipo" value={form.tipo} onChange={handleChange}>
                <option value="">Seleccione tipo</option>
                <option value="Docente">Docente</option>
                <option value="Estudiante">Estudiante</option>
                <option value="Egresado">Egresado</option>
              </Select>
              {errors.tipo && <small style={{ color: 'red' }}>{errors.tipo}</small>}

              <Label>Tipo de Documento</Label>
              <Select name="tipo_documento" value={form.tipo_documento} onChange={handleChange}>
                <option value="">Seleccione documento</option>
                <option value="TI">Tarjeta de Identidad</option>
                <option value="CC">Cédula de Ciudadanía</option>
              </Select>
              {errors.tipo_documento && <small style={{ color: 'red' }}>{errors.tipo_documento}</small>}
            </>
          )}

          <Button type="submit">Crear Usuario</Button>
        </Form>
      </Container>

      <Modal
        isOpen={modal.isOpen}
        onClose={closeModal}
        title={modal.title}
        onConfirm={modal.onConfirm}
        confirmText={modal.confirmText}
        showCancel={modal.showCancel}
      >
        {modal.message}
      </Modal>
    </>
  );
}
