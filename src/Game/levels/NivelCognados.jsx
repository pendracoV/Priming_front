import React, { useState, useEffect, useContext, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { AuthContext } from '../../context/AuthContext';
import { getNivelConfig } from '../data/nivelesConfig';
import coinImage from '../../../public/images/coin.png';
import GameBackground from '../../components/GameBackground';
import { GlobalStyle } from '../../styles/styles';

// Utility Functions
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const getAudioDuration = (audioPath) => {
  return new Promise((resolve) => {
    if (!audioPath) {
      resolve(0);
      return;
    }
    
    const audio = new Audio(audioPath);
    audio.addEventListener('loadedmetadata', () => {
      resolve(audio.duration * 1000);
    });
    audio.addEventListener('error', () => {
      resolve(1000);
    });
  });
};

// Main Component
const NivelCognados = () => {
  // Context and Routing
  const { user } = useContext(AuthContext);
  const { dificultad, nivel } = useParams();
  const navigate = useNavigate();

  // Refs
  const currentAudioRef = useRef(null);
  const audioTimeoutRef = useRef(null);
  const [levelConfig, setLevelConfig] = useState(null); 

  // ⭐ FUNCIÓN PARA RESETEAR TODOS LOS ESTADOS
  const resetAllStates = () => {
    setScore(nivel === '1' ? 200 : score); 
    setCorrectSelections(0);
    setTotalSelections(0);
    setIsTraining(true);
    setAudioPlayed(0);
    setShowSuccessMessage(false);
    setLastSelectedSelector(null);
    setIsPlayingAudio(false);
    setComparedSelectors([]);
    setDisabledSelectors([]);
    setHighlightedSelector(null);
    setShowSuccessAlert(false);
    setInstructionsCompleted(false);
    setIsPlayingInstructions(false);
    setShowEndGameAlert(false);
    setEndGameMessage('');
    setEndGameType('');
    setRemainingTime(0); // Se actualizará con la configuración del nivel
  };

  // Game State
  const [score, setScore] = useState(() => {
    
    if (dificultad === 'facil' && nivel === '1') {
      return 200;
    }
    
    if (user) {
      const savedProgress = localStorage.getItem(`progress_cognados_${dificultad}_${user.id}`);
      if (savedProgress) {
        const progress = JSON.parse(savedProgress);
        return progress.accumulatedScore || 200;
      }
    }
    return 200;
  });
  const [correctSelections, setCorrectSelections] = useState(0);
  const [totalSelections, setTotalSelections] = useState(0);
  const [remainingTime, setRemainingTime] = useState(0);
  const [isTraining, setIsTraining] = useState(true);
  const [audioPlayed, setAudioPlayed] = useState(0);

  // Audio Comparison System
  const [lastSelectedSelector, setLastSelectedSelector] = useState(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [comparedSelectors, setComparedSelectors] = useState([]);
  const [disabledSelectors, setDisabledSelectors] = useState([]);
  const [highlightedSelector, setHighlightedSelector] = useState(null);

  // UI State
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [isPlayingInstructions, setIsPlayingInstructions] = useState(false);
  const [instructionsCompleted, setInstructionsCompleted] = useState(false);
  const [showEndGameAlert, setShowEndGameAlert] = useState(false);
  const [endGameMessage, setEndGameMessage] = useState('');
  const [endGameType, setEndGameType] = useState('');

  // Constants
  const VICTORY_AUDIO = "/sounds/feedback/victory.mp3";
  const DEFEAT_AUDIO = "/sounds/feedback/defeat.mp3";
  const TIMEOUT_RESTART_AUDIO = "/sounds/feedback/repeticion.mp3"; 
  const SCORE_RESTART_AUDIO = "/sounds/feedback/repeticion.mp3";
  const SUCCESS_LEVEL_AUDIO = "/sounds/feedback/exito.mp3"; 

  // ⭐ FUNCIÓN MODIFICADA PARA REINICIO COMPLETO
  const closeEndGameAlert = () => {
    setShowEndGameAlert(false);
    
    if (endGameType === 'success') {
      const currentLevel = parseInt(nivel);
      const maxLevels = dificultad === 'facil' ? 10 : 5;
      
      if (currentLevel < maxLevels) {
        navigate(`/nivel/cognados/${dificultad}/${currentLevel + 1}`);
      } else {
        navigate('/seleccion-mundo');
      }
    } else {
      if (dificultad === 'facil') {
        // ⭐ LIMPIAR COMPLETAMENTE EL PROGRESO
        if (user) {
          localStorage.removeItem(`progress_cognados_${dificultad}_${user.id}`);
        }
        
        // ⭐ RESETEAR ESTADOS ANTES DE NAVEGAR
        resetAllStates();
        
        // ⭐ NAVEGAR CON FORZAR REMOUNT
        navigate('/seleccion-mundo'); // Primero ir a otra ruta
        setTimeout(() => {
          navigate(`/nivel/cognados/${dificultad}/1`); // Luego regresar al nivel 1
        }, 100);
      } else {
        restartLevel();
      }
    }
  };

  const closeSuccessAlert = () => {
    setShowSuccessAlert(false);
    saveProgress();
    const currentLevel = parseInt(nivel);
    const maxLevels = dificultad === 'facil' ? 10 : 5;
    
    if (currentLevel < maxLevels) {
      navigate(`/nivel/cognados/${dificultad}/${currentLevel + 1}`);
    } else {
      navigate('/seleccion-mundo');
    }
  };

  const restartLevel = () => {
    // ⭐ USAR LA FUNCIÓN DE RESETEO
    resetAllStates();
    
    // Clean up audio
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current.currentTime = 0;
    }
    
    if (audioTimeoutRef.current) {
      clearTimeout(audioTimeoutRef.current);
    }
    
    // Reset level configuration
    if (levelConfig) {
      const shuffledSelectables = shuffleArray(levelConfig.selectables);
      setLevelConfig(prev => ({
        ...prev,
        selectables: shuffledSelectables
      }));
      setRemainingTime(levelConfig.tiempoMaximo);
      
      setTimeout(() => {
        playInitialInstructions();
      }, 100);
    }
  };

  // Audio Functions
  const playAudioWithQueue = async (audioPath, callback = null) => {
    if (!audioPath || isPlayingAudio) return;
  
    setIsPlayingAudio(true);
    
    try {
      
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
        currentAudioRef.current.currentTime = 0;
        currentAudioRef.current.removeEventListener('ended', () => {});
        currentAudioRef.current.removeEventListener('error', () => {});
      }
  
      if (audioTimeoutRef.current) {
        clearTimeout(audioTimeoutRef.current);
      }
  
      const audio = new Audio(audioPath);
      currentAudioRef.current = audio;
      audio.volume = levelConfig?.audioSettings?.masterVolume || 0.8;
      
      const duration = await getAudioDuration(audioPath);
      
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        await playPromise;
      }
      
      audioTimeoutRef.current = setTimeout(() => {
        setIsPlayingAudio(false);
        if (callback && typeof callback === 'function') {
          callback();
        }
      }, duration + 100);
      
    } catch (error) {
      console.error('Error reproducing audio:', error);
      setIsPlayingAudio(false);
      if (callback && typeof callback === 'function') {
        callback();
      }
    }
  };

  const playInitialInstructions = async () => {
    setIsPlayingInstructions(true);
    const instructionsAudioPath = `/sounds/instrucciones/instrucciones${nivel}.mp3`;
    
    try {
      await playAudioWithQueue(instructionsAudioPath, () => {
        setIsPlayingInstructions(false);
        setInstructionsCompleted(true);

      });
    } catch (error) {
      console.error('Error reproducing instructions:', error);
      setIsPlayingInstructions(false);
      setInstructionsCompleted(true);
      
    }
  };

  // Game Action Functions
  const playIndicatorAudio = async (indicatorId) => {
    if (!levelConfig || !instructionsCompleted || showEndGameAlert || isPlayingAudio) return;
  
    const indicator = levelConfig.indicators.find(ind => ind.id === indicatorId);
    if (!indicator) return;
    
    if (isTraining) {
      await playAudioWithQueue(indicator.audio, () => {
        setAudioPlayed(prev => {
          const newCount = prev + 1;
          if (newCount >= 10) {
            setTimeout(() => {
              setIsTraining(false);
            }, 500);
          }
          return newCount;
        });
      });
    } else {
      if (lastSelectedSelector) {
        await compareAudios(lastSelectedSelector, indicator);
      } else {
        await playAudioWithQueue(indicator.audio);
      }
    }
  };

  const handleSelectorSelection = async (selector) => {
    if (isTraining || disabledSelectors.includes(selector.id) || showEndGameAlert) return;
    
    setHighlightedSelector(selector.id);
    setTimeout(() => setHighlightedSelector(null), 2000);
    setLastSelectedSelector(selector);
    await playAudioWithQueue(selector.audio);
  };

  const compareAudios = async (selector, indicator) => {
    await playAudioWithQueue(indicator.audio, () => {
      evaluateComparison(selector);
    });
  };

  const evaluateComparison = (selector) => {
    const scoringConfig = selector.scoring || { pointsOnCorrect: 10, pointsOnIncorrect: -10 };
    setDisabledSelectors(prev => [...prev, selector.id]);
    
    const newTotalSelections = totalSelections + 1;
    let newScore = score;
    let newCorrectSelections = correctSelections;
    
    if (selector.isCorrect) {
      newScore = score + scoringConfig.pointsOnCorrect;
      newCorrectSelections = correctSelections + 1;
      
      setScore(newScore);
      setCorrectSelections(newCorrectSelections);
      setComparedSelectors(prev => [...prev, selector.id]);
      
      if (newCorrectSelections === 8 || newTotalSelections >= 16) {
        checkForNextLevelButton(newTotalSelections, newCorrectSelections, newScore);
        
        const requiredScore = 200 + (8 * 10 * 0.8);
        if (newCorrectSelections === 8 && newScore >= requiredScore) {
          setTimeout(() => {
            playAudioWithQueue(SUCCESS_LEVEL_AUDIO);
          }, 500);
        }
      }
      
      showFloatingText('¡Correcto! +10 monedas', '#4CAF50', 1500)
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 1500);
      playAudioWithQueue(VICTORY_AUDIO);
    } else {
      newScore = score + scoringConfig.pointsOnIncorrect;
      setScore(newScore);
      
      if (newTotalSelections >= 16) {
        checkForNextLevelButton(newTotalSelections, newCorrectSelections, newScore);
      }
      
      showFloatingText('Incorrecto -10 monedas', '#ff6b6b', 1500);
      createParticleEffect(300, 300, '#ff6b6b', 6);
      playAudioWithQueue(DEFEAT_AUDIO); 
    }
    
    setTotalSelections(newTotalSelections);
    setLastSelectedSelector(null);
  };

  const checkForNextLevelButton = (newTotalSelections, newCorrectSelections, newScore) => { 
    setTimeout(() => {
      const requiredScore = 200 + (8 * 10 * 0.8);
      
      if (newCorrectSelections === 8 && newScore >= requiredScore) {
        setShowSuccessAlert(true);
      }
      else if (newTotalSelections >= 16) {
        setTimeout(() => {
          evaluateLevel(newCorrectSelections, newScore); 
        }, 500);
      }
    }, 1000);
  };

  // Game Flow Functions
  const saveProgress = () => {
    if (user) {
      const userId = user.id;
      const progress = {
        gameType: 'cognados',
        difficulty: dificultad,
        level: nivel,
        score: score,
        accumulatedScore: score, 
        timestamp: new Date().toISOString()
      };
      localStorage.setItem(`progress_cognados_${dificultad}_${userId}`, JSON.stringify(progress));
    }
  };

  const evaluateLevel = (currentCorrectSelections = correctSelections, currentScore = score) => {
    if (!levelConfig) return;
    
    const requiredScore = 200 + (8 * 10 * 0.8);
    saveProgress();
    
    if (currentCorrectSelections === 8 && currentScore >= requiredScore) {
      const currentLevel = parseInt(nivel);
      const maxLevels = dificultad === 'facil' ? 10 : 5;
      
      if (currentLevel < maxLevels) {
        setEndGameMessage(`¡Excelente! Has completado el nivel ${nivel} con ${currentCorrectSelections} aciertos y ${currentScore} monedas. ¡Pasas al siguiente nivel!`);
      } else {
        setEndGameMessage(`¡Felicidades! Has completado todos los niveles de la dificultad ${dificultad}. ¡Eres increíble!`);
      }
      setEndGameType('success');
      setShowEndGameAlert(true);
    } else {
      let failureReason = '';
      if (currentCorrectSelections < 8) {
        failureReason = `Solo completaste ${currentCorrectSelections} de 8 elementos correctos de los 16 totales.`;
      }
      if (currentScore < requiredScore) {
        if (failureReason) failureReason += ' ';
        failureReason += `Tu puntaje fue ${currentScore} monedas (necesitas mínimo ${requiredScore} monedas para avanzar).`;
      }
      
      setEndGameMessage(`Nivel no completado. El nivel se reiniciará para que puedas intentarlo de nuevo.`);
      setEndGameType('score_failure');
      setShowEndGameAlert(true);
      
      setTimeout(() => {
        playAudioWithQueue(SCORE_RESTART_AUDIO);
      }, 500);
    }
  };

  const handleTimeOut = () => {
    const requiredScore = 200 + (8 * 10 * 0.8);
    setEndGameMessage(`¡Se acabó el tiempo! El nivel se reiniciará.`);
    setEndGameType('timeout');
    setShowEndGameAlert(true);
    
    setTimeout(() => {
      playAudioWithQueue(TIMEOUT_RESTART_AUDIO);
    }, 500);
  };

  // Navigation Functions
  const goToSurvey = () => {
    if (showEndGameAlert || showSuccessAlert) return;
    
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
    if (showEndGameAlert) return;
    
    saveProgress();
    const currentLevel = parseInt(nivel);
    const maxLevels = dificultad === 'facil' ? 10 : 5;
    
    if (currentLevel < maxLevels) {
      navigate(`/nivel/cognados/${dificultad}/${currentLevel + 1}`);
    } else {
      navigate('/seleccion-mundo');
    }
  };

  // Visual Effects
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

  // Effects
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
          @keyframes fadeIn {
            0% { opacity: 0; transform: scale(0.8); }
            100% { opacity: 1; transform: scale(1); }
          }
        `;
        document.head.appendChild(style);
      }
    };
    
    injectAnimationCSS();
  }, []);

  // ⭐ USEEFFECT PRINCIPAL MODIFICADO PARA REINICIO COMPLETO
  useEffect(() => {
    const config = getNivelConfig('cognados', dificultad, nivel);
    if (config) {
      const shuffledSelectables = shuffleArray(config.selectables);
      
      setLevelConfig({
        ...config,
        selectables: shuffledSelectables
      });
      

      setTimeout(() => {
        setComparedSelectors([]);
        setDisabledSelectors([]);
        setLastSelectedSelector(null);
        setHighlightedSelector(null);
      }, 100);
      
      setRemainingTime(config.tiempoMaximo);
      

      if (dificultad === 'facil') {
        if (user) {
          const userId = user.id;
          

          if (nivel === '1') {
            // Limpiar progreso y resetear estados
            localStorage.removeItem(`progress_cognados_${dificultad}_${userId}`);
            
            // CREAR PROGRESO FRESCO
            const freshProgress = {
              gameType: 'cognados',
              difficulty: dificultad,
              level: nivel,
              score: 200,
              accumulatedScore: 200,
              timestamp: new Date().toISOString()
            };
            localStorage.setItem(`progress_cognados_${dificultad}_${userId}`, JSON.stringify(freshProgress));
            
            // RESETEAR TODOS LOS ESTADOS
            resetAllStates();
            setRemainingTime(config.tiempoMaximo); // Restaurar tiempo después del reset
          } else {
            // Para otros niveles, mantener progreso normal
            const savedProgress = localStorage.getItem(`progress_cognados_${dificultad}_${userId}`);
            const progress = savedProgress ? JSON.parse(savedProgress) : {
              gameType: 'cognados',
              difficulty: dificultad,
              level: nivel,
              score: 200,
              accumulatedScore: 200,
              timestamp: new Date().toISOString()
            };
            localStorage.setItem(`progress_cognados_${dificultad}_${userId}`, JSON.stringify(progress));
          }
        }


      } else {
        // ⭐ PARA OTROS NIVELES, MANTENER PUNTAJE ACUMULADO PERO RESETEAR ESTADOS DEL JUEGO
        const savedProgress = localStorage.getItem(`progress_cognados_${dificultad}_${userId}`);
        if (savedProgress) {
          const progress = JSON.parse(savedProgress);
          // Mantener puntaje acumulado pero resetear estados de juego
          const currentScore = progress.accumulatedScore || 200;
          
          // ⭐ RESETEAR COMPLETAMENTE TODOS LOS ESTADOS DE JUEGO EXCEPTO EL SCORE
          setCorrectSelections(0);
          setTotalSelections(0);
          setComparedSelectors([]);
          setDisabledSelectors([]);
          setLastSelectedSelector(null);
          setHighlightedSelector(null);
          setIsTraining(true);
          setAudioPlayed(0);
          setShowSuccessMessage(false);
          setIsPlayingAudio(false);
          setShowSuccessAlert(false);
          setInstructionsCompleted(false);
          setIsPlayingInstructions(false);
          setShowEndGameAlert(false);
          setEndGameMessage('');
          setEndGameType('');
          
          // Mantener el score acumulado
          setScore(currentScore);
        } else {
          // Si no hay progreso guardado, crear uno con puntaje base
          const progress = {
            gameType: 'cognados',
            difficulty: dificultad,
            level: nivel,
            score: 200,
            accumulatedScore: 200,
            timestamp: new Date().toISOString()
          };
          localStorage.setItem(`progress_cognados_${dificultad}_${userId}`, JSON.stringify(progress));
          
          resetAllStates();
        }
      }
    }
    
    setTimeout(() => {
      playInitialInstructions();
    }, 500);
    

  return () => {
    setComparedSelectors([]);
    setDisabledSelectors([]);
    setLastSelectedSelector(null);
    setHighlightedSelector(null);
  };
}, [dificultad, nivel, user]);

  useEffect(() => {
    let timer;
    if (!isTraining && levelConfig && instructionsCompleted && !showEndGameAlert) {
      timer = setInterval(() => {
        setRemainingTime(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            handleTimeOut();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isTraining, levelConfig, instructionsCompleted, showEndGameAlert]);

  // Render
  if (!levelConfig) {
    return (
      <div style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        margin: 0,
        padding: 0,
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        background: 'linear-gradient(135deg,rgb(22, 48, 131) 0%,rgb(173, 180, 248) 100%)',
        fontFamily: 'Comic Sans MS, cursive',
        zIndex: 9999
      }}>
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

        <div style={{
          color: '#ffffff',
          fontSize: '24px',
          fontWeight: 'bold',
          textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
          animation: 'pulse 2s infinite'
        }}>
           Cargando nivel... 
        </div>

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
  }


  return (
    <>
    <GlobalStyle />
  <GameBackground backgroundImage={levelConfig.backgroundImage}>  
        <GameContainer>
          <TopRightPanel>
            <ScoreContainer>
              <img src={coinImage} alt="Moneda" />
              <ScoreText>{score}</ScoreText>
            </ScoreContainer>
            
            {!isTraining && instructionsCompleted && (
              <TimeContainer>
                <TimeText>
                  {Math.floor(remainingTime / 60)}:{(remainingTime % 60).toString().padStart(2, '0')}
                </TimeText>
              </TimeContainer>
            )}
          </TopRightPanel>
  
          <IslandContainer>
            {levelConfig.indicators.map((indicator) => (
              <Indicator 
                key={indicator.id}
                onClick={() => playIndicatorAudio(indicator.id)}
                disabled={isPlayingAudio || !instructionsCompleted || showEndGameAlert}
                clickable={instructionsCompleted && !showEndGameAlert}
              >
                <img src={indicator.image} alt="Indicador" />
              </Indicator>
            ))}
          </IslandContainer>
  
          <SelectablesContainer>
            {levelConfig.selectables.map((selector, index) => (
              <Selectable 
              key={`${selector.id}-${nivel}-${index}`}
                index={index}
                selected={comparedSelectors.includes(selector.id)}
                highlighted={highlightedSelector === selector.id}
                lastSelected={lastSelectedSelector?.id === selector.id && !disabledSelectors.includes(selector.id)}
                disabled={isTraining || disabledSelectors.includes(selector.id) || showEndGameAlert}
                onClick={() => handleSelectorSelection(selector)}
              >
                <img src={selector.image} alt="Selector" />
                
                {comparedSelectors.includes(selector.id) && (
                  <StatusIndicator>✓</StatusIndicator>
                )}
                {disabledSelectors.includes(selector.id) && !comparedSelectors.includes(selector.id) && (
                  <StatusIndicator style={{backgroundColor: '#ff6b6b'}}>✗</StatusIndicator>
                )}
                {lastSelectedSelector?.id === selector.id && !disabledSelectors.includes(selector.id) && (
                  <StatusIndicator style={{backgroundColor: '#fc7500'}}>🎵</StatusIndicator>
                )}
              </Selectable>
            ))}
          </SelectablesContainer>
          
          <NavigationButtons>
            <Button onClick={goToSurvey} disabled={showEndGameAlert || showSuccessAlert}>Ir a encuesta</Button>
          </NavigationButtons>
          
          {isPlayingInstructions && (
            <InstructionsOverlay>
              <InstructionsText>
                🎧 Escuchando instrucciones...
                <div style={{ 
                  fontSize: '16px', 
                  marginTop: '15px', 
                  color: '#FFD700',
                  animation: 'pulse 2s infinite'
                }}>
                </div>
              </InstructionsText>
            </InstructionsOverlay>
          )}
          
          {isTraining && instructionsCompleted && !showEndGameAlert && (
            <TrainingOverlay>
              <TrainingText>
                HAZ CLICK EN LA IMAGEN DE ARRIBA
                <TrainingCounter>{audioPlayed}/10</TrainingCounter>
                <div style={{ 
                  fontSize: '16px', 
                  marginTop: '15px', 
                  color: '#FFD700',
                  animation: 'pulse 2s infinite'
                }}>
                </div>
              </TrainingText>
            </TrainingOverlay>
          )}
          

          
        </GameContainer>

        {showEndGameAlert && (
          <EndGameAlertOverlay>
            <EndGameAlertBox>
              <EndGameAlertText>
                {endGameMessage}
              </EndGameAlertText>
              <EndGameAlertButton onClick={closeEndGameAlert}>
                {endGameType === 'success' ? 'Continuar' : 'Reintentar'}
              </EndGameAlertButton>
            </EndGameAlertBox>
          </EndGameAlertOverlay>
        )}

        {showSuccessAlert && (
          <SuccessAlertOverlay>
            <SuccessAlertBox>
              <SuccessAlertText>
                ¡EXCELENTE TRABAJO! Estás listo para el siguiente desafío.
              </SuccessAlertText>
              <SuccessAlertButton onClick={closeSuccessAlert}>
                🚀 Siguiente Nivel
              </SuccessAlertButton>
            </SuccessAlertBox>
          </SuccessAlertOverlay>
        )}
      </GameBackground>
    </>
  );
};

// Styled Components
const GameContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
  margin: 0;
  padding: 0;
  z-index: 0;
  font-family: 'Manrope', sans-serif;
`;

