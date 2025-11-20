import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from "sweetalert2";
import API_URL from '../api/config';
import { FaChild, FaUserTie, FaUserCog } from 'react-icons/fa';

const api = axios.create({ baseURL: API_URL });

// === ESTILOS ===
const Container = styled.div`
  max-width: 500px;
  margin: 40px auto;
  padding: 35px;
  border-radius: 18px;
  background-color: #ffffff;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08);
  font-family: 'Rubik', sans-serif;
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 1.8rem;
  font-weight: 700;
  color: #212529;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const FieldGroup = styled.div`
  margin-bottom: 1.2rem;
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-weight: 600;
  color: #212529;
  font-size: 0.9rem;
  margin-bottom: 6px;
  text-align: left;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d0d7de;
  border-radius: 12px;
  font-size: 0.95rem;
  transition: all 0.2s ease;
  color: #212529;

  &:focus {
    outline: none;
    border-color: #0090E7;
    box-shadow: 0 0 0 3px rgba(0, 144, 231, 0.15);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d0d7de;
  border-radius: 12px;
  font-size: 0.95rem;
  transition: all 0.2s ease;
  color: #212529;

  &:focus {
    outline: none;
    border-color: #0090E7;
    box-shadow: 0 0 0 3px rgba(0, 144, 231, 0.15);
  }
`;

const Button = styled.button`
  margin-top: 10px;
  width: 100%;
  background: #0090E7;
  color: white;
  border: none;
  border-radius: 12px;
  padding: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #007acc;
  }
`;

const ErrorText = styled.small`
  color: #E74C3C;
  font-size: 0.8rem;
  margin-top: 4px;
`;

const UserTypeSelector = styled.div`
  display: flex;
  justify-content: center;
  gap: 40px;
  margin: 25px 0 35px 0;
  flex-wrap: wrap;
`;

const userColors = {
  niño: '#FFA62B',
  evaluador: '#28C76F',
  administrador: '#0090E7',
};

const UserTypeCircle = styled.div`
  width: 105px;
  height: 105px;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: ${({ $active, $type }) => ($active ? userColors[$type] : '#f3f3f3')};
  color: ${({ $active }) => ($active ? '#fff' : '#333')};
  font-weight: 500;
  text-align: center;
  cursor: pointer;
  box-shadow: ${({ $active, $type }) =>
    $active ? `0 0 12px ${userColors[$type]}80` : '0 2px 6px rgba(0,0,0,0.1)'};
  transition: all 0.25s ease;
  padding: 8px;

  svg {
    font-size: 1.9rem;
    margin-bottom: 6px;
  }

  span {
    font-size: 0.75rem;
    line-height: 1.2;
    max-width: 80px;
  }

  &:hover {
    transform: scale(1.07);
    background: ${({ $active, $type }) =>
      $active ? userColors[$type] : '#e8e8e8'};
  }
