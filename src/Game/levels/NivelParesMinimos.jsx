import React, { useState, useEffect, useContext, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { AuthContext } from '../../context/AuthContext';
import { getNivelConfigParesMinimos } from '../data/nivelesConfigParesMinimos';
import coinImage from '../../../public/images/coin.png';
import GameBackground from '../../components/GameBackground';
import { GlobalStyle } from '../../styles/styles';

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

const NivelParesMinimos = () => {
  const { dificultad, nivel } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const previousLevelRef = useRef(nivel);

  const currentAudioRef = useRef(null);
  const audioTimeoutRef = useRef(null);
  const instructionsTimeoutRef = useRef(null);
  const [levelConfig, setLevelConfig] = useState(null);
  
  // 🔑 Obtener información del niño actual desde localStorage (NO del AuthContext)
  const [user, setUser] = useState(null);

  // 🔒 PROTECCIÓN DE NAVEGACIÓN DESHABILITADA TEMPORALMENTE
  // useEffect(() => {
  //   const navigationKey = `authorized_navigation_pares_${dificultad}_${nivel}`;
  //   const isAuthorized = sessionStorage.getItem(navigationKey);
  //   
  //   if (previousLevelRef.current && previousLevelRef.current !== nivel) {
  //     if (!isAuthorized) {
  //       console.log('🚨 Navegación manual detectada - Bloqueando');
  //       if (user) {
  //         const userId = user.id;
  //         localStorage.removeItem(`progress_pares-minimos_${dificultad}_${userId}`);
  //         localStorage.removeItem(`completed_levels_pares-minimos_${dificultad}_${userId}`);
  //       }
  //       window.location.reload();
  //       return;
  //     } else {
  //       sessionStorage.removeItem(navigationKey);
  //       previousLevelRef.current = nivel;
  //     }
  //   }
  //   
  //   if (!previousLevelRef.current) {
  //     if (!isAuthorized) {
  //       console.log('🚨 Acceso directo sin autorización - Redirigiendo a selección de mundos');
  //       navigate('/seleccion-mundo');
  //       return;
  //     } else {
  //       sessionStorage.removeItem(navigationKey);
  //       previousLevelRef.current = nivel;
  //     }
  //   }
  // }, [nivel, dificultad, user, navigate]);
  
  useEffect(() => {
    const currentNinoStr = localStorage.getItem('currentNino');
    if (currentNinoStr) {
      try {
        const ninoData = JSON.parse(currentNinoStr);
        setUser(ninoData);
        console.log(`👦 Niño actual cargado: ${ninoData.nombre} (ID: ${ninoData.id})`);
      } catch (error) {
        console.error('Error parseando currentNino:', error);
        navigate('/ninos-list');
      }
    } else {
      console.error('❌ No hay niño en sesión');
      navigate('/ninos-list');
    }
  }, [navigate]); 

  // 📥 Función para cargar progreso desde base de datos
  const loadProgressFromDatabase = async () => {
    if (!user) return null;
    
    try {
      const ninoService = (await import('../../api/ninoService')).default;
      const response = await ninoService.getProgresoEspecifico(user.id, 'pares-minimos', dificultad);
      
      if (response.tiene_progreso && response.data) {
        console.log('📥 Progreso cargado desde base de datos (Pares Mínimos):', response.data);
        
        const userId = user.id;
        localStorage.setItem(`lastGameType_${userId}`, 'pares-minimos');
        localStorage.setItem(`lastDifficulty_${userId}`, dificultad);
        localStorage.setItem(`lastLevel_${userId}`, String(response.data.current_level));
        localStorage.setItem(`accumulatedScore_${userId}`, String(response.data.accumulated_score));
        
        return response.data;
      }
    } catch (error) {
      console.error('❌ Error cargando progreso desde base de datos:', error);
    }
    
    return null;
  };

  const saveCompletedLevelProgress = async (completedLevel, finalScore) => {
    if (user) {
      const userId = user.id;
      
      const generalProgress = {
        gameType: 'pares-minimos',
        difficulty: dificultad,
        level: completedLevel,
        score: finalScore,
        accumulatedScore: finalScore,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem(`progress_pares-minimos_${dificultad}_${userId}`, JSON.stringify(generalProgress));
      
      // TAMBIÉN GUARDAR EN CLAVES GENÉRICAS PARA SaveProgressButton y validación
      // 🔑 IMPORTANTE: Incluir userId para que cada niño tenga su propio progreso
      localStorage.setItem(`lastGameType_${userId}`, 'pares-minimos');
      localStorage.setItem(`lastDifficulty_${userId}`, dificultad);
      localStorage.setItem(`lastLevel_${userId}`, String(completedLevel));
      localStorage.setItem(`accumulatedScore_${userId}`, String(finalScore));
      
      console.log('✅ Progreso guardado en localStorage (Pares Mínimos) - Nivel:', completedLevel, 'Puntaje:', finalScore, 'UserId:', userId);
      
      // 💾 GUARDAR EN BASE DE DATOS
      try {
        const ninoService = (await import('../../api/ninoService')).default;
        await ninoService.saveProgresoEspecifico(userId, {
          game_type: 'pares-minimos',
          difficulty: dificultad,
          current_level: completedLevel,
          accumulated_score: finalScore
        });
        console.log('✅ Progreso guardado en base de datos (Pares Mínimos)');
      } catch (error) {
        console.error('❌ Error guardando progreso en base de datos:', error);
      }
      
      const completedLevelsKey = `completed_levels_pares-minimos_${dificultad}_${userId}`;
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
      const completedLevelsKey = `completed_levels_pares-minimos_${dificultad}_${userId}`;
      
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
        console.error('Error reading completed levels:', error);
      }
      
      const savedProgress = localStorage.getItem(`progress_pares-minimos_${dificultad}_${userId}`);
      if (savedProgress) {
        const progress = JSON.parse(savedProgress);
        return progress.accumulatedScore || 200;
      }
    }
    
    return 200;
  };

  const resetAllStates = () => {
    const initialScore = getCorrectInitialScore(nivel);
    setScore(initialScore);
    
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
    if (levelConfig) {
      setRemainingTime(levelConfig.tiempoMaximo);
    }
  };

  const [score, setScore] = useState(() => {
    if (dificultad === 'facil') {
      return getCorrectInitialScore(nivel);
    }

    if (user) {
      const savedProgress = localStorage.getItem(`progress_pares-minimos_${dificultad}_${user.id}`);
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

  const [lastSelectedSelector, setLastSelectedSelector] = useState(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [comparedSelectors, setComparedSelectors] = useState([]);
  const [disabledSelectors, setDisabledSelectors] = useState([]);
  const [highlightedSelector, setHighlightedSelector] = useState(null);

  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [isPlayingInstructions, setIsPlayingInstructions] = useState(false);
  const [instructionsCompleted, setInstructionsCompleted] = useState(false);
  const [showEndGameAlert, setShowEndGameAlert] = useState(false);
  const [endGameMessage, setEndGameMessage] = useState('');
  const [endGameType, setEndGameType] = useState('');
  const [isPlayingSuccessAudio, setIsPlayingSuccessAudio] = useState(false);

  const getVictoryAudio = () => "/sounds/feedback/victory.mp3";
  const getDefeatAudio = () => "/sounds/feedback/defeat.mp3";
  const getTimeoutRestartAudio = () => "/sounds/feedback/repeticion.mp3";
  const getScoreRestartAudio = () => "/sounds/feedback/repeticion.mp3";
  const getSuccessAudio = () => levelConfig?.successAudio || '/sounds/feedback/success.mp3';

  const closeEndGameAlert = () => {
    console.log('🔄 closeEndGameAlert llamado - NivelParesMinimos');
    
    if (endGameType === 'success') {
      setShowEndGameAlert(false);
      const currentLevel = parseInt(nivel);
      const maxLevels = 10;
      
      if (currentLevel < maxLevels) {
        const nextLevel = currentLevel + 1;
        navigate(`/nivel/pares-minimos/${dificultad}/${nextLevel}`);
      } else {
        navigate('/seleccion-mundo');
      }
    } else {
      console.log('❌ Reinicio por falla');
      
      // 1️⃣ LIMPIAR PRIMERO - Detener cualquier audio y timeout activo
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
      
      // 2️⃣ RESETEAR ESTADOS INMEDIATAMENTE (antes de cualquier timeout)
      setInstructionsCompleted(false);
      setIsPlayingInstructions(false);
      setShowEndGameAlert(false);
      
      console.log('🔧 Estados reseteados');
      
      // 3️⃣ Resetear el juego
      resetAllStates();
      
      // 4️⃣ Mezclar selectables si es necesario
      if (levelConfig) {
        const shuffledSelectables = levelConfig.gameSettings?.shuffleSelectables ? 
          shuffleArray(levelConfig.selectables) : levelConfig.selectables;
        setLevelConfig(prev => ({
          ...prev,
          selectables: shuffledSelectables
        }));
        
        console.log('🔀 Selectables mezclados');
        
        // 5️⃣ UN SOLO TIMEOUT de 500ms para reproducir instrucciones
        instructionsTimeoutRef.current = setTimeout(() => {
          console.log('⏰ Timeout ejecutado, llamando playInitialInstructions');
          playInitialInstructions();
        }, 500);
      }
    }
  };

  const closeSuccessAlert = () => {
    setShowSuccessAlert(false);
    saveCompletedLevelProgress(nivel, score);
    const currentLevel = parseInt(nivel);
    
    // Determinar el máximo de niveles según la dificultad
    let maxLevels;
    if (dificultad === 'facil') {
      maxLevels = 10;
    } else if (dificultad === 'medio' || dificultad === 'dificil') {
      maxLevels = 5;
    }
    
    // Si es el último nivel, ir a la encuesta
    if (currentLevel >= maxLevels) {
      navigate('/encuesta', { 
        state: { 
          fromGame: true,
          gameType: 'pares-minimos',
          difficulty: dificultad,
          finalScore: score,
          completedLevel: nivel
        }
      });
    } else {
      // Si no es el último nivel, ir al siguiente
      const nextLevel = currentLevel + 1;
      navigate(`/nivel/pares-minimos/${dificultad}/${nextLevel}`);
    }
  };

  const restartLevel = () => {
    console.log('🔄 restartLevel llamado - NivelParesMinimos');
    
    // 1️⃣ LIMPIAR PRIMERO - Detener cualquier audio y timeout activo
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
    
    // 2️⃣ RESETEAR ESTADOS INMEDIATAMENTE (antes de cualquier timeout)
    setInstructionsCompleted(false);
    setIsPlayingInstructions(false);
    
    console.log('🔧 Estados reseteados en restartLevel');
    
    // 3️⃣ Resetear el juego
    resetAllStates();
    
    // 4️⃣ Mezclar selectables si es necesario
    if (levelConfig) {
      const shuffledSelectables = levelConfig.gameSettings?.shuffleSelectables ? 
        shuffleArray(levelConfig.selectables) : levelConfig.selectables;
      setLevelConfig(prev => ({
        ...prev,
        selectables: shuffledSelectables
      }));
      
      console.log('🔀 Selectables mezclados en restartLevel');
      
      // 5️⃣ UN SOLO TIMEOUT de 500ms para reproducir instrucciones
      instructionsTimeoutRef.current = setTimeout(() => {
        console.log('⏰ Timeout ejecutado en restartLevel, llamando playInitialInstructions');
        playInitialInstructions();
      }, 500);
    }
  };

  const playAudioWithQueue = async (audioPath, callback = null, isSuccessAudio = false) => {
    if (!audioPath || isPlayingAudio) return;
  
    setIsPlayingAudio(true);

    if (isSuccessAudio) {
      setIsPlayingSuccessAudio(true);
    }
    
    try {
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
  
      const audio = new Audio(audioPath);
      currentAudioRef.current = audio;
      const audioSettings = levelConfig?.audioSettings;
      audio.volume = audioSettings?.masterVolume || 0.8;
      
      const handleEnded = () => {
        console.log('🔊 Audio terminado naturalmente (Pares Mínimos)');
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
      console.error('Error reproducing audio:', error);
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
    console.log('🎵 playInitialInstructions llamado - NivelParesMinimos');
    
    // Solo prevenir si se está reproduciendo activamente
    if (isPlayingInstructions) {
      console.log('🚫 Ya reproduciendo instrucciones');
      return;
    }
    
    // ✅ Usar la ruta de instrucciones del levelConfig
    if (!levelConfig || !levelConfig.instructionsAudio) {
      console.error('❌ No hay configuración de instrucciones disponible');
      setInstructionsCompleted(true);
      return;
    }
    
    console.log('▶️ Iniciando reproducción de instrucciones');
    console.log('📁 Ruta de audio:', levelConfig.instructionsAudio);
    setIsPlayingInstructions(true);
    
    try {
      await playAudioWithQueue(levelConfig.instructionsAudio, () => {
        setIsPlayingInstructions(false);
        setInstructionsCompleted(true);
        console.log('✅ Instrucciones completadas - Pares Mínimos');
      });
    } catch (error) {
      console.error('Error reproducing instructions:', error);
      setIsPlayingInstructions(false);
      setInstructionsCompleted(true);
    }
  };

  const playIndicatorAudio = async (indicatorId) => {
    if (!levelConfig || !instructionsCompleted || showEndGameAlert || isPlayingAudio) {
      console.log('🚫 Audio bloqueado (Pares Mínimos):', { 
        hasConfig: !!levelConfig, 
        instructionsCompleted, 
        showEndGameAlert, 
        isPlayingAudio 
      });
      return;
    }
  
    const indicator = levelConfig.indicators.find(ind => ind.id === indicatorId);
    if (!indicator) return;
    
    if (isTraining) {
      console.log('🎵 Reproduciendo audio de entrenamiento (Pares Mínimos):', indicator.audio);
      await playAudioWithQueue(indicator.audio, () => {
        setAudioPlayed(prev => {
          const newCount = prev + 1;
          const trainingConfig = levelConfig?.trainingConfig;
          const requiredClicks = trainingConfig?.totalClicks || 10;
          
          console.log(`✅ Audio de entrenamiento completado (Pares Mínimos): ${newCount}/${requiredClicks}`);
          
          if (newCount >= requiredClicks) {
            const gameSettings = levelConfig?.gameSettings;
            const pauseDuration = gameSettings?.pauseOnCorrect || 500;
            setTimeout(() => {
              setIsTraining(false);
              console.log('🎯 Entrenamiento completado (Pares Mínimos), iniciando juego');
            }, pauseDuration);
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
    
    if (selector.isCorrect) {
      newScore = score + scoringConfig.pointsOnCorrect;
      newCorrectSelections = correctSelections + 1;
      
      setScore(newScore);
      setCorrectSelections(newCorrectSelections);
      setComparedSelectors(prev => [...prev, selector.id]);
      
      const winCondition = levelConfig?.winCondition || { requiredCorrect: 8, minimumScorePercentage: 0.8 };
      
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
      } else if (newTotalSelections >= 16) {
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
      
      if (newTotalSelections >= 16) {
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
  };

  const checkForNextLevelButton = (newTotalSelections, newCorrectSelections, newScore) => { 
    setTimeout(() => {
      const scoreAtStartOfLevel = getCorrectInitialScore(nivel);
      
      const winCondition = levelConfig?.winCondition || { requiredCorrect: 8, minimumScorePercentage: 0.8 };
      const scoringConfig = levelConfig?.baseScoringConfig || { pointsOnCorrect: 10 };
      
      // Calcular el puntaje requerido: 80% de los puntos obtenidos (no del máximo posible)
      const pointsGained = newScore - scoreAtStartOfLevel;
      const maxPossiblePoints = winCondition.requiredCorrect * scoringConfig.pointsOnCorrect;
      const requiredAdditionalPoints = maxPossiblePoints * winCondition.minimumScorePercentage;
      const requiredFinalScore = scoreAtStartOfLevel + requiredAdditionalPoints;
      
      console.log(`📊 Verificación 80%: Puntaje inicial: ${scoreAtStartOfLevel}, Puntos ganados: ${pointsGained}, Requeridos: ${requiredAdditionalPoints}, Puntaje actual: ${newScore}, Puntaje requerido: ${requiredFinalScore}`);
      
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
  
      } else if (newTotalSelections >= 16) {
        setTimeout(() => {
          evaluateLevel(newCorrectSelections, newScore); 
        }, 500);
      }
    }, 1000);
  };

  const evaluateLevel = (currentCorrectSelections = correctSelections, currentScore = score) => {
    if (!levelConfig) return;
    
    const scoreAtStartOfLevel = getCorrectInitialScore(nivel);
    
    const winCondition = levelConfig?.winCondition || { requiredCorrect: 8, minimumScorePercentage: 0.8 };
    const scoringConfig = levelConfig?.baseScoringConfig || { pointsOnCorrect: 10 };
    
    const pointsGained = currentScore - scoreAtStartOfLevel;
    const maxPossiblePoints = winCondition.requiredCorrect * scoringConfig.pointsOnCorrect;
    const requiredAdditionalPoints = maxPossiblePoints * winCondition.minimumScorePercentage;
    const requiredFinalScore = scoreAtStartOfLevel + requiredAdditionalPoints;
    
    console.log(`📊 evaluateLevel - Puntaje inicial: ${scoreAtStartOfLevel}, Puntos ganados: ${pointsGained}, Requeridos: ${requiredAdditionalPoints}, Puntaje actual: ${currentScore}, Puntaje requerido: ${requiredFinalScore}`);
    
    if (currentCorrectSelections === winCondition.requiredCorrect && currentScore >= requiredFinalScore) {
      saveCompletedLevelProgress(nivel, currentScore);
      
      const currentLevel = parseInt(nivel);
      const maxLevels = 10;
      
      if (currentLevel < maxLevels) {
        setEndGameMessage(`¡Excelente! Has completado el nivel ${nivel} con ${currentCorrectSelections} aciertos y ${currentScore} monedas. ¡Pasas al siguiente nivel!`);
      } else {
        setEndGameMessage(`¡Felicidades! Has completado todos los niveles de la dificultad ${dificultad}. ¡Eres increíble!`);
      }
      setEndGameType('success');
      setShowEndGameAlert(true);

      setTimeout(() => {
        const customSuccessAudio = getSuccessAudio();
        playAudioWithQueue(customSuccessAudio, null, true);
      }, 500);

    } else {
      
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
        gameType: 'pares-minimos',
        difficulty: dificultad,
        level: nivel,
        score: score,
        accumulatedScore: score,
        timestamp: new Date().toISOString()
      };
      
      // Guardar en localStorage
      localStorage.setItem(`progress_pares-minimos_${dificultad}_${userId}`, JSON.stringify(generalProgress));
      
      // 💾 GUARDAR EN BASE DE DATOS antes de ir a encuesta
      try {
        const ninoService = (await import('../../api/ninoService')).default;
        await ninoService.saveProgresoEspecifico(userId, {
          game_type: 'pares-minimos',
          difficulty: dificultad,
          current_level: nivel,
          accumulated_score: score
        });
        console.log(`✅ Progreso guardado en BD antes de ir a encuesta (Pares Mínimos ${dificultad})`);
      } catch (error) {
        console.error('❌ Error guardando progreso en BD antes de encuesta:', error);
      }
    }
    
    navigate('/encuesta', { 
      state: { 
        gameType: 'pares-minimos', 
        difficulty: dificultad, 
        level: nivel,
        score: score
      } 
    });
  };

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

  // 📥 CARGA DE PROGRESO DESHABILITADA TEMPORALMENTE
  // useEffect(() => {
  //   const cargarProgreso = async () => {
  //     if (user && nivel) {
  //       const progressFromDB = await loadProgressFromDatabase();
  //       if (progressFromDB && progressFromDB.accumulated_score) {
  //         console.log('🔄 Restaurando progreso (Pares Mínimos): Nivel', progressFromDB.current_level, 'Puntaje', progressFromDB.accumulated_score);
  //         setScore(progressFromDB.accumulated_score);
  //       }
  //     }
  //   };
  //   
  //   cargarProgreso();
  // }, []); // Solo ejecutar al montar el componente

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

  useEffect(() => {
    console.log('🔍 useEffect ejecutándose - nivel:', nivel, 'dificultad:', dificultad);
    
    if (dificultad !== 'facil') {
      navigate('/seleccion-mundo');
      return;
    }

    const config = getNivelConfigParesMinimos(nivel);
    console.log('📦 Config obtenida para nivel', nivel, ':', config ? 'EXISTE' : 'NO EXISTE');
    
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
      }, 100);
      
      setRemainingTime(config.tiempoMaximo);
      
      if (user) {
        const userId = user.id;
        
        if (nivel === '1') {
          localStorage.removeItem(`progress_pares-minimos_${dificultad}_${userId}`);
          localStorage.removeItem(`completed_levels_pares-minimos_${dificultad}_${userId}`);
          
          const freshProgress = {
            gameType: 'pares-minimos',
            difficulty: dificultad,
            level: nivel,
            score: 200,
            accumulatedScore: 200,
            timestamp: new Date().toISOString()
          };
          localStorage.setItem(`progress_pares-minimos_${dificultad}_${userId}`, JSON.stringify(freshProgress));
          
          setScore(200);
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
          setRemainingTime(config.tiempoMaximo);
          
        } else {
          const correctScore = getCorrectInitialScore(nivel);
          setScore(correctScore);
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
          setRemainingTime(config.tiempoMaximo);
        }
      }
    }
    
    return () => {
      setComparedSelectors([]);
      setDisabledSelectors([]);
      setLastSelectedSelector(null);
      setHighlightedSelector(null);
      
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
      
      if (instructionsTimeoutRef.current) {
        clearTimeout(instructionsTimeoutRef.current);
        instructionsTimeoutRef.current = null;
      }
      
      setIsPlayingAudio(false);
      setIsPlayingInstructions(false);
    };
  }, [dificultad, nivel]); // ✅ Solo depende de dificultad y nivel

  // 🎵 useEffect separado para reproducir instrucciones cuando levelConfig esté listo
  useEffect(() => {
    if (levelConfig && !instructionsCompleted && !isPlayingInstructions) {
      console.log('🎯 levelConfig cargado, preparando instrucciones...');
      const instructionsTimer = setTimeout(() => {
        playInitialInstructions();
      }, 500);
      
      return () => {
        if (instructionsTimer) {
          clearTimeout(instructionsTimer);
        }
      };
    }
  }, [levelConfig]); // ✅ Se ejecuta cuando levelConfig cambia

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
           Cargando nivel Pares Mínimos... 
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
            
            <NavigationButtons>
              <Button onClick={goToSurvey} disabled={showEndGameAlert || showSuccessAlert}>
                Ir a encuesta
              </Button>
            </NavigationButtons>
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
                <TrainingCounter>{audioPlayed}/{levelConfig?.trainingConfig?.totalClicks || 10}</TrainingCounter>
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
                {(() => {
                  const currentLevel = parseInt(nivel);
                  let maxLevels;
                  if (dificultad === 'facil') {
                    maxLevels = 10;
                  } else if (dificultad === 'medio' || dificultad === 'dificil') {
                    maxLevels = 5;
                  }
                  
                  if (currentLevel >= maxLevels) {
                    return '¡FELICIDADES! Has completado todos los niveles. ¡Es hora de responder la encuesta!';
                  } else {
                    return '¡EXCELENTE TRABAJO! Estás listo para el siguiente desafío.';
                  }
                })()}
              </SuccessAlertText>
              <SuccessAlertButton 
                disabled={isPlayingSuccessAudio}
                onClick={isPlayingSuccessAudio ? undefined : closeSuccessAlert}
              >
                {(() => {
                  const currentLevel = parseInt(nivel);
                  let maxLevels;
                  if (dificultad === 'facil') {
                    maxLevels = 10;
                  } else if (dificultad === 'medio' || dificultad === 'dificil') {
                    maxLevels = 5;
                  }
                  
                  if (currentLevel >= maxLevels) {
                    return 'Ir a Encuesta';
                  } else {
                    return 'Siguiente Nivel';
                  }
                })()}
              </SuccessAlertButton>
            </SuccessAlertBox>
          </SuccessAlertOverlay>
        )}
      </GameBackground>
    </>
  );
};

// Styled Components (idénticos a NivelCognados)
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
  margin-top: 250px;
  margin-bottom: 80px; 
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
  grid-template-rows: repeat(2, 1fr);
  gap: 25px;
  margin-top: 150px;
  width: 85%;
  max-width: 1300px;
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
    width: 95px;
    height: auto;
    transition: all 0.2s ease;
    filter: ${props => 
      props.disabled ? 'grayscale(1)' :
      props.selected ? 'grayscale(0.3)' : 'none'
    };
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

export default NivelParesMinimos;