const TopRightPanel = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 100;
`;

const ScoreContainer = styled.div`
  display: flex;
  align-items: center;
  background-color: rgba(20, 20, 60, 0.9);
  padding: 12px 20px;
  border-radius: 25px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  border: 2px solid rgba(252, 117, 0, 0.6);
  
  img {
    width: 32px;
    height: 32px;
    margin-right: 12px;
  }
`;

const ScoreText = styled.span`
  color: #FFD700;
  font-size: 20px;
  font-weight: bold;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.7);
  font-family: 'Manrope', sans-serif;
`;

const TimeContainer = styled.div`
  background-color: rgba(20, 20, 60, 0.9);
  padding: 12px 20px;
  border-radius: 25px;
  text-align: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  border: 2px solid rgba(76, 175, 80, 0.6);
`;

const TimeText = styled.span`
  color: #4CAF50;
  font-size: 20px;
  font-weight: bold;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.7);
  font-family: 'Manrope', sans-serif;
`;

const IslandContainer = styled.div`
  width: 100%;
  height: 200px;
  margin-top: 300px;
  margin-bottom: 20px; 
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1;
`;

const Indicator = styled.div`
  cursor: ${props => 
    props.disabled ? 'not-allowed' : 
    props.clickable ? 'pointer' : 'not-allowed'
  };
  transition: all 0.3s ease;
  z-index: 200;
  position: relative;
  opacity: ${props => 
    !props.clickable ? 0.5 :
    props.disabled ? 0.7 : 1
  };
  
  &:hover {
    transform: ${props => 
      props.disabled || !props.clickable ? 'scale(1)' : 'scale(1.15) translateY(-5px)'
    };
    filter: ${props => 
      props.disabled || !props.clickable ? 'none' : 'drop-shadow(0 8px 20px rgba(252, 117, 0, 0.4))'
    };
  }
  
  img {
    width: 500px;
    height: auto;
    filter: drop-shadow(0 5px 15px rgba(0, 0, 0, 0.4));
  }
