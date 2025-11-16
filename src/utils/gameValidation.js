//src/utils/gameValidation.js

/**
 * Sistema completo de validación de acceso a niveles y persistencia de estado
 * Previene navegación libre entre niveles y valida progreso secuencial
 */

// ═══════════════════════════════════════════════════════════════════════════════
// 📊 CONFIGURACIÓN DE NIVELES POR DIFICULTAD
// ═══════════════════════════════════════════════════════════════════════════════

const GAME_CONFIG = {
  cognados: {
    facil: { maxLevels: 10, requiredScorePercentage: 0.8, baseScore: 200 },
    medio: { maxLevels: 5, requiredScorePercentage: 0.85, baseScore: 200 },
    dificil: { maxLevels: 5, requiredScorePercentage: 0.9, baseScore: 200 }
  },
  'pares-minimos': {
    facil: { maxLevels: 5, requiredScorePercentage: 0.8, baseScore: 200 },
    medio: { maxLevels: 5, requiredScorePercentage: 0.85, baseScore: 200 },
    dificil: { maxLevels: 5, requiredScorePercentage: 0.9, baseScore: 200 }
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// 🔐 VALIDACIÓN DE ACCESO A NIVELES
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Valida si un usuario puede acceder a un nivel específico
 * @param {Object} user - Usuario autenticado
 * @param {string} gameType - Tipo de juego ('cognados' o 'pares-minimos')
 * @param {string} dificultad - Dificultad ('facil', 'medio', 'dificil')
 * @param {string|number} nivel - Nivel solicitado
 * @returns {Object} { canAccess: boolean, reason: string, redirectTo: string|null }
 */
export const validateLevelAccess = (user, gameType, dificultad, nivel) => {
  // ─── Validaciones Básicas ───
  if (!user) {
    return {
      canAccess: false,
      reason: 'Usuario no autenticado',
      redirectTo: '/login'
    };
  }

  if (!GAME_CONFIG[gameType]) {
    return {
      canAccess: false,
      reason: 'Tipo de juego inválido',
      redirectTo: '/seleccion-mundo'
    };
  }

  if (!GAME_CONFIG[gameType][dificultad]) {
    return {
      canAccess: false,
      reason: 'Dificultad inválida',
      redirectTo: '/seleccion-mundo'
    };
  }

  const nivelNumerico = parseInt(nivel);
  const { maxLevels } = GAME_CONFIG[gameType][dificultad];

  // ─── Validar Rango de Nivel ───
  if (isNaN(nivelNumerico) || nivelNumerico < 1 || nivelNumerico > maxLevels) {
    return {
      canAccess: false,
      reason: `Nivel fuera de rango (1-${maxLevels})`,
      redirectTo: `/nivel/${gameType}/${dificultad}/1`
    };
  }

  // ─── Nivel 1 Siempre Accesible ───
  if (nivelNumerico === 1) {
    return {
      canAccess: true,
      reason: 'Nivel inicial accesible',
      redirectTo: null
    };
  }

  // ─── Validar Progreso Secuencial ───
  const progressKey = `progress_${gameType}_${dificultad}_${user.id}`;
  const savedProgress = localStorage.getItem(progressKey);

  if (!savedProgress) {
    return {
      canAccess: false,
      reason: 'No hay progreso guardado, debe empezar desde nivel 1',
      redirectTo: `/nivel/${gameType}/${dificultad}/1`
    };
  }

  try {
    const progress = JSON.parse(savedProgress);
    const completedLevel = parseInt(progress.level) || 0;
    const lastCompletedLevel = Math.max(completedLevel, 0);

    // Solo puede acceder al siguiente nivel después del completado
    if (nivelNumerico <= lastCompletedLevel + 1) {
      return {
        canAccess: true,
        reason: `Acceso autorizado basado en progreso (completado hasta nivel ${lastCompletedLevel})`,
        redirectTo: null
      };
    } else {
      const maxAccessibleLevel = Math.min(lastCompletedLevel + 1, maxLevels);
      return {
        canAccess: false,
        reason: `Debe completar nivel ${lastCompletedLevel + 1} primero`,
        redirectTo: `/nivel/${gameType}/${dificultad}/${maxAccessibleLevel}`
      };
    }

  } catch (error) {
    return {
      canAccess: false,
      reason: 'Error en progreso guardado, reiniciando desde nivel 1',
      redirectTo: `/nivel/${gameType}/${dificultad}/1`
    };
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// 🎮 VALIDACIÓN DE ESTADO DE NIVEL EN PROGRESO
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Valida si existe un estado guardado válido para un nivel específico
 * @param {Object} user - Usuario autenticado
 * @param {string} gameType - Tipo de juego
 * @param {string} dificultad - Dificultad
 * @param {string|number} nivel - Nivel
 * @returns {Object} { hasValidState: boolean, state: Object|null, shouldRestore: boolean }
 */
export const validateLevelState = (user, gameType, dificultad, nivel) => {
  if (!user) {
    return { hasValidState: false, state: null, shouldRestore: false };
  }

  const stateKey = `gameState_${gameType}_${dificultad}_${nivel}_${user.id}`;
  const savedState = localStorage.getItem(stateKey);

  if (!savedState) {
    return { hasValidState: false, state: null, shouldRestore: false };
  }

  try {
    const state = JSON.parse(savedState);

    // ─── Validar Integridad del Estado ───
    const requiredFields = [
      'score', 'correctSelections', 'totalSelections', 'remainingTime',
      'sessionTimestamp', 'levelStarted'
    ];

    const hasAllFields = requiredFields.every(field => 
      state.hasOwnProperty(field) && state[field] !== undefined
    );

    if (!hasAllFields) {
      localStorage.removeItem(stateKey);
      return { hasValidState: false, state: null, shouldRestore: false };
    }

    // ─── Validar Antigüedad de la Sesión ───
    const maxAge = 4 * 60 * 60 * 1000; // 4 horas
    const sessionAge = Date.now() - state.sessionTimestamp;
    
    if (sessionAge > maxAge) {
      localStorage.removeItem(stateKey);
      return { hasValidState: false, state: null, shouldRestore: false };
    }

    // ─── Validar que el Nivel Fue Iniciado ───
    if (!state.levelStarted) {
      return { hasValidState: false, state: null, shouldRestore: false };
    }

    // ─── Validar Consistencia de Datos ───
    if (state.score < 0 || state.correctSelections < 0 || state.totalSelections < 0) {
      localStorage.removeItem(stateKey);
      return { hasValidState: false, state: null, shouldRestore: false };
    }

    // ─── Validar que No Se Haya Completado el Nivel ───
    if (state.correctSelections >= 8 && state.totalSelections >= 16) {
      localStorage.removeItem(stateKey);
      return { hasValidState: false, state: null, shouldRestore: false };
    }

    return {
      hasValidState: true,
      state: state,
      shouldRestore: true
    };

  } catch (error) {
    localStorage.removeItem(stateKey);
    return { hasValidState: false, state: null, shouldRestore: false };
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// 📈 GESTIÓN DE PROGRESO
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Obtiene el último nivel accesible para un usuario
 * @param {Object} user - Usuario autenticado
 * @param {string} gameType - Tipo de juego
 * @param {string} dificultad - Dificultad
 * @returns {number} Último nivel accesible
 */
export const getLastAccessibleLevel = (user, gameType, dificultad) => {
  if (!user || !GAME_CONFIG[gameType]?.[dificultad]) return 1;

  const progressKey = `progress_${gameType}_${dificultad}_${user.id}`;
  const savedProgress = localStorage.getItem(progressKey);

  if (!savedProgress) return 1;

  try {
    const progress = JSON.parse(savedProgress);
    const completedLevel = parseInt(progress.level) || 0;
    const maxLevels = GAME_CONFIG[gameType][dificultad].maxLevels;
    
    return Math.min(completedLevel + 1, maxLevels);
  } catch (error) {
    return 1;
  }
};

/**
 * Obtiene el máximo de niveles para una dificultad específica
 * @param {string} gameType - Tipo de juego
 * @param {string} dificultad - Dificultad
 * @returns {number} Máximo de niveles
 */
export const getMaxLevelsForDifficulty = (gameType, dificultad) => {
  return GAME_CONFIG[gameType]?.[dificultad]?.maxLevels || 5;
};

/**
 * Obtiene la configuración completa de un juego y dificultad
 * @param {string} gameType - Tipo de juego
 * @param {string} dificultad - Dificultad
 * @returns {Object|null} Configuración del juego
 */
export const getGameConfig = (gameType, dificultad) => {
  return GAME_CONFIG[gameType]?.[dificultad] || null;
};

// ═══════════════════════════════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Limpia estados guardados expirados o inválidos
 * @param {Object} user - Usuario autenticado
 */
export const cleanupExpiredStates = (user) => {
  if (!user) return;

  const keys = Object.keys(localStorage);
  const userStateKeys = keys.filter(key => 
    key.startsWith('gameState_') && key.endsWith(`_${user.id}`)
  );

  const maxAge = 4 * 60 * 60 * 1000; // 4 horas
  let cleanedCount = 0;

  userStateKeys.forEach(key => {
    try {
      const state = JSON.parse(localStorage.getItem(key));
      const sessionAge = Date.now() - state.sessionTimestamp;
      
      if (sessionAge > maxAge || !state.levelStarted) {
        localStorage.removeItem(key);
        cleanedCount++;
      }
    } catch (error) {
      localStorage.removeItem(key);
      cleanedCount++;
    }
  });

  if (cleanedCount > 0) {
  }
};

/**
 * Limpia el estado específico de un nivel
 * @param {Object} user - Usuario autenticado
 * @param {string} gameType - Tipo de juego
 * @param {string} dificultad - Dificultad
 * @param {string|number} nivel - Nivel
 */
export const cleanLevelState = (user, gameType, dificultad, nivel) => {
  if (!user) return;

  const stateKey = `gameState_${gameType}_${dificultad}_${nivel}_${user.id}`;
  localStorage.removeItem(stateKey);
};

/**
 * Limpia todo el progreso de un usuario para un juego y dificultad específicos
 * @param {Object} user - Usuario autenticado
 * @param {string} gameType - Tipo de juego
 * @param {string} dificultad - Dificultad
 */
export const resetProgressForDifficulty = (user, gameType, dificultad) => {
  if (!user) return;

  // Limpiar progreso general
  const progressKey = `progress_${gameType}_${dificultad}_${user.id}`;
  localStorage.removeItem(progressKey);

  // Limpiar todos los estados de niveles para esta dificultad
  const keys = Object.keys(localStorage);
  const difficultyStateKeys = keys.filter(key => 
    key.startsWith(`gameState_${gameType}_${dificultad}_`) && key.endsWith(`_${user.id}`)
  );

  difficultyStateKeys.forEach(key => {
    localStorage.removeItem(key);
  });

};

// ═══════════════════════════════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Determina la ruta correcta para un usuario que intenta acceder a un nivel
 * @param {Object} user - Usuario autenticado
 * @param {string} gameType - Tipo de juego
 * @param {string} dificultad - Dificultad
 * @param {string|number} nivel - Nivel solicitado
 * @returns {Object} { shouldRedirect: boolean, correctPath: string, reason: string }
 */
export const getCorrectLevelPath = (user, gameType, dificultad, nivel) => {
  const validation = validateLevelAccess(user, gameType, dificultad, nivel);
  
  if (validation.canAccess) {
    return {
      shouldRedirect: false,
      correctPath: `/nivel/${gameType}/${dificultad}/${nivel}`,
      reason: validation.reason
    };
  }

  return {
    shouldRedirect: true,
    correctPath: validation.redirectTo,
    reason: validation.reason
  };
};

/**
 * Middleware para validar acceso antes de renderizar componente de nivel
 * @param {Object} user - Usuario autenticado
 * @param {string} gameType - Tipo de juego
 * @param {string} dificultad - Dificultad
 * @param {string|number} nivel - Nivel solicitado
 * @returns {boolean} true si puede acceder, false si debe redirigir
 */
export const canAccessLevel = (user, gameType, dificultad, nivel) => {
  const validation = validateLevelAccess(user, gameType, dificultad, nivel);
  return validation.canAccess;
};

// ═══════════════════════════════════════════════════════════════════════════════
// 📊 UTILIDADES DE ESTADO
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Calcula el tiempo restante basado en el timestamp guardado
 * @param {number} savedTime - Tiempo restante guardado en segundos
 * @param {number} sessionTimestamp - Timestamp cuando se guardó el estado
 * @param {number} maxTime - Tiempo máximo del nivel en segundos
 * @returns {number} Tiempo restante ajustado
 */
export const calculateAdjustedTime = (savedTime, sessionTimestamp, maxTime) => {
  const elapsedTime = Math.floor((Date.now() - sessionTimestamp) / 1000);
  const adjustedTime = savedTime - elapsedTime;
  
  // No puede ser negativo ni mayor al tiempo máximo
  return Math.max(0, Math.min(adjustedTime, maxTime));
};

/**
 * Verifica si un estado guardado es válido para restaurar
 * @param {Object} state - Estado guardado
 * @param {number} maxTime - Tiempo máximo del nivel
 * @returns {boolean} true si es válido para restaurar
 */
export const isStateRestorable = (state, maxTime) => {
  if (!state || !state.sessionTimestamp || !state.levelStarted) return false;
  
  const adjustedTime = calculateAdjustedTime(
    state.remainingTime, 
    state.sessionTimestamp, 
    maxTime
  );
  
  // Si queda tiempo y no se ha completado el nivel
  return adjustedTime > 0 && !(state.correctSelections >= 8 && state.totalSelections >= 16);
};