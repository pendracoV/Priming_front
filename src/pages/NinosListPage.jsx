import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import evaluadorService from "../api/evaluadorService";
import ninoService from "../api/ninoService";
import {
  GlobalStyle,
  Button,
  H1,
} from '../styles/styles';

// Importando componentes reutilizables
import NinosTable from "../components/NinosTable";
import Loading from "../components/Loading";
import EmptyState from "../components/EmptyState";
import PageLayout, { ErrorMessage } from "../components/PageLayout";
import PasswordValidationModal from "../components/PasswordValidationModal";

const NinosListPage = () => {
  const { user } = useContext(AuthContext);
  const [ninos, setNinos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [selectedNino, setSelectedNino] = useState(null);
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState('');
  const navigate = useNavigate();

  // Función para limpiar localStorage de un niño específico
  const cleanNinoLocalStorage = (ninoId) => {
    localStorage.removeItem(`lastGameType_${ninoId}`);
    localStorage.removeItem(`lastDifficulty_${ninoId}`);
    localStorage.removeItem(`lastLevel_${ninoId}`);
    localStorage.removeItem(`accumulatedScore_${ninoId}`);
  };

  useEffect(() => {
    const fetchNinos = async () => {
      try {
        setLoading(true);
        // Usamos el token almacenado directamente
        const token = localStorage.getItem("token");
        
        if (!token) {
          throw new Error("No hay token disponible");
        }
        
        const response = await evaluadorService.getNinosAsignados();
        
        
        // Procesamiento de datos
        let ninosData = [];
        
        if (Array.isArray(response)) {
          ninosData = response;
        } else if (response && Array.isArray(response.data)) {
          ninosData = response.data;
        } else if (response && response.success && Array.isArray(response.data)) {
          ninosData = response.data;
        }
        
        
        // Normalización de datos y verificación de progreso OPTIMIZADA
        const ninosConProgreso = await Promise.all(ninosData.map(async (nino) => {
          const ninoId = nino.nino_id || nino.id;
          
          // Verificar si tiene progreso REAL solo en la base de datos
          let tieneProgreso = false;
          
          try {
            // Solo verificar las combinaciones más comunes primero
            const cognadosFacil = await ninoService.getProgresoEspecifico(ninoId, 'cognados', 'facil').catch(() => null);
            
            if (cognadosFacil && cognadosFacil.tiene_progreso) {
              tieneProgreso = true;
            } else {
              // Si no está en cognados fácil, verificar otros
              const allProgress = await Promise.all([
                ninoService.getProgresoEspecifico(ninoId, 'cognados', 'medio').catch(() => null),
                ninoService.getProgresoEspecifico(ninoId, 'cognados', 'dificil').catch(() => null),
                ninoService.getProgresoEspecifico(ninoId, 'pares-minimos', 'facil').catch(() => null),
                ninoService.getProgresoEspecifico(ninoId, 'pares-minimos', 'medio').catch(() => null),
                ninoService.getProgresoEspecifico(ninoId, 'pares-minimos', 'dificil').catch(() => null),
              ]);
              
              tieneProgreso = allProgress.some(p => p && p.tiene_progreso && p.data);
            }
            
          } catch (error) {
          }
          
          return {
            ...nino,
            id: ninoId,
            nombre: nino.nino_nombre || nino.nombre || "Nombre no disponible",
            edad: nino.edad,
            grado: nino.grado,
            colegio: nino.colegio,
            jornada: nino.jornada,
            tiene_juego: tieneProgreso
          };
        }));
        
        setNinos(ninosConProgreso);
        setLoading(false);
      } catch (err) {
        setError("No se pudo cargar la lista de niños. Por favor, intenta de nuevo más tarde.");
        setLoading(false);
        
        // Datos de ejemplo en caso de error (solo para desarrollo)
        if (process.env.NODE_ENV === 'development') {
          setNinos([
            { id: 1, nombre: "Ana García", edad: 6, grado: 1, colegio: "Colegio San José", jornada: "mañana", tiene_juego: false },
            { id: 2, nombre: "Pedro López", edad: 7, grado: 2, colegio: "Colegio Santa María", jornada: "tarde", tiene_juego: true },
          ]);
        }
      }
    };

    fetchNinos();
  }, []);

  const handleIniciarJuego = (ninoId) => {
    // Buscar información del niño
    const nino = ninos.find(n => n.id === ninoId || n.nino_id === ninoId);
    
    if (!nino) {
      setError('No se encontró información del niño');
      return;
    }

    // Guardar niño seleccionado y mostrar modal de contraseña
    setSelectedNino(nino);
    setShowPasswordModal(true);
    setValidationError('');
  };

  const handleContinuarJuego = (ninoId) => {
    // La misma lógica que iniciar juego - valida contraseña y carga progreso
    handleIniciarJuego(ninoId);
  };

  const handleValidatePassword = async (password) => {
    if (!selectedNino) return;

    setIsValidating(true);
    setValidationError('');

    try {
      const ninoId = selectedNino.id || selectedNino.nino_id;
      
      // Validar contraseña
      const response = await ninoService.validarPassword(ninoId, password);

      if (response.success) {
        // Guardar información del niño en localStorage para la sesión
        const currentNinoData = {
          id: ninoId,
          nombre: selectedNino.nombre || selectedNino.nino_nombre,
          edad: selectedNino.edad,
          grado: selectedNino.grado,
          colegio: selectedNino.colegio,
          jornada: selectedNino.jornada,
          sessionStartTime: Date.now()
        };
        
        localStorage.setItem('currentNino', JSON.stringify(currentNinoData));

        try {
          const allProgress = await Promise.all([
            ninoService.getProgresoEspecifico(ninoId, 'cognados', 'facil').catch(() => null),
            ninoService.getProgresoEspecifico(ninoId, 'cognados', 'medio').catch(() => null),
            ninoService.getProgresoEspecifico(ninoId, 'cognados', 'dificil').catch(() => null),
            ninoService.getProgresoEspecifico(ninoId, 'pares-minimos', 'facil').catch(() => null),
            ninoService.getProgresoEspecifico(ninoId, 'pares-minimos', 'medio').catch(() => null),
            ninoService.getProgresoEspecifico(ninoId, 'pares-minimos', 'dificil').catch(() => null),
          ]);
          
          const validProgress = allProgress.filter(p => p && p.tiene_progreso && p.data);
          
          if (validProgress.length > 0) {
            const latestProgress = validProgress.sort((a, b) => 
              new Date(b.data.last_played) - new Date(a.data.last_played)
            )[0];
            
            const progressData = latestProgress.data;
            
            localStorage.setItem(`lastGameType_${ninoId}`, progressData.game_type);
            localStorage.setItem(`lastDifficulty_${ninoId}`, progressData.difficulty);
            localStorage.setItem(`lastLevel_${ninoId}`, progressData.current_level.toString());
            localStorage.setItem(`accumulatedScore_${ninoId}`, progressData.accumulated_score.toString());
            
            setShowPasswordModal(false);
            setSelectedNino(null);
            
            const route = `/nivel/${progressData.game_type}/${progressData.difficulty}/${progressData.current_level}`;
            navigate(route);
            return;
          }
          
          cleanNinoLocalStorage(ninoId);
        } catch (progressError) {
        }

        // Si no hay progreso, ir a selección de mundos
        setShowPasswordModal(false);
        setSelectedNino(null);
        navigate(`/seleccion-mundos?ninoId=${ninoId}`);
      } else {
        // Contraseña incorrecta
        setValidationError('❌ Contraseña incorrecta. Por favor, intenta de nuevo.');
      }
    } catch (error) {
      setValidationError(error.message || '❌ Error al validar contraseña. Por favor, intenta nuevamente.');
    } finally {
      setIsValidating(false);
    }
  };

  const handleCancelPasswordModal = () => {
    setShowPasswordModal(false);
    setSelectedNino(null);
    setValidationError('');
  };

  const handleAsignarNino = () => {
    navigate('/asignar-nino');
  };

  const renderContent = () => {
    if (loading) {
      return <Loading />;
    } 
    
    if (error) {
      return <ErrorMessage 
              message={error} 
              onRetry={() => window.location.reload()} 
             />;
    } 
    
    if (ninos.length === 0) {
      return <EmptyState 
              message="No tienes niños asignados actualmente." 
              buttonText="Asignar Niño"
              onButtonClick={handleAsignarNino}
             />;
    } 
    
    return (
      <>
        <NinosTable 
          ninos={ninos} 
          onIniciarJuego={handleIniciarJuego}
          onContinuarJuego={handleContinuarJuego}
        />
        <Button 
          style={{ marginTop: '20px' }} 
          onClick={handleAsignarNino}
        >
          Asignar Nuevo Niño
        </Button>
      </>
    );
  };

  return (
    <>
      <GlobalStyle />
      <Navbar />
      
      <PageLayout 
        title={<H1>Lista de Niños Asignados</H1>}
      >
        {renderContent()}
      </PageLayout>

      {/* Modal de validación de contraseña */}
      {showPasswordModal && selectedNino && (
        <PasswordValidationModal
          ninoNombre={selectedNino.nombre}
          onValidate={handleValidatePassword}
          onCancel={handleCancelPasswordModal}
          isValidating={isValidating}
          externalError={validationError}
        />
      )}
    </>
  );
};

export default NinosListPage;