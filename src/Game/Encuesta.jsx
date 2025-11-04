import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import Navbar from '../components/Navbar';
import { GlobalStyle } from '../styles/styles';
import GameBackground from '../components/GameBackground';
import ninoService from '../api/ninoService';
import Loading from '../components/Loading';
import fondoEncuesta from '../../public/images/Background.png';

const Container = styled.div`
  background: rgba(0, 0, 0, 0.85);
  padding: 2.5rem;
  border-radius: 15px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  max-width: 900px;
  margin: 0 auto;
  color: #f4f4f4;
  font-family: 'Manrope', sans-serif;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const Header = styled.div`
  text-align: center;
  border-bottom: 2px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 1.5rem;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  margin: 0;
  color: #f4f4f4;
  font-weight: 700;
`;

const SuccessBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(76, 175, 80, 0.15);
  color: #4CAF50;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  margin: 1.5rem 0 1rem 0;
  font-size: 1rem;
  font-weight: 600;
  border: 1px solid rgba(76, 175, 80, 0.3);
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  
  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const Card = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 1.5rem;
  transition: all 0.3s;
  
  &:hover {
    background: rgba(255, 255, 255, 0.08);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
`;

const CardTitle = styled.h3`
  font-size: 1.25rem;
  margin: 0 0 1.25rem 0;
  color: #fc7500;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  
  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
`;

const Label = styled.span`
  font-weight: 600;
  color: rgba(244, 244, 244, 0.7);
  font-size: 0.95rem;
`;

const Value = styled.span`
  color: #f4f4f4;
  font-weight: 500;
  font-size: 0.95rem;
  text-align: right;
`;

const HighlightValue = styled(Value)`
  background: rgba(252, 117, 0, 0.2);
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
  color: #fc7500;
  font-weight: 700;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const Button = styled.button`
  padding: 0.875rem 2rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  font-family: 'Manrope', sans-serif;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }
`;

const PrimaryButton = styled(Button)`
  background: #fc7500;
  color: white;
  
  &:hover {
    background: #e56700;
  }
`;

const SecondaryButton = styled(Button)`
  background: rgba(255, 255, 255, 0.1);
  color: #f4f4f4;
  border: 1px solid rgba(255, 255, 255, 0.2);
  
  &:hover {
    background: rgba(255, 255, 255, 0.15);
  }
`;

const FullWidthCard = styled(Card)`
  grid-column: 1 / -1;
