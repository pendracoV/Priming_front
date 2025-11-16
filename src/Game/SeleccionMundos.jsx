import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import GameBackground from '../components/GameBackground';
import ninoService from '../api/ninoService';
import fondoSeleccion from '../../public/images/Background.png';
// Importamos las imágenes directamente desde public
import islandImage from '../../public/images/island.png';
import pirateIslandImage from '../../public/images/pirate-island.png';
// Importamos el GlobalStyle para mantener la consistencia de fuentes
import Navbar from '../components/Navbar';
import { GlobalStyle } from '../styles/styles';
import Loading from '../components/Loading';

// Paleta de colores basada en el mockup
const colors = {
  darkPurple: '#1e1b4b', // Fondo de las tarjetas   // Bordes y acentos
  lightPurple: '#8b5cf6', // Gradiente superior
  blue: '#3b82f6',       // Gradiente inferior
  buttonPurple: '#934486', // Color de los botones
  white: '#ffffff',      // Texto
};

// Contenedor principal para las tarjetas con opacidad
const MainContainer = styled.div`
  background: rgba(20, 20, 50, 0.5); // Fondo azul oscuro con opacidad
  padding: 40px;
  border-radius: 30px;
  box-shadow: 0 15px 25px rgba(0, 0, 0, 0.2);
  width: 100%;               
  max-width: 900px;          
  margin: 0 auto;           
`;

// Título principal
const Title = styled.h1`
  color: ${colors.white};
  font-size: 3rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  margin-bottom: 50px;
  font-family: 'Manrope', sans-serif;
  text-align: center;
`;

// Componentes específicos para esta pantalla con colores actualizados
const CardsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 40px;
  width: 100%;
  flex-wrap: wrap;
`;

const GameCard = styled.div`
  width: 300px;
  height: 380px;
  background: rgba(30, 27, 75, 0.87); // Aquí se define la opacidad (0.87 = 87% opaco)
  border-radius: 20px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s, box-shadow 0.3s;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 25px rgba(0, 0, 0, 0.4);
  }
`;

const GameImageContainer = styled.div`
  width: 200px;
  height: 200px;
  border-radius: 50%;
  overflow: hidden;
  margin-bottom: 20px;
`;

const GameImageElement = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const GameTitle = styled.h2`
  color: ${colors.white};
  font-size: 1.5rem;
  margin-bottom: 20px;
  font-family: 'Manrope', sans-serif;
`;

const DifficultySelect = styled.select`
  width: 90%;
  padding: 10px;
  background-color: rgba(147, 68, 134, 0.7); // Color del botón con transparencia
  color: ${colors.white};
  border: none;
  border-radius: 10px;
  margin-bottom: 15px;
  text-align: center;
  font-size: 1rem;
  cursor: pointer;
  font-family: 'Manrope', sans-serif;
  transition: background-color 0.3s;
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px ${colors.purple};
  }

  option {
    background-color: rgba(65, 21, 75, 0.95); // Más opaco para mejor legibilidad de opciones
    color: ${colors.white};
  }
  
  &:hover {
    background-color: rgba(147, 68, 134, 0.85); // Un poco más opaco al pasar el mouse
  }
`;

const PlayButton = styled.button`
  width: 90%;
  padding: 12px;
  background-color: rgba(147, 68, 134, 0.7); // Color del botón con transparencia
  color: ${colors.white};
  border: none;
  border-radius: 10px;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
  font-family: 'Manrope', sans-serif;
  
  &:hover {
    background-color: rgba(147, 68, 134, 0.9); // Más opaco al pasar el mouse
  }
