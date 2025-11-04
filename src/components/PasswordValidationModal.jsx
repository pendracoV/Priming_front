// src/components/PasswordValidationModal.jsx
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(3px);
`;

const ModalContainer = styled.div`
  background: rgba(0, 0, 0, 0.8);
  border-radius: 10px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
  max-width: 500px;
  width: 90%;
  color: #f4f4f4;
  text-align: center;
  position: relative;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: transparent;
  border: none;
  color: #f4f4f4;
  font-size: 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const ModalHeader = styled.div`
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 1rem;
  margin-bottom: 1.5rem;
`;

const Title = styled.h2`
  margin: 0;
  color: #f4f4f4;
  font-size: 1.5rem;
  font-family: 'Manrope', sans-serif;
`;

const ModalBody = styled.div`
  margin-bottom: 1.5rem;
`;

const Subtitle = styled.p`
  color: rgba(244, 244, 244, 0.8);
  margin-bottom: 1.5rem;
  font-size: 1rem;
  line-height: 1.5;
  
  strong {
    color: #fc7500;
  }
`;

const InputContainer = styled.div`
  margin-bottom: 1rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 5px;
  font-size: 1rem;
  background-color: rgba(255, 255, 255, 0.05);
  color: #f4f4f4;
  font-family: 'Manrope', sans-serif;
  box-sizing: border-box;
  transition: all 0.3s;
  
  &::placeholder {
    color: rgba(244, 244, 244, 0.4);
  }
  
  &:focus {
    outline: none;
    border-color: #fc7500;
    background-color: rgba(255, 255, 255, 0.08);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #ff6b6b;
  background-color: rgba(255, 107, 107, 0.15);
  padding: 0.75rem 1rem;
  border-radius: 8px;
  margin-top: 1rem;
  font-size: 0.95rem;
  border: 1px solid rgba(255, 107, 107, 0.4);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  animation: shake 0.4s ease-in-out;
  
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    75% { transform: translateX(5px); }
  }
  
  &::before {
    content: '⚠️';
    font-size: 1.2rem;
  }
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1.5rem;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  font-family: 'Manrope', sans-serif;
  min-width: 120px;
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const PrimaryButton = styled(Button)`
  background-color: #fc7500;
  color: white;
  
  &:hover:not(:disabled) {
    background-color: #e56700;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(252, 117, 0, 0.3);
  }
`;

const SecondaryButton = styled(Button)`
  background-color: #444;
  color: #f4f4f4;
  
  &:hover:not(:disabled) {
    background-color: #333;
    transform: translateY(-1px);
  }
`;

const LoadingSpinner = styled.div`
  border: 3px solid rgba(255, 255, 255, 0.2);
  border-top: 3px solid #fc7500;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 1rem auto;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const PasswordValidationModal = ({ 
  ninoNombre, 
  onValidate, 
  onCancel, 
  isValidating,
  externalError 
}) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Evitar scroll cuando el modal está abierto
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  // Actualizar error local cuando llega un error externo y limpiar contraseña
  useEffect(() => {
    if (externalError) {
      setError(externalError);
      // Limpiar el campo de contraseña cuando hay un error de validación
      setPassword('');
    }
  }, [externalError]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!password.trim()) {
      setError('Por favor, ingresa la contraseña');
      return;
    }

    setError('');
    onValidate(password);
  };

  const handleCancel = () => {
    setPassword('');
    setError('');
    onCancel();
  };

  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  return (
    <ModalOverlay onClick={(e) => e.target === e.currentTarget && handleCancel()}>
      <ModalContainer onClick={handleModalClick}>
        <CloseButton onClick={handleCancel} disabled={isValidating}>
          &times;
        </CloseButton>
        
        <ModalHeader>
          <Title>Validar Niño</Title>
        </ModalHeader>
        
        <ModalBody>
          <Subtitle>
            Ingresa la contraseña del niño <strong>{ninoNombre}</strong> para continuar
          </Subtitle>
          
          <form onSubmit={handleSubmit}>
            <InputContainer>
              <Input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  // Limpiar cualquier error cuando el usuario escribe
                  setError('');
                }}
                disabled={isValidating}
                autoFocus
              />
            </InputContainer>

            {error && <ErrorMessage>{error}</ErrorMessage>}

            {isValidating ? (
              <LoadingSpinner />
            ) : (
              <ModalFooter>
                <SecondaryButton 
                  type="button" 
                  onClick={handleCancel}
                  disabled={isValidating}
                >
                  Cancelar
                </SecondaryButton>
                <PrimaryButton 
                  type="submit"
                  disabled={isValidating || !password.trim()}
                >
                  Iniciar Juego
                </PrimaryButton>
              </ModalFooter>
            )}
          </form>
        </ModalBody>
      </ModalContainer>
    </ModalOverlay>
  );
};

PasswordValidationModal.propTypes = {
  ninoNombre: PropTypes.string.isRequired,
  onValidate: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  isValidating: PropTypes.bool,
  externalError: PropTypes.string
};

PasswordValidationModal.defaultProps = {
  isValidating: false,
  externalError: ''
};

export default PasswordValidationModal;