`;

const SelectablesContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  grid-template-rows: repeat(2, fr);
  gap: 50px;
  margin-top: 60px;
  width: 90%;
  max-width: 5000px;
  min-height: 100px;
  padding: 20px;
  justify-items: center;
  align-items: center;
`;

const Selectable = styled.div`
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.3s ease;
  opacity: ${props => 
    props.disabled ? 0.4 : 
    props.selected ? 0.8 : 1
  };
  transform: ${props => props.selected ? 'scale(0.9)' : 'scale(1)'};
  position: relative;
  text-align: center;
  
  ${props => props.highlighted && `
    filter: drop-shadow(0 0 20px rgba(252, 117, 0, 0.8));
    animation: highlight 1s ease-in-out;
  `}
  
  ${props => props.lastSelected && !props.disabled && `
    filter: drop-shadow(0 0 15px rgba(252, 117, 0, 0.6));
  `}
  
  &:hover {
    transform: ${props => 
      props.disabled ? 'scale(1)' : 
      props.selected ? 'scale(0.9)' : 'scale(1.1) translateY(-3px)'
    };
    filter: ${props => 
      props.disabled ? 'none' : 
      props.highlighted ? 'drop-shadow(0 0 20px rgba(252, 117, 0, 0.8))' :
      'drop-shadow(0 8px 25px rgba(0,0,0,0.3))'
    };
  }
  
  img {
    width: 100px;
    height: auto;
    transition: all 0.2s ease;
    filter: ${props => 
      props.disabled ? 'grayscale(1)' :
      props.selected ? 'grayscale(0.3)' : 'none'
    };
  }
`;

