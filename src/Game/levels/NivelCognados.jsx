// Sistema de Comparación de Audio para NivelCognados.jsx

import React, { useState, useEffect, useContext, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { AuthContext } from '../../context/AuthContext';
import { getNivelConfig } from '../data/nivelesConfig';
import coinImage from '../../../public/images/coin.png';

// Función para mezclar array (algoritmo Fisher-Yates)
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Función para obtener duración de audio
const getAudioDuration = (audioPath) => {
  return new Promise((resolve) => {
    if (!audioPath) {
      resolve(0);
      return;
    }
    
    const audio = new Audio(audioPath);
    audio.addEventListener('loadedmetadata', () => {
      resolve(audio.duration * 1000); // Convertir a milisegundos
    });
    audio.addEventListener('error', () => {
      resolve(1000); // Duración por defecto si hay error
    });
  });
};

const NivelCognados = () => {
  const { user } = useContext(AuthContext);
  const { dificultad, nivel } = useParams();
  const navigate = useNavigate();
  
  // Estados para el juego
  const [score, setScore] = useState(200);
  const [correctSelections, setCorrectSelections] = useState(0);
  const [totalSelections, setTotalSelections] = useState(0);
  const [remainingTime, setRemainingTime] = useState(0);
  const [isTraining, setIsTraining] = useState(true);
  const [levelConfig, setLevelConfig] = useState(null);
  const [audioPlayed, setAudioPlayed] = useState(0);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  
  // Estados para el nuevo sistema de comparación
  const [lastSelectedSelector, setLastSelectedSelector] = useState(null);
  const [audioQueue, setAudioQueue] = useState([]);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [comparedSelectors, setComparedSelectors] = useState([]); // Solo los correctos se marcan
  const [highlightedSelector, setHighlightedSelector] = useState(null);
  
  // Referencias para controlar audio
  const currentAudioRef = useRef(null);
  const audioTimeoutRef = useRef(null);

  // Inyectar CSS de animaciones
  useEffect(() => {
    const injectAnimationCSS = () => {
      if (!document.getElementById('game-animations')) {
        const style = document.createElement('style');
        style.id = 'game-animations';
        style.textContent = `
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
            20%, 40%, 60%, 80% { transform: translateX(10px); }
          }
          
          @keyframes floatUp {
            0% { opacity: 1; transform: translateY(0) scale(1); }
            100% { opacity: 0; transform: translateY(-100px) scale(1.2); }
          }
          
          @keyframes particleExplode {
            0% { opacity: 1; transform: translate(0, 0) scale(1); }
            100% { opacity: 0; transform: translate(var(--dx), var(--dy)) scale(0); }
          }
          
          @keyframes bobbing {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-5px); }
          }
          
          @keyframes pulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.7; transform: scale(1.05); }
          }
          
          @keyframes highlight {
            0%, 100% { box-shadow: 0 0 0 rgba(252, 117, 0, 0); }
            50% { box-shadow: 0 0 20px rgba(252, 117, 0, 0.8); }
          }
        `;
        document.head.appendChild(style);
      }
    };
    
    injectAnimationCSS();
  }, []);

  // Cargar la configuración del nivel
  useEffect(() => {
    const config = getNivelConfig('cognados', dificultad, nivel);
    if (config) {
      const shuffledSelectables = shuffleArray(config.selectables);
      
      setLevelConfig({
        ...config,
        selectables: shuffledSelectables
      });
      setRemainingTime(config.tiempoMaximo);
      
      if (user) {
        const userId = user.id;
        localStorage.setItem(`progress_cognados_${dificultad}_${userId}`, JSON.stringify({
          gameType: 'cognados',
          difficulty: dificultad,
          level: nivel,
          score: 200,
          timestamp: new Date().toISOString()
        }));
      }
    }
  }, [dificultad, nivel, user]);

  // Sistema de cola de audio para evitar solapamientos
  const playAudioWithQueue = async (audioPath, callback = null) => {
    if (!audioPath || isPlayingAudio) {
      console.log('Audio bloqueado - ya se está reproduciendo otro');
      return;
    }

    setIsPlayingAudio(true);
    
    try {
      // Detener audio actual si existe
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
        currentAudioRef.current.currentTime = 0;
      }

      // Crear nuevo audio
      const audio = new Audio(audioPath);
      currentAudioRef.current = audio;
      
      // Configurar volumen
      audio.volume = levelConfig?.audioSettings?.masterVolume || 0.8;
      
      // Obtener duración del audio
      const duration = await getAudioDuration(audioPath);
      
      console.log(`Reproduciendo audio: ${audioPath} (duración: ${duration}ms)`);
      
      // Reproducir audio
      await audio.play();
      
      // Configurar timeout para liberar el lock
      audioTimeoutRef.current = setTimeout(() => {
        setIsPlayingAudio(false);
        if (callback) callback();
        console.log('Audio terminado, liberando lock');
      }, duration + 100); // Agregar 100ms de buffer
      
    } catch (error) {
      console.error('Error reproduciendo audio:', error);
      setIsPlayingAudio(false);
    }
  };

  // Función para reproducir audio del indicador (cocodrilo)
  const playIndicatorAudio = async (indicatorId) => {
    if (!levelConfig) return;
    
    const indicator = levelConfig.indicators.find(ind => ind.id === indicatorId);
    if (!indicator) return;
    
    console.log('Click en cocodrilo');
    
    if (isTraining) {
      setAudioPlayed(prev => prev + 1);
      await playAudioWithQueue(indicator.audio);
    } else {
      // MODO JUEGO: Comparar con el último selector seleccionado
      if (lastSelectedSelector) {
        console.log('Comparando último selector con cocodrilo');
        await compareAudios(lastSelectedSelector, indicator);
      } else {
        // Solo reproducir sonido del cocodrilo si no hay nada que comparar
        await playAudioWithQueue(indicator.audio);
      }
    }
  };

  // Función para manejar selección de selector (pez)
  const handleSelectorSelection = async (selector) => {
    if (isTraining) return;
    
    console.log('Click en selector:', selector.id);
    
    // Destacar el selector seleccionado
    setHighlightedSelector(selector.id);
    setTimeout(() => setHighlightedSelector(null), 2000);
    
    // Marcar como último seleccionado
    setLastSelectedSelector(selector);
    
    // Reproducir audio del selector
    await playAudioWithQueue(selector.audio);
  };

  // Función para comparar audios y evaluar respuesta
  const compareAudios = async (selector, indicator) => {
    console.log('Comparando selector:', selector.id, 'con indicador:', indicator.id);
    
    // Reproducir primero el sonido del selector, luego el del cocodrilo
    await playAudioWithQueue(selector.audio, async () => {
      // Pequeña pausa entre sonidos
      setTimeout(async () => {
        await playAudioWithQueue(indicator.audio, () => {
          // Después de reproducir ambos sonidos, evaluar
          evaluateComparison(selector);
        });
      }, 300);
    });
  };

  // Función para evaluar la comparación
  const evaluateComparison = (selector) => {
    console.log('Evaluando comparación para selector:', selector.id, 'isCorrect:', selector.isCorrect);
    
    const scoringConfig = selector.scoring || { pointsOnCorrect: 10, pointsOnIncorrect: -10 };
    
    if (selector.isCorrect) {
      // ACIERTO
      setScore(prev => prev + scoringConfig.pointsOnCorrect);
      setCorrectSelections(prev => prev + 1);
      setComparedSelectors(prev => [...prev, selector.id]); // Marcar como comparado y correcto
      
      // Efectos visuales para acierto
      showFloatingText('¡Correcto! +10 monedas', '#4CAF50', 1500);
      createParticleEffect(300, 300, '#4CAF50', 8);
      
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 1500);
      
    } else {
      // ERROR - NO marcar como comparado, permitir reintento
      setScore(prev => prev + scoringConfig.pointsOnIncorrect);
      
      // Efectos visuales para error
      showFloatingText('Incorrecto -10 monedas', '#ff6b6b', 1500);
      createParticleEffect(300, 300, '#ff6b6b', 6);
    }
    
    setTotalSelections(prev => prev + 1);
    setLastSelectedSelector(null); // Limpiar selección
    
    // Verificar si se completó el nivel
    if (levelConfig && correctSelections + 1 === levelConfig.totalCorrect) {
      setTimeout(() => evaluateLevel(), 2000);
    }
  };

  // Funciones auxiliares para efectos visuales
  const showFloatingText = (message, color, duration) => {
    const floatingText = document.createElement('div');
    floatingText.textContent = message;
    floatingText.style.cssText = `
      position: fixed;
      left: 50%;
      top: 30%;
      transform: translateX(-50%);
      color: ${color};
      font-size: 24px;
      font-weight: bold;
      pointer-events: none;
      z-index: 1000;
      animation: floatUp ${duration}ms ease-out forwards;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
    `;
    
    document.body.appendChild(floatingText);
    
    setTimeout(() => {
      if (floatingText.parentNode) {
        floatingText.parentNode.removeChild(floatingText);
      }
    }, duration);
  };

  const createParticleEffect = (x, y, color, count = 10) => {
    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div');
      particle.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        width: 6px;
        height: 6px;
        background: ${color};
        border-radius: 50%;
        pointer-events: none;
        z-index: 999;
        animation: particleExplode 0.8s ease-out forwards;
      `;
      
      const angle = (Math.PI * 2 * i) / count;
      const velocity = 50 + Math.random() * 30;
      particle.style.setProperty('--dx', Math.cos(angle) * velocity + 'px');
      particle.style.setProperty('--dy', Math.sin(angle) * velocity + 'px');
      
      document.body.appendChild(particle);
      
      setTimeout(() => {
        if (particle.parentNode) {
          particle.parentNode.removeChild(particle);
        }
      }, 800);
    }
  };

  // Configurar temporizador
  useEffect(() => {
    let timer;
    if (!isTraining && levelConfig) {
      timer = setInterval(() => {
        setRemainingTime(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            evaluateLevel();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isTraining, levelConfig]);

  // Resto de funciones (saveProgress, evaluateLevel, etc.) permanecen igual...
  const saveProgress = () => {
    if (user) {
      const userId = user.id;
      const progress = {
        gameType: 'cognados',
        difficulty: dificultad,
        level: nivel,
        score: score,
        timestamp: new Date().toISOString()
      };
      
      localStorage.setItem(`progress_cognados_${dificultad}_${userId}`, JSON.stringify(progress));
    }
  };

  const evaluateLevel = () => {
    if (!levelConfig) return;
    
    const successRate = totalSelections > 0 ? (correctSelections / totalSelections) * 100 : 0;
    saveProgress();
    
    if (successRate >= 80) {
      const currentLevel = parseInt(nivel);
      const maxLevels = dificultad === 'facil' ? 10 : 5;
      
      if (currentLevel < maxLevels) {
        navigate(`/nivel/cognados/${dificultad}/${currentLevel + 1}`);
      } else {
        alert("¡Felicidades! Has completado todos los niveles de esta dificultad.");
        navigate('/seleccion-mundo');
      }
    } else {
      alert("No has alcanzado el mínimo del 80% de aciertos. Volverás al primer nivel.");
      navigate(`/nivel/cognados/${dificultad}/1`);
    }
  };

  const goToSurvey = () => {
    saveProgress();
    navigate('/encuesta', { 
      state: { 
        gameType: 'cognados', 
        difficulty: dificultad, 
        level: nivel,
        score: score
      } 
    });
  };

  const goToNextLevel = () => {
    saveProgress();
    const currentLevel = parseInt(nivel);
    const maxLevels = dificultad === 'facil' ? 10 : 5;
    
    if (currentLevel < maxLevels) {
      navigate(`/nivel/cognados/${dificultad}/${currentLevel + 1}`);
    } else {
      navigate('/seleccion-mundo');
    }
  };

  if (!levelConfig) {
    return (
      <LoadingContainer>
        <LoadingText>Cargando nivel...</LoadingText>
      </LoadingContainer>
    );
  }

  return (
    <>
      <LevelInfo>
        <LevelBadge>
          MUNDO: COGNADO<br />
          NIVEL: {dificultad.toUpperCase()}
        </LevelBadge>
      </LevelInfo>
      
      <GameContainer>
        <IslandContainer>
          {levelConfig.indicators.map((indicator) => (
            <Indicator 
              key={indicator.id}
              onClick={() => playIndicatorAudio(indicator.id)}
              disabled={isPlayingAudio}
            >
              <img src={indicator.image} alt="Indicador" />
            </Indicator>
          ))}
        </IslandContainer>
        
        <SelectablesContainer>
          {levelConfig.selectables.map((selector) => (
            <Selectable 
              key={selector.id}
              selected={comparedSelectors.includes(selector.id)}
              highlighted={highlightedSelector === selector.id}
              lastSelected={lastSelectedSelector?.id === selector.id}
              onClick={() => handleSelectorSelection(selector)}
              disabled={isPlayingAudio}
            >
              <img src={selector.image} alt="Selector" />
              {/* Indicador visual de estado */}
              {comparedSelectors.includes(selector.id) && (
                <StatusIndicator>✓</StatusIndicator>
              )}
              {lastSelectedSelector?.id === selector.id && !comparedSelectors.includes(selector.id) && (
                <StatusIndicator style={{backgroundColor: '#fc7500'}}>?</StatusIndicator>
              )}
            </Selectable>
          ))}
        </SelectablesContainer>
        
        <ScoreContainer>
          <img src={coinImage} alt="Moneda" />
          <ScoreText>{score}</ScoreText>
        </ScoreContainer>
        
        <NavigationButtons>
          <Button onClick={goToNextLevel}>Siguiente nivel</Button>
          <Button onClick={goToSurvey}>Ir a encuesta</Button>
        </NavigationButtons>
        
        {!isTraining && (
          <TimeContainer>
            <TimeText>
              {Math.floor(remainingTime / 60)}:{(remainingTime % 60).toString().padStart(2, '0')}
            </TimeText>
          </TimeContainer>
        )}

        {/* Información del último selector seleccionado */}
        {!isTraining && lastSelectedSelector && (
          <InstructionPanel>
            <InstructionText>
              🎵 Selector seleccionado. Ahora haz clic en el 🐊 cocodrilo para comparar los sonidos
            </InstructionText>
          </InstructionPanel>
        )}
        
        {isTraining && (
          <TrainingOverlay>
            <TrainingText>
              🐊 Presiona el cocodrilo 10 veces para entrenarte
              <TrainingCounter>{audioPlayed}/10</TrainingCounter>
              <div style={{ 
                fontSize: '16px', 
                marginTop: '15px', 
                color: '#FFD700',
                animation: 'pulse 2s infinite'
              }}>
                ⬆️ Haz click en el cocodrilo de arriba ⬆️
              </div>
            </TrainingText>
            
            {audioPlayed >= 10 && (
              <StartButton onClick={() => setIsTraining(false)}>
                ¡COMENZAR JUEGO!
              </StartButton>
            )}
          </TrainingOverlay>
        )}
        
        {showSuccessMessage && (
          <SuccessMessage>
            <SuccessText>¡Correcto! +10 monedas</SuccessText>
          </SuccessMessage>
        )}
      </GameContainer>
    </>
  );
};

// Styled Components actualizados
const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #0a0a2a;
`;

const LoadingText = styled.p`
  color: white;
  font-size: 24px;
`;

const LevelInfo = styled.div`
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 10;
`;

const LevelBadge = styled.div`
  background-color: rgba(20, 20, 60, 0.8);
  color: white;
  padding: 10px 15px;
  border-radius: 15px;
  font-size: 14px;
  font-weight: bold;
  text-align: center;
  line-height: 1.3;
`;

const GameContainer = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  background-color: #3498db;
`;

const IslandContainer = styled.div`
  width: 400px;
  height: 250px;
  margin-top: 10%;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url('/images/island.png');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  z-index: 150;
`;

const Indicator = styled.div`
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: transform 0.2s;
  z-index: 200;
  position: relative;
  opacity: ${props => props.disabled ? 0.7 : 1};
  
  &:hover {
    transform: ${props => props.disabled ? 'scale(1)' : 'scale(1.1)'};
  }
  
  img {
    width: 80px;
    height: auto;
    filter: drop-shadow(0 5px 15px rgba(0, 0, 0, 0.3));
  }
`;

const SelectablesContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 30px;
  margin-top: 50px;
  width: 80%;
  max-width: 800px;
`;

const Selectable = styled.div`
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.3s ease;
  opacity: ${props => props.selected ? 0.8 : (props.disabled ? 0.6 : 1)};
  transform: ${props => props.selected ? 'scale(0.9)' : 'scale(1)'};
  position: relative;
  text-align: center;
  border: 3px solid ${props => 
    props.selected ? '#4CAF50' : 
    props.lastSelected ? '#fc7500' : 
    'transparent'
  };
  border-radius: 15px;
  padding: 15px;
  background: ${props => 
    props.highlighted ? 'rgba(252, 117, 0, 0.2)' : 
    'rgba(255, 255, 255, 0.1)'
  };
  animation: ${props => props.highlighted ? 'highlight 1s ease-in-out' : 'none'};
  
  &:hover {
    transform: ${props => 
      props.disabled ? 'scale(1)' : 
      props.selected ? 'scale(0.9)' : 'scale(1.05)'
    };
    box-shadow: ${props => 
      props.disabled ? 'none' : '0 8px 25px rgba(0,0,0,0.3)'
    };
  }
  
  img {
    width: 60px;
    height: auto;
    transition: all 0.2s ease;
    filter: ${props => props.selected ? 'grayscale(0.3)' : 'none'};
  }
`;

const StatusIndicator = styled.div`
  position: absolute;
  top: -5px;
  right: -5px;
  width: 25px;
  height: 25px;
  border-radius: 50%;
  background-color: #4CAF50;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: bold;
  box-shadow: 0 2px 8px rgba(0,0,0,0.3);
`;

const InstructionPanel = styled.div`
  position: absolute;
  bottom: 100px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(252, 117, 0, 0.9);
  color: white;
  padding: 15px 25px;
  border-radius: 25px;
  font-size: 16px;
  font-weight: bold;
  text-align: center;
  box-shadow: 0 8px 25px rgba(0,0,0,0.3);
  animation: pulse 2s infinite;
  z-index: 150;
`;

const InstructionText = styled.div`
  margin: 0;
`;

const ScoreContainer = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  align-items: center;
  background-color: rgba(20, 20, 60, 0.7);
  padding: 8px 15px;
  border-radius: 20px;
  
  img {
    width: 30px;
    height: 30px;
    margin-right: 10px;
  }
`;

const ScoreText = styled.span`
  color: white;
  font-size: 18px;
  font-weight: bold;
`;

const TimeContainer = styled.div`
  position: absolute;
  top: 70px;
  right: 20px;
  background-color: rgba(20, 20, 60, 0.7);
  padding: 8px 15px;
  border-radius: 20px;
`;

const TimeText = styled.span`
  color: white;
  font-size: 18px;
  font-weight: bold;
`;

const NavigationButtons = styled.div`
  position: absolute;
  bottom: 20px;
  right: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Button = styled.button`
  background-color: rgba(147, 68, 134, 0.8);
  color: white;
  border: none;
  border-radius: 15px;
  padding: 10px 15px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: rgba(147, 68, 134, 1);
  }
`;

const TrainingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 100;
  pointer-events: none;
`;

const TrainingText = styled.div`
  background-color: rgba(20, 20, 60, 0.95);
  color: white;
  padding: 30px;
  border-radius: 20px;
  font-size: 22px;
  margin-bottom: 30px;
  text-align: center;
  pointer-events: auto;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  border: 3px solid #fc7500;
`;

const TrainingCounter = styled.div`
  font-size: 28px;
  font-weight: bold;
  margin-top: 15px;
  color: #fc7500;
`;

const StartButton = styled.button`
  background: linear-gradient(135deg, #fc7500, #ff9500);
  color: white;
  border: none;
  border-radius: 20px;
  padding: 20px 40px;
  font-size: 24px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  pointer-events: auto;
  box-shadow: 0 8px 25px rgba(252, 117, 0, 0.4);
  text-transform: uppercase;
  letter-spacing: 1px;
  
  &:hover {
    background: linear-gradient(135deg, #ff9500, #fc7500);
    transform: scale(1.05);
    box-shadow: 0 12px 35px rgba(252, 117, 0, 0.6);
  }
  
  &:active {
    transform: scale(0.98);
  }
`;

const SuccessMessage = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(40, 167, 69, 0.9);
  padding: 15px 30px;
  border-radius: 15px;
  animation: fadeInOut 1.5s ease-in-out;
  z-index: 1000;
  
  @keyframes fadeInOut {
    0% { opacity: 0; }
    25% { opacity: 1; }
    75% { opacity: 1; }
    100% { opacity: 0; }
  }
`;

const SuccessText = styled.div`
  color: white;
  font-size: 22px;
  font-weight: bold;
`;

export default NivelCognados;