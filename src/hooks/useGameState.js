//src/hooks/useGameState.js

import { useState, useEffect, useContext, useRef, useCallback } from 'react';
import { AuthContext } from '../context/AuthContext';

export const useGameState = (gameType, dificultad, nivel, levelConfig) => {
  const { user } = useContext(AuthContext);
  const storageKey = `gameState_${gameType}_${dificultad}_${nivel}_${user?.id}`;
  const timerRef = useRef(null);
  const lastSaveRef = useRef(Date.now());

  // Estado inicial basado en configuración del nivel
  const getInitialState = useCallback(() => {
    const initialScore = getInitialScore();
    const initialTime = levelConfig?.tiempoMaximo || 180;
    
    return {
      // Estados básicos del juego
      score: initialScore,
      correctSelections: 0,
      totalSelections: 0,
      remainingTime: initialTime,
      maxTime: initialTime,
      
      // Estados de progreso
      isTraining: true,
      audioPlayed: 0,
      instructionsCompleted: false,
      
      // Estados de interacción
      lastSelectedSelector: null,
      isPlayingAudio: false,
      comparedSelectors: [],
      disabledSelectors: [],
      highlightedSelector: null,
      
      // Estados de UI
      showSuccessMessage: false,
      showSuccessAlert: false,
      showEndGameAlert: false,
      endGameMessage: '',
      endGameType: '',
      isPlayingInstructions: false,
      isPlayingSuccessAudio: false,
      
      // Control de sesión
      sessionTimestamp: Date.now(),
      levelStartTimestamp: Date.now(),
      pausedTime: 0,
      levelStarted: false,
      isValidSession: true,
      
      // Metadata
      gameType,
      difficulty: dificultad,
      level: nivel,
      version: '1.0'
    };
  }, [gameType, dificultad, nivel, levelConfig]);

  // Función para obtener score inicial según la dificultad y nivel
  const getInitialScore = useCallback(() => {
    if (dificultad === 'facil') {
      if (nivel === '1') {
        return 200;
      } else if (user) {
        const savedProgress = localStorage.getItem(`progress_cognados_${dificultad}_${user.id}`);
        if (savedProgress) {
          try {
            const progress = JSON.parse(savedProgress);
            return progress.accumulatedScore || 200;
          } catch (error) {
            return 200;
          }
        }
      }
    }
    return 200;
  }, [dificultad, nivel, user]);

  // Estado principal del juego
  const [gameState, setGameState] = useState(() => getInitialState());

  // Función para validar si una sesión guardada es válida
  const isValidSavedSession = useCallback((savedState) => {
    if (!savedState || typeof savedState !== 'object') return false;
    
    // Verificar que corresponde al nivel actual
    if (savedState.gameType !== gameType || 
        savedState.difficulty !== dificultad || 
        savedState.level !== nivel) {
      return false;
    }
    
    // Verificar que la sesión no sea muy antigua (máximo 4 horas)
    const maxAge = 4 * 60 * 60 * 1000; // 4 horas
    const sessionAge = Date.now() - savedState.sessionTimestamp;
    if (sessionAge > maxAge) {
      return false;
    }
    
    // Verificar que el nivel había sido iniciado
    if (!savedState.levelStarted) {
      return false;
    }
    
    // Verificar integridad básica de datos
    if (typeof savedState.score !== 'number' || 
        typeof savedState.correctSelections !== 'number' ||
        typeof savedState.totalSelections !== 'number') {
      return false;
    }
    
    return true;
  }, [gameType, dificultad, nivel]);

  // Función para calcular tiempo restante basado en timestamps
  const calculateRemainingTime = useCallback((savedState) => {
    if (!savedState.levelStartTimestamp || !savedState.maxTime) {
      return savedState.remainingTime || 0;
    }
    
    const timeElapsed = Math.floor((Date.now() - savedState.levelStartTimestamp) / 1000);
    const adjustedTimeElapsed = timeElapsed - (savedState.pausedTime || 0);
    const remaining = savedState.maxTime - adjustedTimeElapsed;
    
    return Math.max(0, remaining);
  }, []);

  useEffect(() => {
    if (!user || !levelConfig) return;

    try {
      const savedStateString = localStorage.getItem(storageKey);
      if (savedStateString) {
        const savedState = JSON.parse(savedStateString);
        
        if (isValidSavedSession(savedState)) {
          // Recalcular tiempo restante
          const actualRemainingTime = calculateRemainingTime(savedState);
          
          // Si el tiempo se agotó, limpiar estado y empezar fresh
          if (actualRemainingTime <= 0 && !savedState.isTraining && savedState.instructionsCompleted) {
            localStorage.removeItem(storageKey);
            setGameState(getInitialState());
            return;
          }
          
          // Restaurar estado con tiempo actualizado
          const restoredState = {
            ...savedState,
            remainingTime: actualRemainingTime,
            sessionTimestamp: Date.now(),
            isValidSession: true
          };
          
          setGameState(restoredState);
            score: restoredState.score,
            correctSelections: restoredState.correctSelections,
            remainingTime: restoredState.remainingTime,
            isTraining: restoredState.isTraining,
            instructionsCompleted: restoredState.instructionsCompleted
          });
          
          return;
        } else {
          localStorage.removeItem(storageKey);
        }
      }
    } catch (error) {
      localStorage.removeItem(storageKey);
    }
    
    // Si no hay estado válido, inicializar fresh
    setGameState(getInitialState());
  }, [storageKey, user, levelConfig, isValidSavedSession, calculateRemainingTime, getInitialState, nivel]);

  // Guardar estado en localStorage (throttled para performance)
  const saveStateToStorage = useCallback((state) => {
    if (!user || !state.levelStarted) return;

    // Throttle: solo guardar cada 1 segundo
    const now = Date.now();
    if (now - lastSaveRef.current < 1000) return;
    
    lastSaveRef.current = now;

    const stateToSave = {
      ...state,
      sessionTimestamp: now
    };

    try {
      localStorage.setItem(storageKey, JSON.stringify(stateToSave));
    } catch (error) {
    }
  }, [storageKey, user]);

  // Auto-guardar cuando el estado cambie
  useEffect(() => {
    saveStateToStorage(gameState);
  }, [gameState, saveStateToStorage]);

  // Función para actualizar el estado del juego
  const updateGameState = useCallback((updates) => {
    setGameState(prevState => {
      // Si updates es una función, ejecutarla con el estado previo
      const newUpdates = typeof updates === 'function' ? updates(prevState) : updates;
      
      const newState = {
        ...prevState,
        ...newUpdates,
        sessionTimestamp: Date.now(),
        levelStarted: true
      };
      
      return newState;
    });
  }, []);

  // Función para actualizar múltiples campos de forma atómica
  const updateMultipleFields = useCallback((fieldsUpdate) => {
    updateGameState(prevState => ({
      ...fieldsUpdate,
      sessionTimestamp: Date.now()
    }));
  }, [updateGameState]);

  // Función para resetear estado completamente
  const resetGameState = useCallback((customInitialValues = {}) => {
    const resetState = {
      ...getInitialState(),
      ...customInitialValues,
      sessionTimestamp: Date.now(),
      levelStarted: false
    };

    setGameState(resetState);
    
    try {
      localStorage.removeItem(storageKey);
    } catch (error) {
    }
  }, [getInitialState, storageKey, nivel]);

  // Función para limpiar estado al completar nivel exitosamente
  const clearGameState = useCallback(() => {
    try {
      localStorage.removeItem(storageKey);
    } catch (error) {
    }
  }, [storageKey, nivel]);

  // Función para marcar el inicio del nivel (importante para validación)
  const startLevel = useCallback(() => {
    updateGameState({
      levelStarted: true,
      levelStartTimestamp: Date.now(),
      sessionTimestamp: Date.now()
    });
  }, [updateGameState]);

  // Función para pausar/reanudar (útil para cuando se reproduce audio)
  const togglePause = useCallback((isPaused) => {
    updateGameState(prevState => ({
      pausedTime: isPaused 
        ? (prevState.pausedTime || 0) + Math.floor((Date.now() - prevState.sessionTimestamp) / 1000)
        : prevState.pausedTime
    }));
  }, [updateGameState]);

  // Helper para obtener valores específicos del estado
  const getStateValue = useCallback((key) => {
    return gameState[key];
  }, [gameState]);

  // Helper para verificar si el estado fue restaurado
  const isRestoredSession = useCallback(() => {
    return gameState.isValidSession && gameState.levelStarted;
  }, [gameState]);

  // Cleanup al desmontar
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  return {
    // Estado principal
    gameState,
    
    // Funciones de actualización
    updateGameState,
    updateMultipleFields,
    resetGameState,
    clearGameState,
    startLevel,
    togglePause,
    
    // Funciones de consulta
    getStateValue,
    isRestoredSession,
    
    // Metadatos útiles
    isValidSession: gameState.isValidSession,
    hasUnsavedProgress: gameState.levelStarted && (gameState.correctSelections > 0 || gameState.totalSelections > 0)
  };
};