// src/styles/styles.js
import styled, { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  * {
    font-family: 'Manrope', sans-serif;
  }
`;

export const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100vw;
    height: 100vh;
    margin: 0;
    padding: 0;
    position: fixed;
    top: 0;
    left: 0;
    overflow: hidden;
    background: url('/images/image.png') no-repeat center center / cover;
    
    @media (max-width: 768px) {
        width: 100%;
        height: 100%;
        padding: 0;
    }
`;

export const FormContainer = styled.div`
    background: rgba(0, 0, 0, 0.4);
    padding: 2rem;
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    width: 100%;
    max-width: 550px;
    text-align: center;
    align-items: center;
    padding: 50px;
    
    @media (max-width: 768px) {
        max-width: 90%;
        padding: 30px 20px;
    }
    
    @media (max-width: 480px) {
        max-width: 95%;
        padding: 20px 15px;
    }
`;
// Agrega esto a tu archivo de estilos o directamente en el componente
export const AsignarContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100vh;
  margin: 0;
  padding: 0;
  overflow-y: auto;
  background: url('/images/image.png') no-repeat center center / cover;
  background-attachment: fixed;
  
  @media (max-width: 768px) {
    background-attachment: scroll;
  }
`;

export const AsignarFormContainer = styled.div`
  background: rgba(0, 0, 0, 0.4);
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 550px;
  text-align: center;
  align-items: center;
  padding: 50px;
  margin: 80px auto 20px auto; // Espacio para el Navbar
  align-self: center;
  
  @media (max-width: 768px) {
    max-width: 90%;
    padding: 30px 20px;
    margin: 80px auto 20px auto;
  }
  
  @media (max-width: 480px) {
    max-width: 95%;
    padding: 20px 15px;
    margin: 70px auto 20px auto;
  }
`;

export const Container2 = styled.div`
    background: rgba(0, 0, 0, 0.2);
    padding: 2rem;
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    align-items: center;
`;

// Definir un ancho constante para todos los controles del formulario
const formControlWidth = '100%'; // Usar 100% para que se adapte al contenedor

export const Input = styled.input`
    width: ${formControlWidth};
    padding: 0.75rem;
    margin: 0.5rem 0;
    border: 1px solid #ccc;
    background: rgba(106, 106, 106);
    border-radius: 50px;
    font-size: 1rem;
    color: #f4f4f4;
    outline: none;
    box-sizing: border-box;

    &::placeholder {
        color: #f4f4f4;
        opacity: 0.5;
    }
    
    @media (max-width: 768px) {
        font-size: 0.95rem;
        padding: 0.65rem;
    }
    
    @media (max-width: 480px) {
        font-size: 0.9rem;
        padding: 0.6rem;
        margin: 0.4rem 0;
    }
`;

export const Select = styled.select`
    width: ${formControlWidth};
    background: rgba(106, 106, 106);
    padding: 0.75rem 2rem 0.75rem 0.75rem;
    margin: 0.5rem 0;
    border: 1px solid #ccc;
    border-radius: 50px;
    font-size: 1rem;
    color: #f4f4f4;
    appearance: none;
    background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23f4f4f4'%3e%3cpath d='M7 10l5 5 5-5z'/%3e%3c/svg%3e");
    background-repeat: no-repeat;
    background-position: right 15px center;
    background-size: 16px;
    outline: none;
    box-sizing: border-box;
    
    option {
        background-color: rgba(106, 106, 106);
        color: #f4f4f4;
    }
    
    @media (max-width: 768px) {
        font-size: 0.95rem;
        padding: 0.65rem 2rem 0.65rem 0.65rem;
    }
    
    @media (max-width: 480px) {
        font-size: 0.9rem;
        padding: 0.6rem 2rem 0.6rem 0.6rem;
        margin: 0.4rem 0;
    }
`;

export const Button = styled.button`
    width: ${formControlWidth};
    padding: 0.75rem;
    margin: 1rem 0;
    background-color: #fc7500;
    color: white;
    border: none;
    border-radius: 20px;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.3s ease;
    box-sizing: border-box;

    &:hover {
        background-color: #e56700;
    }
    
    @media (max-width: 768px) {
        font-size: 0.95rem;
        padding: 0.65rem;
        margin: 0.8rem 0;
    }
    
    @media (max-width: 480px) {
        font-size: 0.9rem;
        padding: 0.6rem;
        margin: 0.6rem 0;
    }
`;

export const H1 = styled.h1`
    color: #f4f4f4;
`;

export const H3 = styled.h3`
    color: #f4f4f4;
`;

export const Label = styled.label`
    color: #f4f4f4;
`;

export const A = styled.a`
    color: #f4f4f4;
`;

export const P = styled.p`
    color: #f4f4f4;
`;
export const Li = styled.li`
    color: #f4f4f4;
`;

export const Ul = styled.ul`
    color: #f4f4f4;
`;


export const LogoutButton = styled(Button)`
    position: fixed; 
    bottom: 20px;
    left: 20px; 
    width: auto; 
    padding: 10px 20px;
    background-color: #ff4d4d; 
    &:hover {
        background-color: #cc0000; 
    }
    
    @media (max-width: 768px) {
        bottom: 15px;
        left: 15px;
        padding: 8px 15px;
        font-size: 0.9rem;
    }
    
    @media (max-width: 480px) {
        bottom: 10px;
        left: 10px;
        padding: 6px 12px;
        font-size: 0.8rem;
    }
`;