const NavigationButtons = styled.div`
  position: absolute;
  bottom: 30px;
  right: 30px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  z-index: 100;
`;

const Button = styled.button`
  background: linear-gradient(135deg, rgba(147, 68, 134, 0.9), rgba(147, 68, 134, 1));
  color: white;
  border: none;
  border-radius: 20px;
  padding: 12px 20px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  border: 2px solid rgba(255, 255, 255, 0.2);
  min-width: 140px;
  opacity: ${props => props.disabled ? 0.5 : 1};
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  
  &:hover {
    transform: ${props => props.disabled ? 'none' : 'translateY(-2px)'};
    box-shadow: ${props => props.disabled ? '0 4px 15px rgba(0, 0, 0, 0.3)' : '0 6px 20px rgba(147, 68, 134, 0.4)'};
    background: ${props => props.disabled ? 
      'linear-gradient(135deg, rgba(147, 68, 134, 0.9), rgba(147, 68, 134, 1))' : 
      'linear-gradient(135deg, rgba(147, 68, 134, 1), rgba(167, 88, 154, 1))'
    };
  }
  
  &:active {
    transform: ${props => props.disabled ? 'none' : 'translateY(0)'};
  }
`;

const StatusIndicator = styled.div`
  position: absolute;
  top: -8px;
  right: -8px;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background-color: #4CAF50;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: bold;
  box-shadow: 0 3px 10px rgba(0,0,0,0.4);
  border: 2px solid white;
`;



const InstructionsOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 200;
`;

const InstructionsText = styled.div`
  margin-top: 280px;
  background-color: rgba(20, 20, 60, 0.95);
  color: white;
  padding: 40px;
  border-radius: 20px;
  font-size: 24px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  border: 3px solid #fc7500;
  font-family: 'Manrope', sans-serif;
`;

const TrainingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 100;
  pointer-events: none;
`;

const TrainingText = styled.div`
  background-color: rgba(20, 20, 60, 0.95);
  margin-top: 280px;
  color: white;
  padding: 30px;
  border-radius: 20px;
  font-size: 22px;
  text-align: center;
  pointer-events: auto;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  border: 3px solid #fc7500;
  font-family: 'Manrope', sans-serif;
`;

const TrainingCounter = styled.div`
  font-size: 28px;
  font-weight: bold;
  margin-top: 15px;
  color: #fc7500;
  font-family: 'Manrope', sans-serif;
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
  font-family: 'Manrope', sans-serif;
`;

const EndGameAlertOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.85);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 300;
`;

const EndGameAlertBox = styled.div`
  background-color: rgba(20, 20, 60, 0.98);
  color: white;
  padding: 50px;
  border-radius: 25px;
  font-size: 20px;
  text-align: center;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.7);
  border: 4px solid #fc7500;
  max-width: 600px;
  min-width: 400px;
  animation: fadeIn 0.5s ease-in;
