import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { GlobalStyle } from '../styles/styles';

// Creamos el contexto
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Estado para el usuario autenticado
  const [user, setUser] = useState(null);
  // Estado para indicar si la autenticación está siendo verificada
  const [loading, setLoading] = useState(true);

  // Función para iniciar sesión
  const login = (token, userData) => {
    localStorage.setItem('token', token);
    setUser(userData);
  };

  // Función para cerrar sesión
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  // Verificar si hay un token al cargar la aplicación
  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
          // Verificar el token con el backend usando la ruta correcta
          const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/verify-token`, 
            { headers: { Authorization: token } }
          );
          
          // Si el token es válido, establecer el usuario
          if (response.data.valid) {
            setUser(response.data.user);
          } else {
            // Si el token no es válido, eliminar el token
            logout();
          }
        } catch (error) {
          logout();
        }
      }
      
      // Indicar que la verificación ha terminado
      setLoading(false);
    };

    verifyToken();
  }, []);

  // Componente de carga con animación infantil
  const LoadingScreen = () => (
    <div style={{ 
      position: 'fixed',          // Posición fija para cubrir toda la pantalla
      top: 0,                     // Desde la parte superior
      left: 0,                    // Desde la parte izquierda
      width: '100vw',             // Ancho completo de la ventana
      height: '100vh',            // Alto completo de la ventana
      margin: 0,                  // Sin márgenes
      padding: 0,                 // Sin padding
      display: 'flex', 
      flexDirection: 'column',
      justifyContent: 'center', 
      alignItems: 'center', 
      background: 'linear-gradient(135deg,rgb(22, 48, 131) 0%,rgb(173, 180, 248) 100%)',
      fontFamily: 'Comic Sans MS, cursive',
      zIndex: 9999               // Por encima de cualquier otro elemento
    }}>
      {/* Círculos animados */}
      <div style={{
        display: 'flex',
        gap: '10px',
        marginBottom: '30px'
      }}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              backgroundColor: ['#ff6b6b', '#4ecdc4', '#45b7d1'][i],
              animation: `bounce 1.4s infinite ease-in-out both`,
              animationDelay: `${i * 0.16}s`
            }}
          />
        ))}
      </div>

      {/* Texto de carga */}
      <div style={{
        color: '#ffffff',
        fontSize: '24px',
        fontWeight: 'bold',
        textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
        animation: 'pulse 2s infinite',
        fontFamily: 'Manrope, sans-serif'

      }}>
         Cargando... 
      </div>

      {/* Barra de progreso animada */}
      <div style={{
        width: '200px',
        height: '8px',
        backgroundColor: 'rgba(255,255,255,0.3)',
        borderRadius: '10px',
        marginTop: '20px',
        overflow: 'hidden'
      }}>
        <div style={{
          width: '100%',
          height: '100%',
          background: 'linear-gradient(90deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4)',
          borderRadius: '10px',
          animation: 'slide 2s infinite'
        }} />
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes bounce {
          0%, 80%, 100% { 
            transform: scale(0);
          } 
          40% { 
            transform: scale(1);
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.05);
          }
        }

        @keyframes slide {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );

  // Proporcionar el contexto de autenticación a los componentes hijos
  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {/* Mostrar los hijos solo cuando la verificación de autenticación haya terminado */}
      {!loading ? children : <LoadingScreen />}
    </AuthContext.Provider>
  );
};