//src/Game/levels/NivelCognadosMedio.jsx
import React, { useState, useEffect, useContext, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { AuthContext } from '../../context/AuthContext';
import { getNivelConfigMedio } from '../data/nivelesConfigMedio';
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
const NivelCognadoMedio = () => {
  // Context and Routing
  const { nivel } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Refs
  const currentAudioRef = useRef(null);
  const audioTimeoutRef = useRef(null);
  const instructionsTimeoutRef = useRef(null);
  const [levelConfig, setLevelConfig] = useState(null);
  const previousLevelRef = useRef(nivel);

  const [user, setUser] = useState(null);
  
  useEffect(() => {
    const currentNinoStr = localStorage.getItem('currentNino');
    if (currentNinoStr) {
      try {
        const ninoData = JSON.parse(currentNinoStr);
        setUser(ninoData);
      } catch (error) {
        navigate('/ninos-list');
      }
    } else {
      navigate('/ninos-list');
    }
  }, [navigate]);

  useEffect(() => {
    const navigationKey = `authorized_navigation_cognados_medio_${nivel}`;
    const isAuthorized = sessionStorage.getItem(navigationKey);
    
    // Si el nivel cambió desde el anterior render
    if (previousLevelRef.current && previousLevelRef.current !== nivel) {
      if (!isAuthorized) {
        // Limpiar progreso del nivel actual para forzar reinicio
        if (user) {
          const userId = user.id;
          localStorage.removeItem(`progress_cognados_medio_${userId}`);
          localStorage.removeItem(`completed_levels_cognados_medio_${userId}`);
        }
        // Recargar la página para reiniciar completamente el nivel
        window.location.reload();
        return;
      } else {
        // Limpiar la autorización después de usarla
        sessionStorage.removeItem(navigationKey);
      }
    }
    
    // PRIMERA CARGA: Verificar autorización SIEMPRE
    if (!previousLevelRef.current) {
      // Si NO hay autorización, es navegación directa no permitida
      if (!isAuthorized) {
        // Redirigir a selección de mundos en lugar de recargar
        navigate('/seleccion-mundo');
        return;
      } else {
        // Limpiar la autorización después de usarla (una sola vez)
        sessionStorage.removeItem(navigationKey);
      }
    }
    
    previousLevelRef.current = nivel;
  }, [nivel, user, navigate]);

  const loadProgressFromDatabase = async () => {
    if (!user) return null;
    
    try {
      const ninoService = (await import('../../api/ninoService')).default;
      const response = await ninoService.getProgresoEspecifico(user.id, 'cognados', 'medio');
      
      if (response.tiene_progreso && response.data) {
        
        const userId = user.id;
        localStorage.setItem(`lastGameType_${userId}`, 'cognados');
        localStorage.setItem(`lastDifficulty_${userId}`, 'medio');
        localStorage.setItem(`lastLevel_${userId}`, String(response.data.current_level));
        localStorage.setItem(`accumulatedScore_${userId}`, String(response.data.accumulated_score));
        
        return response.data;
      }
    } catch (error) {
    }
    
    return null;
  };

  // FUNCIONES DE PROGRESO Y PUNTAJE MEJORADAS
  const saveCompletedLevelProgress = async (completedLevel, finalScore) => {
    if (user) {
      const userId = user.id;
      
      const generalProgress = {
        gameType: 'cognados',
        difficulty: 'medio',
        level: completedLevel,
        score: finalScore,
        accumulatedScore: finalScore,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem(`progress_cognados_medio_${userId}`, JSON.stringify(generalProgress));
      
      // TAMBIÉN GUARDAR EN CLAVES GENÉRICAS PARA SaveProgressButton y validación
      localStorage.setItem(`lastGameType_${userId}`, 'cognados');
      localStorage.setItem(`lastDifficulty_${userId}`, 'medio');
      localStorage.setItem(`lastLevel_${userId}`, String(completedLevel));
      localStorage.setItem(`accumulatedScore_${userId}`, String(finalScore));
      
      
      try {
        const ninoService = (await import('../../api/ninoService')).default;
        await ninoService.saveProgresoEspecifico(userId, {
          game_type: 'cognados',
          difficulty: 'medio',
          current_level: completedLevel,
          accumulated_score: finalScore
        });
      } catch (error) {
      }
      
      const completedLevelsKey = `completed_levels_cognados_medio_${userId}`;
      let completedLevels = {};
      
      try {
        const existingData = localStorage.getItem(completedLevelsKey);
        if (existingData) {
          completedLevels = JSON.parse(existingData);
        }
      } catch (error) {
        completedLevels = {};
      }
      
      completedLevels[completedLevel] = {
        finalScore: finalScore,
        timestamp: new Date().toISOString()
      };
      
      localStorage.setItem(completedLevelsKey, JSON.stringify(completedLevels));
    }
  };

  const getCorrectInitialScore = (currentLevel) => {
    if (currentLevel === '1') {
      return 200;
    }
    
    if (user) {
      const userId = user.id;
      const completedLevelsKey = `completed_levels_cognados_medio_${userId}`;
      
      try {
        const completedLevels = localStorage.getItem(completedLevelsKey);
        if (completedLevels) {
          const levelsData = JSON.parse(completedLevels);
          const previousLevel = (parseInt(currentLevel) - 1).toString();
          
          if (levelsData[previousLevel]) {
            return levelsData[previousLevel].finalScore;
          }
        }
      } catch (error) {
      }
      
      const savedProgress = localStorage.getItem(`progress_cognados_medio_${userId}`);
      if (savedProgress) {
        const progress = JSON.parse(savedProgress);
        return progress.accumulatedScore || 200;
      }
    }
    
    return 200;
  };

  // FUNCIÓN PARA RESETEAR TODOS LOS ESTADOS
  const resetAllStates = () => {
    const initialScore = getCorrectInitialScore(nivel);
    setScore(initialScore);
    
    setCorrectSelections(0);
    setTotalSelections(0);
    setIsTraining(true);
    setTrainingClicks({ indicator1: 0, indicator2: 0 });
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
    setCurrentActiveIndicator(null);
    setSelectedSelectorForComparison(null);
    if (levelConfig) {
      setRemainingTime(levelConfig.tiempoMaximo);
    }
  };

  // Game State - Inicialización mejorada
  const [score, setScore] = useState(() => {
    if (nivel === '1') {
      return 200;
    }
    return getCorrectInitialScore(nivel);
  });
  
  const [correctSelections, setCorrectSelections] = useState(0);
  const [totalSelections, setTotalSelections] = useState(0);
  const [remainingTime, setRemainingTime] = useState(0);
  const [isTraining, setIsTraining] = useState(true);
  const [trainingClicks, setTrainingClicks] = useState({ indicator1: 0, indicator2: 0 });

  // Audio Comparison System - MODIFICADO para modo medio
  const [lastSelectedSelector, setLastSelectedSelector] = useState(null);
  const [currentActiveIndicator, setCurrentActiveIndicator] = useState(null);
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
  const [isPlayingSuccessAudio, setIsPlayingSuccessAudio] = useState(false);

  // Audio helper functions
  const getVictoryAudio = () => "/sounds/feedback/victory.mp3";
  const getDefeatAudio = () => "/sounds/feedback/defeat.mp3";
  const getTimeoutRestartAudio = () => "/sounds/feedback/repeticion.mp3";
  const getScoreRestartAudio = () => "/sounds/feedback/repeticion.mp3";
  const getSuccessAudio = () => levelConfig?.successAudio || '/sounds/cognados/facil/succes/success.mp3';
  const [selectedSelectorForComparison, setSelectedSelectorForComparison] = useState(null);

  // Navigation Functions - MEJORADAS
  const closeEndGameAlert = () => {
    
    if (endGameType === 'success') {
      setShowEndGameAlert(false);
      const currentLevel = parseInt(nivel);
      const maxLevels = 5; // Modo medio tiene 5 niveles
      
      if (currentLevel < maxLevels) {
        const nextLevel = currentLevel + 1;
        sessionStorage.setItem(`authorized_navigation_cognados_medio_${nextLevel}`, 'true');
        navigate(`/nivel/cognados/medio/${nextLevel}`);
      } else {
        navigate('/seleccion-mundo');
      }
    } else {
      
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
        currentAudioRef.current.currentTime = 0;
        currentAudioRef.current = null;
      }
      
      if (audioTimeoutRef.current) {
        clearTimeout(audioTimeoutRef.current);
        audioTimeoutRef.current = null;
      }
      
      if (instructionsTimeoutRef.current) {
        clearTimeout(instructionsTimeoutRef.current);
        instructionsTimeoutRef.current = null;
      }
      
      setInstructionsCompleted(false);
      setIsPlayingInstructions(false);
      setShowEndGameAlert(false);
      
      
      resetAllStates();
      
      if (levelConfig) {
        const shuffledSelectables = levelConfig.gameSettings?.shuffleSelectables ? 
          shuffleArray(levelConfig.selectables) : levelConfig.selectables;
        setLevelConfig(prev => ({
          ...prev,
          selectables: shuffledSelectables
        }));
        
        
        instructionsTimeoutRef.current = setTimeout(() => {
          playInitialInstructions();
        }, 500);
      }
    }
  };

  const closeSuccessAlert = () => {
    setShowSuccessAlert(false);
    saveCompletedLevelProgress(nivel, score);
    const currentLevel = parseInt(nivel);
    const maxLevels = 5;
    
    if (currentLevel < maxLevels) {
      const nextLevel = currentLevel + 1;
      sessionStorage.setItem(`authorized_navigation_cognados_medio_${nextLevel}`, 'true');
      navigate(`/nivel/cognados/medio/${nextLevel}`);
    } else {
      // 📊 Último nivel completado - Ir a encuesta
      navigate('/encuesta', { 
        state: { 
          gameType: 'cognados', 
          difficulty: 'medio', 
          level: nivel,
          score: score
        } 
      });
    }
  };

  const restartLevel = () => {
    
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current.currentTime = 0;
      currentAudioRef.current = null;
    }
    
    if (audioTimeoutRef.current) {
      clearTimeout(audioTimeoutRef.current);
      audioTimeoutRef.current = null;
    }
    
    if (instructionsTimeoutRef.current) {
      clearTimeout(instructionsTimeoutRef.current);
      instructionsTimeoutRef.current = null;
    }
    
    setInstructionsCompleted(false);
    setIsPlayingInstructions(false);
    
    
    resetAllStates();
    
    if (levelConfig) {
      const shuffledSelectables = levelConfig.gameSettings?.shuffleSelectables ? 
        shuffleArray(levelConfig.selectables) : levelConfig.selectables;
      setLevelConfig(prev => ({
        ...prev,
        selectables: shuffledSelectables
      }));
      
      
      instructionsTimeoutRef.current = setTimeout(() => {
        playInitialInstructions();
      }, 500);
    }
  };

  // Audio Functions
  const playAudioWithQueue = async (audioPath, callback = null, isSuccessAudio = false) => {
    if (!audioPath || isPlayingAudio) return;

    setIsPlayingAudio(true);

    if (isSuccessAudio) {
      setIsPlayingSuccessAudio(true);
    }
    
    try {
      // Detener y limpiar completamente el audio anterior
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
        currentAudioRef.current.currentTime = 0;
        currentAudioRef.current.src = ''; // Liberar recurso
        currentAudioRef.current.load(); // Resetear elemento audio
        currentAudioRef.current = null;
      }

      // Limpiar timeout anterior
      if (audioTimeoutRef.current) {
        clearTimeout(audioTimeoutRef.current);
        audioTimeoutRef.current = null;
      }

      // Crear nuevo audio
      const audio = new Audio(audioPath);
      currentAudioRef.current = audio;
      const audioSettings = levelConfig?.audioSettings;
      audio.volume = audioSettings?.masterVolume || 0.8;
      
      // Listener para limpiar cuando termina naturalmente
      const handleEnded = () => {
        if (currentAudioRef.current === audio) {
          currentAudioRef.current = null;
        }
      };
      
      audio.addEventListener('ended', handleEnded);
      
      const duration = await getAudioDuration(audioPath);
      
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        await playPromise;
      }
      
      audioTimeoutRef.current = setTimeout(() => {
        audio.removeEventListener('ended', handleEnded);
        
        setIsPlayingAudio(false);
        if (isSuccessAudio) {
          setIsPlayingSuccessAudio(false);
        }

        if (callback && typeof callback === 'function') {
          callback();
        }
      }, duration + 100);
      
    } catch (error) {
      setIsPlayingAudio(false);

      if (isSuccessAudio) {
        setIsPlayingSuccessAudio(false);
      }
      
      if (callback && typeof callback === 'function') {
        callback();
      }
    }
  };

  const playInitialInstructions = async () => {
    
    // Solo prevenir si se está reproduciendo activamente (no si ya completó)
    if (isPlayingInstructions && !instructionsCompleted) {
      return;
    }
    
    setIsPlayingInstructions(true);
    const instructionsAudioPath = `/sounds/cognados/medio/instrucciones/instrucciones${nivel}.mp3`;
    
    try {
      await playAudioWithQueue(instructionsAudioPath, () => {
        setIsPlayingInstructions(false);
        setInstructionsCompleted(true);
      });
    } catch (error) {
      setIsPlayingInstructions(false);
      setInstructionsCompleted(true);
    }
  };

  // FUNCIONES DE JUEGO MODIFICADAS PARA MODO MEDIO
  const playIndicatorAudio = async (indicatorId) => {
    if (!levelConfig || !instructionsCompleted || showEndGameAlert || isPlayingAudio) {
      return;
    }
  
    const indicator = levelConfig.indicators.find(ind => ind.id === indicatorId);
    if (!indicator) return;
    
    if (isTraining) {
      // ENTRENAMIENTO: EXACTAMENTE 5 clicks por cada indicador
      const indicatorKey = `indicator${indicatorId}`;
      const currentClicks = trainingClicks[indicatorKey];
      
      // Si ya tiene 5 clicks, no permitir más
      if (currentClicks >= 5) {
        showFloatingText(`Ya completó sus 5 clicks`, '#ff6b6b', 1500);
        return;
      }
      
      await playAudioWithQueue(indicator.audio, () => {
        setTrainingClicks(prev => {
          const newClicks = { ...prev };
          newClicks[indicatorKey] = prev[indicatorKey] + 1;
          
          
          // Verificar si ambos indicadores tienen exactamente 5 clicks
          if (newClicks.indicator1 === 5 && newClicks.indicator2 === 5) {
            const gameSettings = levelConfig?.gameSettings;
            const pauseDuration = gameSettings?.pauseOnCorrect || 500;
            setTimeout(() => {
              setIsTraining(false);
            }, pauseDuration);
          }
          return newClicks;
        });
      });
    } else {
      // JUEGO: Verificar que primero se haya seleccionado un selector
      
      // Reproducir audio del indicador
      setCurrentActiveIndicator(indicatorId);
      await playAudioWithQueue(indicator.audio, () => {
        // Después de reproducir el audio, evaluar la comparación
        evaluateComparison(selectedSelectorForComparison, indicatorId);
      });
    }
  };

  const handleSelectorSelection = async (selector) => {
    if (isTraining || disabledSelectors.includes(selector.id) || showEndGameAlert) return;
    
    // Siempre permitir escuchar el audio del selector
    setHighlightedSelector(selector.id);
    setTimeout(() => setHighlightedSelector(null), 2000);
    setLastSelectedSelector(selector);
    setSelectedSelectorForComparison(selector); // Marcar como seleccionado para comparación
    
    await playAudioWithQueue(selector.audio);
  };

  const evaluateComparison = (selector, indicatorId) => {
    const scoringConfig = selector.scoring || levelConfig?.baseScoringConfig || { pointsOnCorrect: 10, pointsOnIncorrect: -10 };
    const feedbackConfig = selector.feedback || levelConfig?.baseFeedbackConfig || {
      correctMessage: '¡Correcto! +10 monedas',
      incorrectMessage: 'Incorrecto -10 monedas',
      textDuration: 1500
    };
    
    setDisabledSelectors(prev => [...prev, selector.id]);
    
    const newTotalSelections = totalSelections + 1;
    let newScore = score;
    let newCorrectSelections = correctSelections;
    
    // VERIFICAR SI EL SELECTOR PERTENECE AL INDICADOR SELECCIONADO
    const isCorrectMatch = selector.indicatorId === indicatorId;
    
    if (isCorrectMatch) {
      newScore = score + scoringConfig.pointsOnCorrect;
      newCorrectSelections = correctSelections + 1;
      
      setScore(newScore);
      setCorrectSelections(newCorrectSelections);
      setComparedSelectors(prev => [...prev, selector.id]);
      
      const winCondition = levelConfig?.winCondition || { requiredCorrect: 9, minimumScorePercentage: 0.8 };
      
      if (newCorrectSelections === winCondition.requiredCorrect) {
        checkForNextLevelButton(newTotalSelections, newCorrectSelections, newScore);
        
        const scoreAtStartOfLevel = getCorrectInitialScore(nivel);
        const maxPossiblePoints = winCondition.requiredCorrect * scoringConfig.pointsOnCorrect;
        const requiredScore = scoreAtStartOfLevel + (maxPossiblePoints * winCondition.minimumScorePercentage);
        if (newScore >= requiredScore) {
          setTimeout(() => {
            playAudioWithQueue(getSuccessAudio());
          }, 500);
        }
      } else if (newTotalSelections >= 9) {
        checkForNextLevelButton(newTotalSelections, newCorrectSelections, newScore);
      }
      
      const message = feedbackConfig.correctMessage || '¡Correcto! +10 monedas';
      const textColor = feedbackConfig.textColor || '#4CAF50';
      const duration = feedbackConfig.textDuration || 1500;
      
      showFloatingText(message, textColor, duration);
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), duration);
      playAudioWithQueue(getVictoryAudio());
    } else {
      newScore = score + scoringConfig.pointsOnIncorrect;
      setScore(newScore);
      
      if (newTotalSelections >= 9) {
        checkForNextLevelButton(newTotalSelections, newCorrectSelections, newScore);
      }
      
      const message = feedbackConfig.incorrectMessage || 'Incorrecto -10 monedas';
      const textColor = feedbackConfig.textColor || '#ff6b6b';
      const duration = feedbackConfig.textDuration || 1500;
      
      showFloatingText(message, textColor, duration);
      createParticleEffect(300, 300, textColor, 6);
      playAudioWithQueue(getDefeatAudio());
    }
    
    setTotalSelections(newTotalSelections);
    setLastSelectedSelector(null);
    setCurrentActiveIndicator(null);
    setSelectedSelectorForComparison(null);
  };

  const checkForNextLevelButton = (newTotalSelections, newCorrectSelections, newScore) => { 
    setTimeout(() => {
      const scoreAtStartOfLevel = getCorrectInitialScore(nivel);
      
      const winCondition = levelConfig?.winCondition || { requiredCorrect: 9, minimumScorePercentage: 0.8 };
      const scoringConfig = levelConfig?.baseScoringConfig || { pointsOnCorrect: 10 };
      
      const maxPossiblePoints = winCondition.requiredCorrect * scoringConfig.pointsOnCorrect;
      const requiredAdditionalPoints = maxPossiblePoints * winCondition.minimumScorePercentage;
      const requiredFinalScore = scoreAtStartOfLevel + requiredAdditionalPoints;
      
      if (newCorrectSelections === winCondition.requiredCorrect && newScore >= requiredFinalScore) {
        setShowSuccessAlert(true);

        setTimeout(() => {
          const customSuccessAudio = getSuccessAudio();
          playAudioWithQueue(customSuccessAudio, null, true);
        }, 1000);

      } else if (newCorrectSelections === winCondition.requiredCorrect && newScore < requiredFinalScore) {
        setTimeout(() => {
          evaluateLevel(newCorrectSelections, newScore); 
        }, 500);

      } else if (newTotalSelections >= 9) {
        setTimeout(() => {
          evaluateLevel(newCorrectSelections, newScore); 
        }, 500);
      }
    }, 1000);
  };

  // Game Flow Functions - MEJORADAS
  const saveProgress = () => {
    if (user) {
      const userId = user.id;
      const progress = {
        gameType: 'cognados',
        difficulty: 'medio',
        level: nivel,
        score: score,
        accumulatedScore: score, 
        timestamp: new Date().toISOString()
      };
      localStorage.setItem(`progress_cognados_medio_${userId}`, JSON.stringify(progress));
    }
  };

  const evaluateLevel = (currentCorrectSelections = correctSelections, currentScore = score) => {
    if (!levelConfig) return;
    
    const scoreAtStartOfLevel = getCorrectInitialScore(nivel);
    
    const winCondition = levelConfig?.winCondition || { requiredCorrect: 9, minimumScorePercentage: 0.8 };
    const scoringConfig = levelConfig?.baseScoringConfig || { pointsOnCorrect: 10 };
    
    const maxPossiblePoints = winCondition.requiredCorrect * scoringConfig.pointsOnCorrect;
    const requiredAdditionalPoints = maxPossiblePoints * winCondition.minimumScorePercentage;
    const requiredFinalScore = scoreAtStartOfLevel + requiredAdditionalPoints;
    
    if (currentCorrectSelections === winCondition.requiredCorrect && currentScore >= requiredFinalScore) {
      saveCompletedLevelProgress(nivel, currentScore);
      
      const currentLevel = parseInt(nivel);
      const maxLevels = 5;
      
      if (currentLevel < maxLevels) {
        setEndGameMessage(`¡Excelente! Has completado el nivel ${nivel} con ${currentCorrectSelections} aciertos y ${currentScore} monedas. ¡Pasas al siguiente nivel!`);
      } else {
        setEndGameMessage(`¡Felicidades! Has completado todos los niveles de la dificultad medio. ¡Eres increíble!`);
      }
      setEndGameType('success');
      setShowEndGameAlert(true);

      setTimeout(() => {
        const customSuccessAudio = getSuccessAudio();
        playAudioWithQueue(customSuccessAudio, null, true);
      }, 500);

    } else {
      // En lugar de redirigir, simplemente reiniciar el nivel
      setEndGameMessage(`Nivel no completado. El nivel se reiniciará para que puedas intentarlo de nuevo.`);
      setEndGameType('score_failure');
      setShowEndGameAlert(true);
      
      setTimeout(() => {
        playAudioWithQueue(getScoreRestartAudio());
      }, 500);
    }
  };

  const handleTimeOut = () => {
    setEndGameMessage(`¡Se acabó el tiempo! El nivel se reiniciará.`);
    setEndGameType('timeout');
    setShowEndGameAlert(true);
    
    setTimeout(() => {
      playAudioWithQueue(getTimeoutRestartAudio());
    }, 500);
  };

  const goToSurvey = async () => {
    if (showEndGameAlert || showSuccessAlert) return;
    
    if (user) {
      const userId = user.id;
      
      const generalProgress = {
        gameType: 'cognados',
        difficulty: 'medio',
        level: nivel,
        score: score,
        accumulatedScore: score,
        timestamp: new Date().toISOString()
      };
      
      // Guardar en localStorage
      localStorage.setItem(`progress_cognados_medio_${userId}`, JSON.stringify(generalProgress));
      
      try {
        const ninoService = (await import('../../api/ninoService')).default;
        await ninoService.saveProgresoEspecifico(userId, {
          game_type: 'cognados',
          difficulty: 'medio',
          current_level: nivel,
          accumulated_score: score
        });
      } catch (error) {
      }
    }
    
    navigate('/encuesta', { 
      state: { 
        gameType: 'cognados', 
        difficulty: 'medio', 
        level: nivel,
        score: score
      } 
    });
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

  useEffect(() => {
    const cargarProgreso = async () => {
      if (user && nivel) {
        const progressFromDB = await loadProgressFromDatabase();
        if (progressFromDB && progressFromDB.accumulated_score) {
          setScore(progressFromDB.accumulated_score);
        }
      }
    };
    
    cargarProgreso();
  }, []); // Solo ejecutar al montar el componente

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

  // USEEFFECT PRINCIPAL - MEJORADO
  useEffect(() => {
    const config = getNivelConfigMedio(nivel);
    if (config) {
      const selectables = config.gameSettings?.shuffleSelectables ? 
        shuffleArray(config.selectables) : config.selectables;
      
      setLevelConfig({
        ...config,
        selectables: selectables
      });
      
      setTimeout(() => {
        setComparedSelectors([]);
        setDisabledSelectors([]);
        setLastSelectedSelector(null);
        setHighlightedSelector(null);
        setCurrentActiveIndicator(null);
      }, 100);
      
      setRemainingTime(config.tiempoMaximo);
      
      if (user) {
        const userId = user.id;
        
        if (nivel === '1') {
          // Limpiar progreso al empezar el nivel 1
          localStorage.removeItem(`progress_cognados_medio_${userId}`);
          localStorage.removeItem(`completed_levels_cognados_medio_${userId}`);
          
          const freshProgress = {
            gameType: 'cognados',
            difficulty: 'medio',
            level: nivel,
            score: 200,
            accumulatedScore: 200,
            timestamp: new Date().toISOString()
          };
          localStorage.setItem(`progress_cognados_medio_${userId}`, JSON.stringify(freshProgress));
          
          setScore(200);
          setCorrectSelections(0);
          setTotalSelections(0);
          setIsTraining(true); 
          setTrainingClicks({ indicator1: 0, indicator2: 0 });
          setShowSuccessMessage(false);
          setLastSelectedSelector(null);
          setIsPlayingAudio(false);
          setComparedSelectors([]);
          setDisabledSelectors([]);
          setHighlightedSelector(null);
          setShowSuccessAlert(false);
          setInstructionsCompleted(false); 
          // NO resetear isPlayingInstructions aquí - dejarlo en su estado inicial
          setShowEndGameAlert(false);
          setEndGameMessage('');
          setEndGameType('');
          setRemainingTime(config.tiempoMaximo);
          setCurrentActiveIndicator(null);
          
        } else {
          // Para niveles > 1, obtener el puntaje correcto del nivel anterior
          const correctScore = getCorrectInitialScore(nivel);
          setScore(correctScore);
          setCorrectSelections(0);
          setTotalSelections(0);
          setIsTraining(true); 
          setTrainingClicks({ indicator1: 0, indicator2: 0 });
          setShowSuccessMessage(false);
          setLastSelectedSelector(null);
          setIsPlayingAudio(false);
          setComparedSelectors([]);
          setDisabledSelectors([]);
          setHighlightedSelector(null);
          setShowSuccessAlert(false);
          setInstructionsCompleted(false);
          // NO resetear isPlayingInstructions aquí - dejarlo en su estado inicial
          setShowEndGameAlert(false);
          setEndGameMessage('');
          setEndGameType('');
          setRemainingTime(config.tiempoMaximo);
          setCurrentActiveIndicator(null);
        }
      }
    }
    
    // Reproducir instrucciones después de resetear estados
    setTimeout(() => {
      playInitialInstructions();
    }, 500);
    
    return () => {
      // Limpiar estado
      setComparedSelectors([]);
      setDisabledSelectors([]);
      setLastSelectedSelector(null);
      setHighlightedSelector(null);
      setCurrentActiveIndicator(null);
      setSelectedSelectorForComparison(null);
      
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
        currentAudioRef.current.currentTime = 0;
        currentAudioRef.current.src = '';
        currentAudioRef.current.load();
        currentAudioRef.current = null;
      }
      
      if (audioTimeoutRef.current) {
        clearTimeout(audioTimeoutRef.current);
        audioTimeoutRef.current = null;
      }
      
      // Resetear flags de audio
      setIsPlayingAudio(false);
      setIsPlayingInstructions(false);
    };
  }, [nivel, user, navigate]);

  // Timer effect
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

  // Cleanup: Detener todos los audios al desmontar el componente
  useEffect(() => {
    return () => {
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
        currentAudioRef.current.currentTime = 0;
        currentAudioRef.current.src = '';
        currentAudioRef.current = null;
      }
      if (audioTimeoutRef.current) {
        clearTimeout(audioTimeoutRef.current);
        audioTimeoutRef.current = null;
      }
    };
  }, []);

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
           Cargando nivel medio... 
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

  const getTotalTrainingClicks = () => {
    return trainingClicks.indicator1 + trainingClicks.indicator2;
  };

  const getRequiredTrainingClicks = () => {
    return levelConfig?.trainingConfig?.totalClicks || 10;
  };

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
            
            <NavigationButtons>
              <Button onClick={goToSurvey} disabled={showEndGameAlert || showSuccessAlert}>
                Ir a encuesta
              </Button>
            </NavigationButtons>
          </TopRightPanel>

          {/* INDICADORES DOBLES PARA MODO MEDIO */}
          <IndicatorsContainer>
            {levelConfig.indicators.map((indicator) => (
              <Indicator 
                key={indicator.id}
                onClick={() => playIndicatorAudio(indicator.id)}
                disabled={isPlayingAudio || !instructionsCompleted || showEndGameAlert}
                clickable={instructionsCompleted && !showEndGameAlert}
                active={currentActiveIndicator === indicator.id}
              >
                <img src={indicator.image} alt={`Indicador ${indicator.id}`} />
                {isTraining && (
                  <TrainingClicksIndicator>
                    {trainingClicks[`indicator${indicator.id}`]} / 5
                  </TrainingClicksIndicator>
                )}
              </Indicator>
            ))}
          </IndicatorsContainer>

          {/* SELECTABLES CONTAINER - 9 elementos en modo medio */}
          <SelectablesContainer gameMode="medio">
            {/* Primera fila: 4 elementos (arriba) */}
            <div>
              {levelConfig.selectables.slice(0, 4).map((selector, index) => (
                <Selectable 
                  key={`${selector.id}-${nivel}-${index}`}
                  index={index}
                  selected={comparedSelectors.includes(selector.id)}
                  highlighted={highlightedSelector === selector.id}
                  lastSelected={lastSelectedSelector?.id === selector.id && !disabledSelectors.includes(selector.id)}
                  disabled={isTraining || disabledSelectors.includes(selector.id) || showEndGameAlert}
                  onClick={() => handleSelectorSelection(selector)}
                  gameMode="medio"
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
            </div>
            
            {/* Segunda fila: 5 elementos (abajo) */}
            <div>
              {levelConfig.selectables.slice(4, 9).map((selector, index) => (
                <Selectable 
                  key={`${selector.id}-${nivel}-${index + 4}`}
                  index={index + 4}
                  selected={comparedSelectors.includes(selector.id)}
                  highlighted={highlightedSelector === selector.id}
                  lastSelected={lastSelectedSelector?.id === selector.id && !disabledSelectors.includes(selector.id)}
                  disabled={isTraining || disabledSelectors.includes(selector.id) || showEndGameAlert}
                  onClick={() => handleSelectorSelection(selector)}
                  gameMode="medio"
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
            </div>
          </SelectablesContainer>
          
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
                HAZ CLICK EN CADA IMAGEN
                <TrainingCounter>{getTotalTrainingClicks()}/{getRequiredTrainingClicks()}</TrainingCounter>
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
                {parseInt(nivel) === 5 
                  ? '¡FELICIDADES! Has completado todos los niveles. Es momento de responder la encuesta.'
                  : '¡EXCELENTE TRABAJO! Estás listo para el siguiente desafío.'}
              </SuccessAlertText>
              <SuccessAlertButton 
                disabled={isPlayingSuccessAudio}
                onClick={isPlayingSuccessAudio ? undefined : closeSuccessAlert}
              >
                {parseInt(nivel) === 5 ? 'Ir a Encuesta' : 'Siguiente Nivel'}
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

// NUEVO: Container para los dos indicadores
const IndicatorsContainer = styled.div`
  width: 100%;
  height: 200px;
  margin-top: 200px;
  margin-bottom: 5px; 
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  z-index: 1;
  padding: 0 10%;
`;

const Indicator = styled.div`
  cursor: ${props => 
    props.disabled ? 'not-allowed' : 
    props.clickable ? 'pointer' : 'not-allowed'
  };
  transition: all 0.3s ease;
  z-index: 1000;
  position: relative;
  opacity: ${props => 
    !props.clickable ? 0.5 :
    props.disabled ? 0.7 : 1
  };
  
  ${props => props.active && `
    filter: drop-shadow(0 0 25px rgba(252, 117, 0, 0.8));
    transform: scale(1.1);
  `}
  
  &:hover {
    transform: ${props => 
      props.disabled || !props.clickable ? 'scale(1)' : 'scale(1.15) translateY(-5px)'
    };
    filter: ${props => 
      props.disabled || !props.clickable ? 'none' : 
      props.active ? 'drop-shadow(0 0 25px rgba(252, 117, 0, 0.8))' :
      'drop-shadow(0 8px 20px rgba(252, 117, 0, 0.4))'
    };
  }
  
  img {
    width: 350px;
    height: auto;
    filter: drop-shadow(0 5px 15px rgba(0, 0, 0, 0.4));
  }
  
  @media (max-width: 1024px) {
    img {
      width: 300px;
    }
  }
  
  @media (max-width: 768px) {
    img {
      width: 250px;
    }
  }
  
  @media (max-width: 480px) {
    img {
      width: 180px;
    }
  }
`;

const TrainingClicksIndicator = styled.div`
  position: absolute;
  top: -15px;
  right: -15px;
  background: rgba(252, 117, 0, 0.9);
  color: white;
  padding: 8px 15px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: bold;
  box-shadow: 0 3px 10px rgba(0,0,0,0.3);
  border: 2px solid white;
`;

const SelectablesContainer = styled.div`
  display: ${props => props.gameMode === 'medio' ? 'flex' : 'grid'};
  flex-direction: ${props => props.gameMode === 'medio' ? 'column' : 'row'};
  align-items: center;
  justify-content: center;
  grid-template-columns: ${props => props.gameMode === 'medio' ? 'none' : 'repeat(8, 1fr)'};
  grid-template-rows: ${props => props.gameMode === 'medio' ? 'none' : 'repeat(2, 1fr)'};
  gap: ${props => props.gameMode === 'medio' ? '60px' : '50px'};
  margin-top: 130px;
  margin-bottom: 40px;
  width: 90%;
  max-width: ${props => props.gameMode === 'medio' ? '1000px' : '5000px'};
  padding: 20px;
  
  ${props => props.gameMode === 'medio' && `
    > div:first-child {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 50px;
      width: 100%;
      padding-left: 70px;
    }
    
    > div:last-child {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 50px;
      width: 100%;
    }
  `}
  
  @media (max-width: 1024px) {
    margin-top: 100px;
    gap: ${props => props.gameMode === 'medio' ? '50px' : '40px'};
    
    ${props => props.gameMode === 'medio' && `
      > div:first-child {
        gap: 40px;
        padding-left: 50px;
      }
      
      > div:last-child {
        gap: 40px;
      }
    `}
  }
  
  @media (max-width: 768px) {
    width: 95%;
    margin-top: 80px;
    margin-bottom: 30px;
    gap: ${props => props.gameMode === 'medio' ? '40px' : '30px'};
    padding: 15px;
    
    ${props => props.gameMode === 'medio' && `
      > div:first-child {
        gap: 30px;
        padding-left: 30px;
      }
      
      > div:last-child {
        gap: 30px;
      }
    `}
  }
  
  @media (max-width: 480px) {
    width: 98%;
    margin-top: 60px;
    margin-bottom: 20px;
    gap: ${props => props.gameMode === 'medio' ? '30px' : '20px'};
    padding: 10px;
    
    ${props => props.gameMode === 'medio' && `
      > div:first-child {
        gap: 20px;
        padding-left: 20px;
      }
      
      > div:last-child {
        gap: 20px;
      }
    `}
  }
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
    width: ${props => props.gameMode === 'medio' ? '120px' : '100px'};
    height: auto;
    transition: all 0.2s ease;
    filter: ${props => 
      props.disabled ? 'grayscale(1)' :
      props.selected ? 'grayscale(0.3)' : 'none'
    };
  }
  
  @media (max-width: 1024px) {
    img {
      width: ${props => props.gameMode === 'medio' ? '110px' : '90px'};
    }
  }
  
  @media (max-width: 768px) {
    img {
      width: ${props => props.gameMode === 'medio' ? '100px' : '80px'};
    }
  }
  
  @media (max-width: 480px) {
    img {
      width: ${props => props.gameMode === 'medio' ? '80px' : '65px'};
    }
  }
`;

const NavigationButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 10px;
`;

const Button = styled.button`
  background: linear-gradient(135deg, rgba(147, 68, 134, 0.9), rgba(147, 68, 134, 1));
  color: white;
  border: none;
  border-radius: 15px;
  padding: 10px 16px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  border: 2px solid rgba(255, 255, 255, 0.2);
  width: 100%;
  opacity: ${props => props.disabled ? 0.5 : 1};
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  font-family: 'Manrope', sans-serif;
  
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
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

const InstructionsText = styled.div`
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
  z-index: 50;
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

const TrainingMediumInstructions = styled.div`
  font-size: 18px;
  margin: 15px 0;
  color: #FFD700;
  line-height: 1.4;
`;

const TrainingCounter = styled.div`
  font-size: 28px;
  font-weight: bold;
  margin-top: 15px;
  color: #fc7500;
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
  opacity: ${props => props.disabled ? 0.5 : 1};
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(76, 175, 80, 0.6);
    background: linear-gradient(135deg, #45a049, #4CAF50);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

export default NivelCognadoMedio;