`;

const SeleccionMundos = () => {
  const [cognatesDifficulty, setCognatesDifficulty] = useState('facil');
  const [pairsDifficulty, setPairsDifficulty] = useState('facil');
  const [loading, setLoading] = useState(false);
  const [ninoInfo, setNinoInfo] = useState(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  useEffect(() => {
    const currentNinoStr = localStorage.getItem('currentNino');
    
    if (currentNinoStr) {
      try {
        const nino = JSON.parse(currentNinoStr);
        setNinoInfo(nino);
      } catch (error) {
      }
    }

    // Si no hay niño en sesión, redirigir
    const ninoId = searchParams.get('ninoId');
    if (!ninoId && !currentNinoStr) {
      navigate('/ninos-list');
    }
  }, [searchParams, navigate]);

  const handleCognatesPlay = async () => {
    if (!ninoInfo) {
      alert('No hay información del niño en la sesión');
      navigate('/ninos-list');
      return;
    }

    setLoading(true);
    
    try {
      const userId = ninoInfo.id;
      
      // Verificar si existe progreso guardado
      const progresoResponse = await ninoService.getProgresoEspecifico(
        userId,
        'cognados',
        cognatesDifficulty
      );

      localStorage.setItem(`lastGameType_${userId}`, 'cognados');
      localStorage.setItem(`lastDifficulty_${userId}`, cognatesDifficulty);

      if (progresoResponse.tiene_progreso && progresoResponse.data) {
        // Si tiene progreso, navegar al nivel guardado
        const { current_level, accumulated_score } = progresoResponse.data;
        
        localStorage.setItem(`lastLevel_${userId}`, String(current_level));
        localStorage.setItem(`accumulatedScore_${userId}`, String(accumulated_score));
        
        sessionStorage.setItem(`authorized_navigation_cognados_${cognatesDifficulty}_${current_level}`, 'true');
        navigate(`/nivel/cognados/${cognatesDifficulty}/${current_level}`);
      } else {
        // Si no tiene progreso, iniciar desde nivel 1
        localStorage.setItem(`lastLevel_${userId}`, '1');
        localStorage.setItem(`accumulatedScore_${userId}`, '200');
        
        sessionStorage.setItem(`authorized_navigation_cognados_${cognatesDifficulty}_1`, 'true');
        navigate(`/nivel/cognados/${cognatesDifficulty}/1`);
      }
    } catch (error) {
      // En caso de error, iniciar desde nivel 1
      const userId = ninoInfo.id;
      localStorage.setItem(`lastLevel_${userId}`, '1');
      localStorage.setItem(`accumulatedScore_${userId}`, '200');
      sessionStorage.setItem(`authorized_navigation_cognados_${cognatesDifficulty}_1`, 'true');
      navigate(`/nivel/cognados/${cognatesDifficulty}/1`);
    } finally {
      setLoading(false);
    }
  };
  
  const handlePairsPlay = async () => {
    if (!ninoInfo) {
      alert('No hay información del niño en la sesión');
      navigate('/ninos-list');
      return;
    }

    setLoading(true);
    
    try {
      const userId = ninoInfo.id;
      
      // Verificar si existe progreso guardado
      const progresoResponse = await ninoService.getProgresoEspecifico(
        userId,
        'pares-minimos',
        pairsDifficulty
      );

      localStorage.setItem(`lastGameType_${userId}`, 'pares-minimos');
      localStorage.setItem(`lastDifficulty_${userId}`, pairsDifficulty);

      if (progresoResponse.tiene_progreso && progresoResponse.data) {
        // Si tiene progreso, navegar al nivel guardado
        const { current_level, accumulated_score } = progresoResponse.data;
        
        localStorage.setItem(`lastLevel_${userId}`, String(current_level));
        localStorage.setItem(`accumulatedScore_${userId}`, String(accumulated_score));
        
        sessionStorage.setItem(`authorized_navigation_pares_${pairsDifficulty}_${current_level}`, 'true');
        
        navigate(`/nivel/pares-minimos/${pairsDifficulty}/${current_level}`);
      } else {
        // Si no tiene progreso, iniciar desde nivel 1
        localStorage.setItem(`lastLevel_${userId}`, '1');
        localStorage.setItem(`accumulatedScore_${userId}`, '200');
        
        sessionStorage.setItem(`authorized_navigation_pares_${pairsDifficulty}_1`, 'true');
        
        navigate(`/nivel/pares-minimos/${pairsDifficulty}/1`);
      }
    } catch (error) {
      // En caso de error, iniciar desde nivel 1
      const userId = ninoInfo.id;
      localStorage.setItem(`lastLevel_${userId}`, '1');
      localStorage.setItem(`accumulatedScore_${userId}`, '200');
      
      sessionStorage.setItem(`authorized_navigation_pares_${pairsDifficulty}_1`, 'true');
      
      navigate(`/nivel/pares-minimos/${pairsDifficulty}/1`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <GlobalStyle />
        <Navbar />
        <GameBackground maxWidth="1200px" backgroundImage={fondoSeleccion}>
          <Loading />
        </GameBackground>
      </>
    );
  }

  return (
    <>
      <GlobalStyle />
      <Navbar />
      <GameBackground maxWidth="1200px" backgroundImage={fondoSeleccion}>
        <MainContainer>
          <Title>Selecciona tu mundo</Title>
          {ninoInfo && (
            <Title style={{ fontSize: '1.5rem', marginBottom: '20px' }}>
               ¡Hola {ninoInfo.nombre}!
            </Title>
          )}
          <CardsContainer>
            {/* Tarjeta de Cognados */}
            <GameCard>
              <GameImageContainer>
                <GameImageElement src={islandImage} alt="Isla de cognados" />
              </GameImageContainer>
              <GameTitle>Cognados</GameTitle>
              <DifficultySelect 
                value={cognatesDifficulty}
                onChange={(e) => setCognatesDifficulty(e.target.value)}
              >
                <option value="facil">Dificultad: Fácil</option>
                <option value="medio">Dificultad: Medio</option>
                <option value="dificil">Dificultad: Difícil</option>
              </DifficultySelect>
              <PlayButton onClick={handleCognatesPlay}>JUGAR</PlayButton>
            </GameCard>
            
            {/* Tarjeta de Pares Mínimos */}
            <GameCard>
              <GameImageContainer>
                <GameImageElement src={pirateIslandImage} alt="Isla pirata" />
              </GameImageContainer>
              <GameTitle>Pares mínimos</GameTitle>
              <DifficultySelect
                value={pairsDifficulty}
                onChange={(e) => setPairsDifficulty(e.target.value)}
              >
                <option value="facil">Dificultad: Fácil</option>
                <option value="medio">Dificultad: Medio</option>
                <option value="dificil">Dificultad: Difícil</option>
              </DifficultySelect>
              <PlayButton onClick={handlePairsPlay}>JUGAR</PlayButton>
            </GameCard>
          </CardsContainer>
        </MainContainer>
      </GameBackground>
    </>
  );
};

export default SeleccionMundos;