`;

const EndGameAlertText = styled.div`
  margin-bottom: 30px;
  line-height: 1.6;
  font-weight: 500;
  font-family: 'Manrope', sans-serif;
`;

const EndGameAlertButton = styled.button`
  background: linear-gradient(135deg, #fc7500, #ff8c00);
  color: white;
  border: none;
  border-radius: 15px;
  padding: 15px 30px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(252, 117, 0, 0.4);
  border: 2px solid rgba(255, 255, 255, 0.2);
  min-width: 120px;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(252, 117, 0, 0.6);
    background: linear-gradient(135deg, #ff8c00, #ffa500);
  }
  
  &:active {
    transform: translateY(0);
  }
`;


const SuccessAlertOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.85);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 300;
`;

const SuccessAlertBox = styled.div`
  background-color: rgba(20, 20, 60, 0.98);
  color: white;
  padding: 50px;
  border-radius: 25px;
  font-size: 20px;
  text-align: center;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.7);
  border: 4px solid #4CAF50;
  max-width: 600px;
  min-width: 400px;
  animation: fadeIn 0.5s ease-in;
`;

const SuccessAlertText = styled.div`
  margin-bottom: 30px;
  line-height: 1.6;
  font-weight: 500;
  font-family: 'Manrope', sans-serif;
`;

const SuccessAlertButton = styled.button`
  background: linear-gradient(135deg, #4CAF50, #45a049);
  color: white;
  border: none;
  border-radius: 15px;
  padding: 15px 30px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(76, 175, 80, 0.4);
  border: 2px solid rgba(255, 255, 255, 0.2);
  min-width: 180px;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(76, 175, 80, 0.6);
    background: linear-gradient(135deg, #45a049, #4CAF50);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

export default NivelCognados;