`;

// === COMPONENTE ===
export default function AdminUserCreate() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
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

  const [errors, setErrors] = useState({});
  const [passwordValidation, setPasswordValidation] = useState({
    hasUpperCase: false,
    hasNumber: false,
  });

  // Validación dinámica de contraseña
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

  const validateForm = () => {
    const newErrors = {};

    if (!form.nombre.trim()) newErrors.nombre = 'El nombre es obligatorio';
    if (!form.correo_electronico.trim()) newErrors.correo_electronico = 'El correo electrónico es obligatorio';
    if (!form.contrasena.trim()) newErrors.contrasena = 'La contraseña es obligatoria';
    if (form.contrasena && !passwordValidation.hasUpperCase)
      newErrors.contrasena = 'Debe contener al menos una letra mayúscula';
    if (form.contrasena && !passwordValidation.hasNumber)
      newErrors.contrasena = 'Debe contener al menos un número';

    if (form.tipo_usuario === 'evaluador') {
      if (!form.codigo.trim()) newErrors.codigo = 'El código es obligatorio';
      if (!form.tipo.trim()) newErrors.tipo = 'El tipo es obligatorio';
      if (!form.tipo_documento.trim()) newErrors.tipo_documento = 'El tipo de documento es obligatorio';
    }

    if (form.tipo_usuario === 'niño') {
      if (!form.edad) newErrors.edad = 'La edad es obligatoria';
      if (!form.grado) newErrors.grado = 'El grado es obligatorio';
      if (!form.colegio.trim()) newErrors.colegio = 'El colegio es obligatorio';
      if (!form.jornada) newErrors.jornada = 'La jornada es obligatoria';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      Swal.fire({
        title: "Error de validación",
        text: "Revisa los campos obligatorios",
        icon: "error",
        confirmButtonColor: "#0090E7",
      });
      return;
    }

    try {
      Swal.fire({
        title: "Creando usuario...",
        text: "Por favor espera",
        icon: "info",
        showConfirmButton: false,
        allowOutsideClick: false,
        allowEscapeKey: false,
      });

      const response = await api.post('/register', form);

      Swal.close();

      Swal.fire({
        title: "Usuario creado correctamente",
        icon: "success",
        confirmButtonColor: "#0090E7",
      });

      // Limpiar formulario
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

    } catch (err) {
      Swal.close();

      Swal.fire({
        title: "Error",
        text: err.response?.data?.error || "No se pudo crear el usuario",
        icon: "error",
        confirmButtonColor: "#0090E7",
      });
    }
  };

  const icons = {
    niño: <FaChild />,
    evaluador: <FaUserTie />,
    administrador: <FaUserCog />,
  };

  return (
    <Container>
      <Title>Crear Nuevo Usuario</Title>

      {/* Selector visual de tipo */}
      <UserTypeSelector>
        {['niño', 'evaluador', 'administrador'].map((type) => (
          <UserTypeCircle
            key={type}
            $type={type}
            $active={form.tipo_usuario === type}
            onClick={() => setForm((prev) => ({ ...prev, tipo_usuario: type }))}
          >
            {icons[type]}
            <span>{type.charAt(0).toUpperCase() + type.slice(1)}</span>
          </UserTypeCircle>
        ))}
      </UserTypeSelector>

      {/* FORMULARIO */}
      <Form onSubmit={handleSubmit}>
        
        <FieldGroup>
          <Label>Nombre</Label>
          <Input name="nombre" value={form.nombre} onChange={handleChange} />
          {errors.nombre && <ErrorText>{errors.nombre}</ErrorText>}
        </FieldGroup>

        <FieldGroup>
          <Label>Correo Electrónico</Label>
          <Input
            type="email"
            name="correo_electronico"
            value={form.correo_electronico}
            onChange={handleChange}
          />
          {errors.correo_electronico && <ErrorText>{errors.correo_electronico}</ErrorText>}
        </FieldGroup>

        <FieldGroup>
          <Label>Contraseña</Label>
          <Input
            type="password"
            name="contrasena"
            value={form.contrasena}
            onChange={handleChange}
          />
          {errors.contrasena && <ErrorText>{errors.contrasena}</ErrorText>}
        </FieldGroup>

        {/* Campos del niño */}
        {form.tipo_usuario === 'niño' && (
          <>
            <FieldGroup>
              <Label>Edad</Label>
              <Select name="edad" value={form.edad} onChange={handleChange}>
                <option value="">Seleccione edad</option>
                <option value="5">5 años</option>
                <option value="6">6 años</option>
                <option value="7">7 años</option>
              </Select>
              {errors.edad && <ErrorText>{errors.edad}</ErrorText>}
            </FieldGroup>

            <FieldGroup>
              <Label>Grado</Label>
              <Select name="grado" value={form.grado} onChange={handleChange}>
                <option value="">Seleccione grado</option>
                <option value="0">Grado 0</option>
                <option value="1">Grado 1</option>
                <option value="2">Grado 2</option>
                <option value="3">Grado 3</option>
              </Select>
              {errors.grado && <ErrorText>{errors.grado}</ErrorText>}
            </FieldGroup>

            <FieldGroup>
              <Label>Colegio</Label>
              <Input name="colegio" value={form.colegio} onChange={handleChange} />
              {errors.colegio && <ErrorText>{errors.colegio}</ErrorText>}
            </FieldGroup>

            <FieldGroup>
              <Label>Jornada</Label>
              <Select name="jornada" value={form.jornada} onChange={handleChange}>
                <option value="">Seleccione jornada</option>
                <option value="mañana">Mañana</option>
                <option value="tarde">Tarde</option>
                <option value="Continua">Continua</option>
              </Select>
              {errors.jornada && <ErrorText>{errors.jornada}</ErrorText>}
            </FieldGroup>
          </>
        )}

        {/* Campos del evaluador */}
        {form.tipo_usuario === 'evaluador' && (
          <>
            <FieldGroup>
              <Label>Código</Label>
              <Input name="codigo" value={form.codigo} onChange={handleChange} />
              {errors.codigo && <ErrorText>{errors.codigo}</ErrorText>}
            </FieldGroup>

            <FieldGroup>
              <Label>Tipo de Evaluador</Label>
              <Select name="tipo" value={form.tipo} onChange={handleChange}>
                <option value="">Seleccione tipo</option>
                <option value="Docente">Docente</option>
                <option value="Estudiante">Estudiante</option>
                <option value="Egresado">Egresado</option>
              </Select>
              {errors.tipo && <ErrorText>{errors.tipo}</ErrorText>}
            </FieldGroup>

            <FieldGroup>
              <Label>Tipo de Documento</Label>
              <Select
                name="tipo_documento"
                value={form.tipo_documento}
                onChange={handleChange}
              >
                <option value="">Seleccione documento</option>
                <option value="TI">Tarjeta de Identidad</option>
                <option value="CC">Cédula de Ciudadanía</option>
              </Select>
              {errors.tipo_documento && <ErrorText>{errors.tipo_documento}</ErrorText>}
            </FieldGroup>
          </>
        )}

        <Button type="submit">Crear Usuario</Button>

      </Form>
    </Container>
  );
}
