import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { GlobalStyle, Button, H1 } from '../styles/styles';
import Navbar from "../components/Navbar";
import { FaCheck, FaTimes } from 'react-icons/fa';
import Modal from "../components/Modal";

// Importamos componentes
import FormField from '../components/FormField';
import SelectField from '../components/SelectField';
import PasswordField from '../components/PasswordField';
import UserDataModal from '../components/UserDataModal';
import { TwoColumnLayout } from '../components/FormLayout';
import PageLayout from '../components/PageLayout'; // Importamos PageLayout para eliminar scroll innecesario

// Importamos constantes
import { ERROR_CODES, OPTIONS } from '../components/constants';

// Componente principal
const AsignarEvaluador = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    
    // Estado principal del formulario
    const [nino, setNino] = useState({
        nombre: "",
        correo_electronico: "",
        tipo_usuario: "niño",
        contrasena: "",
        confirmarContrasena: "",
        edad: "",
        grado: "",
        colegio: "",
        jornada: "",
    });
    
    // Estado para la validación de contraseña
    const [passwordValidation, setPasswordValidation] = useState({
        hasUpperCase: false,
        hasNumber: false,
        hasMinLength: false,
        passwordsMatch: false
    });
    
    // Estados para la validación del formulario
    const [errors, setErrors] = useState({});
    const [missingFields, setMissingFields] = useState([]);
    
    // Estados para modales
    const [modalOpen, setModalOpen] = useState(false);
    const [modalSuccess, setModalSuccess] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [modalError, setModalError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [emailExistsModal, setEmailExistsModal] = useState(false);
    const [incompleteDataModal, setIncompleteDataModal] = useState(false);
    const [serverErrorModal, setServerErrorModal] = useState(false);
    const [notEvaluatorModal, setNotEvaluatorModal] = useState(false);
    const [invalidTokenModal, setInvalidTokenModal] = useState(false);
    const [passwordModalOpen, setPasswordModalOpen] = useState(false);
    const [emailValidationModal, setEmailValidationModal] = useState(false);
    
    // Comprobar validación de contraseña cuando cambia
    useEffect(() => {
        const { contrasena, confirmarContrasena } = nino;
        
        setPasswordValidation({
            hasUpperCase: /[A-Z]/.test(contrasena),
            hasNumber: /[0-9]/.test(contrasena),
            hasMinLength: contrasena.length >= 6,
            passwordsMatch: contrasena === confirmarContrasena && contrasena !== ''
        });
    }, [nino.contrasena, nino.confirmarContrasena]);

    // Validar correo electrónico
    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };
    
    // Validar contraseñas y mostrar modal si hay errores
    const validatePasswords = () => {
        const { contrasena, confirmarContrasena } = nino;
        
        // Verificar requisitos de contraseña
        if (!contrasena || !passwordValidation.hasUpperCase || !passwordValidation.hasNumber || !passwordValidation.hasMinLength) {
            setPasswordModalOpen(true);
            return false;
        }
        
        // Verificar coincidencia de contraseñas
        if (!confirmarContrasena || contrasena !== confirmarContrasena) {
            setPasswordModalOpen(true);
            return false;
        }
        
        return true;
    };

    // Validar formulario completo
    const validateForm = () => {
        const newErrors = {};
        const missingFieldsList = [];
        
        // Validar campos obligatorios
        if (!nino.nombre.trim()) {
            newErrors.nombre = "El nombre es obligatorio";
            missingFieldsList.push("Nombre");
        }
        
        if (!nino.correo_electronico.trim()) {
            newErrors.correo_electronico = "El correo electrónico es obligatorio";
            missingFieldsList.push("Correo electrónico");
        } else if (!validateEmail(nino.correo_electronico)) {
            newErrors.correo_electronico = "El formato del correo electrónico no es válido";
            setEmailValidationModal(true);
            return false;
        }
        
        if (!nino.colegio.trim()) {
            newErrors.colegio = "El nombre del colegio es obligatorio";
            missingFieldsList.push("Colegio");
        }
        
        if (!nino.edad) {
            newErrors.edad = "Debe seleccionar una edad";
            missingFieldsList.push("Edad");
        }
        
        if (!nino.grado) {
            newErrors.grado = "Debe seleccionar un grado";
            missingFieldsList.push("Grado");
        }
        
        if (!nino.jornada) {
            newErrors.jornada = "Debe seleccionar una jornada";
            missingFieldsList.push("Jornada");
        }
        
        setErrors(newErrors);
        
        // Si hay errores en los campos básicos, mostrar modal de datos incompletos
        if (Object.keys(newErrors).length > 0) {
            setMissingFields(missingFieldsList);
            setIncompleteDataModal(true);
            return false;
        }
        
        // Validar contraseñas
        return validatePasswords();
    };

    // Manejar los cambios en los campos del formulario
    const handleChange = (e) => {
        setNino({ ...nino, [e.target.name]: e.target.value });
        
        // Borrar errores cuando el usuario empiece a escribir de nuevo
        if (errors[e.target.name]) {
            setErrors(prev => ({ ...prev, [e.target.name]: null }));
        }
    };

    // Mostrar el modal de confirmación
    const showConfirmationModal = (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        setModalOpen(true);
    };
    
    // Función para enviar los datos al servidor
    const submitForm = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            setModalOpen(false);
            setInvalidTokenModal(true);
            setTimeout(() => {
                navigate("/login");
            }, 3000);
            return;
        }

        if (!user?.id) {
            setModalOpen(false);
            setInvalidTokenModal(true);
            setTimeout(() => {
                navigate("/login");
            }, 3000);
            return;
        }

        const datosEnviados = {
            nombre: nino.nombre,
            correo_electronico: nino.correo_electronico,
            contrasena: nino.contrasena,
            edad: parseInt(nino.edad),
            grado: parseInt(nino.grado),
            colegio: nino.colegio,
            jornada: nino.jornada,
        };


        try {
            const res = await axios.post(
                `${import.meta.env.VITE_API_URL}/evaluador/asignar-nino`,
                datosEnviados,
                { headers: { Authorization: token } }
            );

            setModalOpen(false);
            setModalSuccess(true);
            setModalMessage(res.data.message || "✅ Acompañante asignado correctamente");
            
            // Reiniciamos el formulario
            setNino({
                nombre: "",
                correo_electronico: "",
                tipo_usuario: "niño",
                contrasena: "",
                confirmarContrasena: "",
                edad: "",
                grado: "",
                colegio: "",
                jornada: "",
            });
            setErrors({});
        } catch (error) {
            setModalOpen(false);
            
            // Manejar errores específicos según códigos del backend
            if (error.response?.data?.code) {
                switch (error.response.data.code) {
                    case ERROR_CODES.EMAIL_EXISTS:
                        setEmailExistsModal(true);
                        break;
                    case ERROR_CODES.MISSING_DATA:
                        setMissingFields(error.response.data.fields || ["Datos del formulario"]);
                        setIncompleteDataModal(true);
                        break;
                    case ERROR_CODES.NOT_EVALUATOR:
                        setNotEvaluatorModal(true);
                        setTimeout(() => {
                            navigate("/");
                        }, 3000);
                        break;
                    case ERROR_CODES.INVALID_TOKEN:
                    case ERROR_CODES.ACCESS_DENIED:
                        setInvalidTokenModal(true);
                        setTimeout(() => {
                            logout();
                            navigate("/login");
                        }, 3000);
                        break;
                    case ERROR_CODES.INVALID_EMAIL:
                        setEmailValidationModal(true);
                        break;
                    case ERROR_CODES.INVALID_PASSWORD:
                        setPasswordModalOpen(true);
                        break;
                    case ERROR_CODES.SERVER_ERROR:
                    default:
                        setServerErrorModal(true);
                        break;
                }
            } else {
                // Error genérico
                setErrorMessage(error.response?.data?.error || "Error al asignar acompañante");
                setModalError(true);
            }
        }
    };

    // Cerrar modal de éxito
    const closeSuccessModal = () => {
        setModalSuccess(false);
    };

    const renderForm = () => (
        <form onSubmit={showConfirmationModal}>
            <TwoColumnLayout>
                {/* Columna izquierda */}
                <div>
                    <FormField
                        label="Nombre completo"
                        name="nombre"
                        type="text"
                        value={nino.nombre}
                        onChange={handleChange}
                        error={errors.nombre}
                        placeholder="Ingrese el nombre completo"
                    />

                    <SelectField
                        label="Edad"
                        name="edad"
                        options={OPTIONS.edad}
                        value={nino.edad}
                        onChange={handleChange}
                        error={errors.edad}
                    />

                    <SelectField
                        label="Grado"
                        name="grado"
                        options={OPTIONS.grado}
                        value={nino.grado}
                        onChange={handleChange}
                        error={errors.grado}
                    />

                    <SelectField
                        label="Jornada"
                        name="jornada"
                        options={OPTIONS.jornada}
                        value={nino.jornada}
                        onChange={handleChange}
                        error={errors.jornada}
                    />
                </div>

                {/* Columna derecha */}
                <div>
                    <FormField
                        label="Colegio"
                        name="colegio"
                        type="text"
                        value={nino.colegio}
                        onChange={handleChange}
                        error={errors.colegio}
                        placeholder="Ingrese el nombre del Colegio"
                    />

                    <FormField
                        label="Correo electrónico"
                        name="correo_electronico"
                        type="email"
                        value={nino.correo_electronico}
                        onChange={handleChange}
                        error={errors.correo_electronico}
                        placeholder="Ingrese el correo electrónico"
                    />

                    <PasswordField
                        label="Contraseña"
                        name="contrasena"
                        value={nino.contrasena}
                        onChange={handleChange}
                        error={errors.contrasena}
                        placeholder="Contraseña"
                        showValidation={true}
                        validation={passwordValidation}
                        isConfirmField={false}
                    />

                    <PasswordField
                        label="Confirmar contraseña"
                        name="confirmarContrasena"
                        value={nino.confirmarContrasena}
                        onChange={handleChange}
                        error={errors.confirmarContrasena}
                        placeholder="Confirmar contraseña"
                        showValidation={true}
                        validation={passwordValidation}
                        isConfirmField={true}
                    />
                </div>
            </TwoColumnLayout>

            <Button type="submit">Asignar Acompañante</Button>
        </form>
    );

    return (
        <>
            <GlobalStyle />
            <Navbar />

            {/* Reemplazamos Container y FormContainer con PageLayout */}
            <PageLayout 
                title={<H1>Asignar Acompañante</H1>}
                maxWidth="800px"
                hasOverflow={false} // Eliminamos scroll innecesario
            >
                {renderForm()}
            </PageLayout>
            
            {/* Modales */}
            <UserDataModal 
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onConfirm={submitForm}
                userData={nino}
            />
            
            {/* Modal de éxito */}
            <Modal 
                isOpen={modalSuccess} 
                onClose={closeSuccessModal}
                onConfirm={closeSuccessModal}
                title="Operación Exitosa"
                confirmText="Aceptar"
                showCancel={false}
            >
                <p style={{ textAlign: 'center', fontSize: '1.1rem' }}>{modalMessage}</p>
            </Modal>
            
            {/* Modal de error general */}
            <Modal 
                isOpen={modalError} 
                onClose={() => setModalError(false)}
                onConfirm={() => setModalError(false)}
                title="Error"
                confirmText="Entendido"
                showCancel={false}
            >
                <p style={{ textAlign: 'center', fontSize: '1.1rem' }}>{errorMessage}</p>
            </Modal>

            {/* Modal de correo duplicado */}
            <Modal 
                isOpen={emailExistsModal} 
                onClose={() => setEmailExistsModal(false)}
                onConfirm={() => setEmailExistsModal(false)}
                title="Correo ya registrado"
                confirmText="Entendido"
                showCancel={false}
            >
                <p style={{ textAlign: 'center', fontSize: '1.1rem' }}>
                    El correo electrónico ya está registrado en el sistema. Por favor, utiliza un correo diferente.
                </p>
            </Modal>

            {/* Modal para validación de correo electrónico */}
            <Modal 
                isOpen={emailValidationModal} 
                onClose={() => setEmailValidationModal(false)}
                onConfirm={() => setEmailValidationModal(false)}
                title="Correo electrónico inválido"
                confirmText="Entendido"
                showCancel={false}
            >
                <p style={{ textAlign: 'center', fontSize: '1.1rem' }}>
                    El formato del correo electrónico no es válido. Por favor, introduce una dirección de correo válida.
                </p>
            </Modal>

            {/* Modal de datos incompletos */}
            <Modal 
                isOpen={incompleteDataModal} 
                onClose={() => setIncompleteDataModal(false)}
                onConfirm={() => setIncompleteDataModal(false)}
                title="Datos incompletos"
                confirmText="Entendido"
                showCancel={false}
            >
                <p style={{ textAlign: 'center', fontSize: '1.1rem' }}>
                    Por favor, completa todos los campos obligatorios antes de continuar.
                </p>
                {missingFields.length > 0 && (
                    <div style={{ textAlign: 'left', marginTop: '1rem' }}>
                        <ul>
                            {missingFields.map((field, index) => (
                                <li key={index} style={{ marginBottom: '0.5rem' }}>
                                    {field}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </Modal>

            {/* Modal de error de servidor */}
            <Modal 
                isOpen={serverErrorModal} 
                onClose={() => setServerErrorModal(false)}
                onConfirm={() => setServerErrorModal(false)}
                title="Error de conexión"
                confirmText="Entendido"
                showCancel={false}
            >
                <p style={{ textAlign: 'center', fontSize: '1.1rem' }}>
                    Ha ocurrido un error al comunicarse con el servidor. Por favor, intenta nuevamente más tarde.
                </p>
            </Modal>

            {/* Modal para cuando el usuario no es evaluador */}
            <Modal 
                isOpen={notEvaluatorModal} 
                onClose={() => setNotEvaluatorModal(false)}
                onConfirm={() => setNotEvaluatorModal(false)}
                title="Permiso denegado"
                confirmText="Entendido"
                showCancel={false}
            >
                <p style={{ textAlign: 'center', fontSize: '1.1rem' }}>
                    No tienes permisos de evaluador para realizar esta acción. Serás redirigido a la página principal.
                </p>
            </Modal>

            {/* Modal para token inválido */}
            <Modal 
                isOpen={invalidTokenModal} 
                onClose={() => setInvalidTokenModal(false)}
                onConfirm={() => setInvalidTokenModal(false)}
                title="Sesión expirada"
                confirmText="Entendido"
                showCancel={false}
            >
                <p style={{ textAlign: 'center', fontSize: '1.1rem' }}>
                    Tu sesión ha expirado o no es válida. Por favor, inicia sesión nuevamente.
                </p>
            </Modal>
            
            {/* Modal de validación de contraseña */}
            <Modal 
                isOpen={passwordModalOpen} 
                onClose={() => setPasswordModalOpen(false)}
                onConfirm={() => setPasswordModalOpen(false)}
                title="Requisitos de contraseña"
                confirmText="Entendido"
                showCancel={false}
            >
                <p>La contraseña debe cumplir con los siguientes requisitos:</p>
                <div style={{ margin: '1rem 0', textAlign: 'left' }}>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        <li style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                            <span style={{ 
                                marginRight: '8px', 
                                color: passwordValidation.hasUpperCase ? '#4CAF50' : '#ff6b6b'
                            }}>
                                {passwordValidation.hasUpperCase ? <FaCheck /> : <FaTimes />}
                            </span>
                            Contener al menos una letra mayúscula
                        </li>
                        <li style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                            <span style={{ 
                                marginRight: '8px', 
                                color: passwordValidation.hasNumber ? '#4CAF50' : '#ff6b6b'
                            }}>
                                {passwordValidation.hasNumber ? <FaCheck /> : <FaTimes />}
                            </span>
                            Contener al menos un número
                        </li>
                        <li style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                            <span style={{ 
                                marginRight: '8px', 
                                color: passwordValidation.hasMinLength ? '#4CAF50' : '#ff6b6b'
                            }}>
                                {passwordValidation.hasMinLength ? <FaCheck /> : <FaTimes />}
                            </span>
                            Tener al menos 6 caracteres
                        </li>
                        <li style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                            <span style={{ 
                                marginRight: '8px', 
                                color: passwordValidation.passwordsMatch ? '#4CAF50' : '#ff6b6b'
                            }}>
                                {passwordValidation.passwordsMatch ? <FaCheck /> : <FaTimes />}
                            </span>
                            Las contraseñas deben coincidir
                        </li>
                    </ul>
                </div>
                <p>Por favor, asegúrate de que la contraseña cumpla con todos los requisitos.</p>
            </Modal>
        </>
    );
};

export default AsignarEvaluador;