`;

const Encuesta = () => {
  const [ninoInfo, setNinoInfo] = useState(null);
  const [progreso, setProgreso] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadNinoData();
  }, []);

  const loadNinoData = async () => {
    try {
      setLoading(true);

      // Cargar información del niño desde localStorage
      const currentNinoStr = localStorage.getItem('currentNino');
      
      if (!currentNinoStr) {
        alert('No hay sesión activa');
        navigate('/ninos-list');
        return;
      }

      const nino = JSON.parse(currentNinoStr);
      setNinoInfo(nino);

      // 🔑 Cargar progreso actual desde localStorage usando el ID del niño
      const gameType = localStorage.getItem(`lastGameType_${nino.id}`);
      const difficulty = localStorage.getItem(`lastDifficulty_${nino.id}`);
      const currentLevel = localStorage.getItem(`lastLevel_${nino.id}`);
      const accumulatedScore = localStorage.getItem(`accumulatedScore_${nino.id}`);

      console.log('🔍 Cargando progreso en Encuesta para niño:', nino.id);
      console.log('  - gameType:', gameType);
      console.log('  - difficulty:', difficulty);
      console.log('  - currentLevel:', currentLevel);
      console.log('  - accumulatedScore:', accumulatedScore);
      
      // También verificar lastSavedProgress
      const savedProgress = localStorage.getItem('lastSavedProgress');
      if (savedProgress) {
        console.log('  - lastSavedProgress:', JSON.parse(savedProgress));
      }

      if (gameType && difficulty && currentLevel) {
        setProgreso({
          game_type: gameType,
          difficulty: difficulty,
          current_level: parseInt(currentLevel),
          accumulated_score: parseInt(accumulatedScore) || 200
        });
      }

    } catch (error) {
      console.error('Error cargando datos:', error);
      alert('Error cargando información');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToMenu = () => {
    // ⚠️ IMPORTANTE: Solo limpiamos currentNino y lastSavedProgress
    // Las claves genéricas con userId deben mantenerse para que la validación de contraseña 
    // pueda detectar el progreso de cada niño individualmente
    console.log('🧹 Limpiando solo currentNino y lastSavedProgress');
    console.log('✅ Manteniendo claves genéricas con userId para próxima validación');
    
    localStorage.removeItem('currentNino');
    localStorage.removeItem('lastSavedProgress');
    
    // Las claves con userId (lastGameType_X, lastDifficulty_X, etc.) se mantienen
    console.log('📦 Claves de progreso por niño mantenidas en localStorage');
    
    navigate('/ninos-list');
  };

  if (loading) {
    return (
      <>
        <GlobalStyle />
        <Navbar />
        <GameBackground maxWidth="1200px" backgroundImage={fondoEncuesta}>
          <Loading />
        </GameBackground>
      </>
    );
  }

  const getGameTypeName = (type) => {
    return type === 'cognados' ? 'Cognados' : 'Pares Mínimos';
  };

  const getDifficultyName = (diff) => {
    const names = { facil: 'Fácil', medio: 'Medio', dificil: 'Difícil' };
    return names[diff] || diff;
  };

  return (
    <>
      <GlobalStyle />
      <Navbar />
      <GameBackground maxWidth="1200px" backgroundImage={fondoEncuesta}>
        <Container>
          <Header>
            <Title>📊 Progreso Guardado</Title>
            <SuccessBadge>
              <span>✓</span>
              <span>Información guardada exitosamente</span>
            </SuccessBadge>
          </Header>

          <ContentGrid>
            {ninoInfo && (
              <Card>
                <CardTitle>
                  <span>👤</span>
                  <span>Información del Estudiante</span>
                </CardTitle>
                <InfoRow>
                  <Label>Nombre:</Label>
                  <Value>{ninoInfo.nombre}</Value>
                </InfoRow>
                <InfoRow>
                  <Label>Edad:</Label>
                  <Value>{ninoInfo.edad} años</Value>
                </InfoRow>
                <InfoRow>
                  <Label>Grado:</Label>
                  <Value>{ninoInfo.grado}</Value>
                </InfoRow>
                <InfoRow>
                  <Label>Colegio:</Label>
                  <Value>{ninoInfo.colegio}</Value>
                </InfoRow>
                <InfoRow>
                  <Label>Jornada:</Label>
                  <Value>{ninoInfo.jornada}</Value>
                </InfoRow>
              </Card>
            )}

            {progreso && (
              <Card>
                <CardTitle>
                  <span>🎮</span>
                  <span>Progreso del Juego</span>
                </CardTitle>
                <InfoRow>
                  <Label>Tipo de Juego:</Label>
                  <Value>{getGameTypeName(progreso.game_type)}</Value>
                </InfoRow>
                <InfoRow>
                  <Label>Dificultad:</Label>
                  <Value>{getDifficultyName(progreso.difficulty)}</Value>
                </InfoRow>
                <InfoRow>
                  <Label>Nivel Alcanzado:</Label>
                  <HighlightValue>Nivel {progreso.current_level}</HighlightValue>
                </InfoRow>
                <InfoRow>
                  <Label>Puntaje Total:</Label>
                  <HighlightValue>{progreso.accumulated_score} pts</HighlightValue>
                </InfoRow>
              </Card>
            )}
          </ContentGrid>

          <ButtonContainer>
            <PrimaryButton onClick={handleBackToMenu}>
              <span>🏠</span>
              <span>Volver a Lista de Niños</span>
            </PrimaryButton>
          </ButtonContainer>
        </Container>
      </GameBackground>
    </>
  );
};

export default Encuesta;