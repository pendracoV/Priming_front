const baseGameSettings = {
  shuffleSelectables: true,
  showWordLabels: false,
  enableParticleEffects: true,
  enableScreenShake: false,
  pauseOnCorrect: 500,
  pauseOnIncorrect: 800,
  autoPlayInstructions: true,
  autoPlayTraining: false,
  trainingInterval: 0,
  disableSelectorsAfterComparison: true
};

const baseAudioSettings = {
  masterVolume: 0.8,
  effectsVolume: 0.6,
  voiceVolume: 1.0,
  instructionsVolume: 1.0,
  enableSpatialAudio: false,
  audioDelay: 0
};

const baseUISettings = {
  showProgressBar: false,
  showScoreAnimation: true,
  scoreAnimationDuration: 1000,
  enableHapticFeedback: true,
  buttonStyle: 'rounded',
  colorScheme: 'blue',
  showLevelInfo: false,
  showTimeCounter: true,
  conditionalNextButton: true
};

// Animaciones estándar
const correctElementAnimations = {
  hover: { scale: 1.05, duration: 0.2, borderGlow: true, glowColor: '#4CAF50' },
  click: { scale: 0.9, duration: 0.15 },
  correct: { scale: [1, 1.2, 1], rotation: [0, 5, -5, 0], duration: 0.6, borderColor: '#4CAF50', glow: true },
  disabled: { opacity: 0.4, scale: 1, grayscale: 1 }
};

const incorrectElementAnimations = {
  hover: { scale: 1.05, duration: 0.2, borderGlow: true, glowColor: '#ff6b6b' },
  click: { scale: 0.9, duration: 0.15 },
  incorrect: { shake: true, shakeIntensity: 10, duration: 0.5, borderColor: '#ff6b6b', flashColor: '#ff6b6b' },
  disabled: { opacity: 0.4, scale: 1, grayscale: 1 }
};

const baseScoringConfig = {
  pointsOnCorrect: 10,
  pointsOnIncorrect: -10,
  showPointsAnimation: true,
  animationDuration: 1000
};

const baseFeedbackConfig = {
  correctMessage: '¡Correcto! +10 monedas',
  incorrectMessage: 'Incorrecto -10 monedas',
  showFloatingText: true,
  textDuration: 1500
};


/**
 * Crea la configuración completa de un nivel
 * @param {Object} config - Configuración del nivel
 * @returns {Object} Configuración completa del nivel
 */
const createLevelConfig = (config) => ({
  // Configuraciones básicas
  tiempoMaximo: config.tiempoMaximo || 180,
  instructionsAudio: config.instructionsAudio || '/sounds/cognados/facil/instrucciones/instrucciones.mp3',

  backgroundImage: config.backgroundImage || '/images/fondo_isla.png',
  successAudio: config.successAudio || '/sounds/cognados/facil/succes/success.mp3',
  
  // Indicador único por nivel
  indicators: [{
    id: 1,
    image: config.indicatorImage,
    audio: config.indicatorAudio,
    animations: {
      hover: { scale: 1.1, duration: 0.2, ease: 'ease-out' },
      click: { scale: 0.95, duration: 0.1, ease: 'ease-in' },
      idle: {
        bobbing: { translateY: [-2, 2], duration: 2, repeat: 'infinite', ease: 'ease-in-out' }
      }
    },
    interaction: {
      clickable: true,
      playAudioOnClick: true,
      autoPlay: false,
      showRippleEffect: true,
      vibrate: 50
    }
  }],
  
  // 16 selectables: 8 correctos + 8 incorrectos (MISMA IMAGEN)
  selectables: [
    // 8 elementos correctos (misma imagen repetida)
    ...Array.from({ length: 8 }, (_, index) => ({
      id: index + 1,
      image: config.selectableImage, 
      isCorrect: true,
      indicatorId: 1,
      audio: config.correctAudio, 
      scoring: baseScoringConfig,
      animations: correctElementAnimations,
      feedback: {
        ...baseFeedbackConfig,
        correctSound: config.correctAudio,
        incorrectSound: config.incorrectAudio,
        textColor: '#4CAF50'
      }
    })),
    
    // 8 elementos incorrectos (misma imagen repetida)
    ...Array.from({ length: 8 }, (_, index) => ({
      id: index + 9,
      image: config.selectableImage, 
      isCorrect: false,
      indicatorId: 1,
      audio: config.incorrectAudio, 
      scoring: baseScoringConfig,
      animations: incorrectElementAnimations,
      feedback: {
        ...baseFeedbackConfig,
        correctSound: config.correctAudio,
        incorrectSound: config.incorrectAudio,
        textColor: '#ff6b6b'
      }
    }))
  ],
  
  totalCorrect: 8,
  gameSettings: baseGameSettings,
  audioSettings: baseAudioSettings,
  uiSettings: baseUISettings
});


// CONFIGURACIONES DE LOS 10 NIVELES - SOLO CUSTOMIZABLE: RUTAS


// NIVEL 1 
export const cognadosFacilNivel1 = createLevelConfig({
  tiempoMaximo: 180,
  instructionsAudio: '/sounds/cognados/facil/instrucciones/instrucciones1.mp3',
  backgroundImage: '/images/cognados/nivel1/fondo_isla.png',
  
  indicatorImage: '/images/cognados/nivel1/cocodrilo.png',
  indicatorAudio: '/sounds/cognados/facil/nivel1/lemon.mp3',
  
  selectableImage: '/images/cognados/nivel1/fish.png',
  
  correctAudio: '/sounds/cognados/facil/nivel1/lemon.mp3',
  incorrectAudio: '/sounds/cognados/facil/nivel1/limon.mp3',

  successAudio: '/sounds/cognados/facil/succes/success.mp3'
});

export const cognadosFacilNivel2 = createLevelConfig({
  tiempoMaximo: 180,
  instructionsAudio: '/sounds/instrucciones/instrucciones2.mp3',
  backgroundImage: '/images/cognados/nivel2/fondo_2.png',
  
  indicatorImage: '/images/cognados/nivel2/cuevas.png',
  indicatorAudio: '/sounds/cognados/facil/nivel2/bananaE.mp3',
  
  selectableImage: '/images/cognados/nivel2/snake.png',
  
  correctAudio: '/sounds/cognados/facil/nivel2/bananaE.mp3',
  incorrectAudio: '/sounds/cognados/facil/nivel2/bananaS.mp3',

  successAudio: '/sounds/cognados/facil/succes/success2.mp3'
});

export const cognadosFacilNivel3 = createLevelConfig({
  tiempoMaximo: 180,
  instructionsAudio: '/sounds/instrucciones/instrucciones3.mp3',
  
  indicatorImage: '/images/cognados/nivel3/dragon.png',
  indicatorAudio: '/sounds/cognados/facil/nivel3/indicador.mp3',
  
  selectableImage: '/images/cognados/nivel3/cat.png',
  
  correctAudio: '/sounds/cognados/facil/nivel3/correcto.mp3',
  incorrectAudio: '/sounds/cognados/facil/nivel3/incorrecto.mp3',

  successAudio: '/sounds/cognados/facil/succes/success3.mp3'
});

export const cognadosFacilNivel4 = createLevelConfig({
  tiempoMaximo: 180,
  instructionsAudio: '/sounds/instrucciones/instrucciones4.mp3',
  
  indicatorImage: '/images/cognados/nivel4/robot.png',
  indicatorAudio: '/sounds/cognados/facil/nivel4/indicador.mp3',
  
  selectableImage: '/images/cognados/nivel4/book.png',
  
  correctAudio: '/sounds/cognados/facil/nivel4/correcto.mp3',
  incorrectAudio: '/sounds/cognados/facil/nivel4/incorrecto.mp3',

  successAudio: '/sounds/cognados/facil/succes/success.mp3'
});


export const cognadosFacilNivel5 = createLevelConfig({
  tiempoMaximo: 180,
  instructionsAudio: '/sounds/instrucciones/instrucciones5.mp3',
  
  indicatorImage: '/images/cognados/nivel5/unicornio.png',
  indicatorAudio: '/sounds/cognados/facil/nivel5/indicador.mp3',
  
  selectableImage: '/images/cognados/nivel5/flower.png',
  
  correctAudio: '/sounds/cognados/facil/nivel5/correcto.mp3',
  incorrectAudio: '/sounds/cognados/facil/nivel5/incorrecto.mp3',

  successAudio: '/sounds/cognados/facil/succes/success.mp3'
});

export const cognadosFacilNivel6 = createLevelConfig({
  tiempoMaximo: 180,
  instructionsAudio: '/sounds/instrucciones/instrucciones6.mp3',
  
  indicatorImage: '/images/cognados/nivel6/phoenix.png',
  indicatorAudio: '/sounds/cognados/facil/nivel6/indicador.mp3',
  
  selectableImage: '/images/cognados/nivel6/heart.png',
  
  correctAudio: '/sounds/cognados/facil/nivel6/correcto.mp3',
  incorrectAudio: '/sounds/cognados/facil/nivel6/incorrecto.mp3',

  successAudio: '/sounds/cognados/facil/succes/success.mp3'
});

export const cognadosFacilNivel7 = createLevelConfig({
  tiempoMaximo: 180,
  instructionsAudio: '/sounds/instrucciones/instrucciones7.mp3',
  
  indicatorImage: '/images/cognados/nivel7/mago.png',
  indicatorAudio: '/sounds/cognados/facil/nivel7/indicador.mp3',
  
  selectableImage: '/images/cognados/nivel7/star.png',
  
  correctAudio: '/sounds/cognados/facil/nivel7/correcto.mp3',
  incorrectAudio: '/sounds/cognados/facil/nivel7/incorrecto.mp3',

  successAudio: '/sounds/cognados/facil/succes/success.mp3'
});

export const cognadosFacilNivel8 = createLevelConfig({
  tiempoMaximo: 180,
  instructionsAudio: '/sounds/instrucciones/instrucciones8.mp3',
  
  indicatorImage: '/images/cognados/nivel8/elfo.png',
  indicatorAudio: '/sounds/cognados/facil/nivel8/indicador.mp3',
  
  selectableImage: '/images/cognados/nivel8/tree.png',
  
  correctAudio: '/sounds/cognados/facil/nivel8/correcto.mp3',
  incorrectAudio: '/sounds/cognados/facil/nivel8/incorrecto.mp3',

  successAudio: '/sounds/cognados/facil/succes/success.mp3'
});

export const cognadosFacilNivel9 = createLevelConfig({
  tiempoMaximo: 180,
  instructionsAudio: '/sounds/instrucciones/instrucciones9.mp3',
  
  indicatorImage: '/images/cognados/nivel9/titan.png',
  indicatorAudio: '/sounds/cognados/facil/nivel9/indicador.mp3',
  
  selectableImage: '/images/cognados/nivel9/sun.png',
  
  correctAudio: '/sounds/cognados/facil/nivel9/correcto.mp3',
  incorrectAudio: '/sounds/cognados/facil/nivel9/incorrecto.mp3',

  successAudio: '/sounds/cognados/facil/succes/success.mp3'
});

export const cognadosFacilNivel10 = createLevelConfig({
  tiempoMaximo: 240, 
  instructionsAudio: '/sounds/instrucciones/instrucciones10.mp3',
  
  indicatorImage: '/images/cognados/nivel10/guardian.png',
  indicatorAudio: '/sounds/cognados/facil/nivel10/indicador.mp3',
  
  selectableImage: '/images/cognados/nivel10/moon.png',
  
  correctAudio: '/sounds/cognados/facil/nivel10/correcto.mp3',
  incorrectAudio: '/sounds/cognados/facil/nivel10/incorrecto.mp3',

  successAudio: '/sounds/cognados/facil/succes/success.mp3'
});

// Placeholder para niveles medio (5 niveles)
const cognadosMedioNivel1 = createLevelConfig({
  tiempoMaximo: 150, // Menos tiempo para mayor dificultad
  indicatorImage: '/images/cognados/medio/nivel1/indicador.png',
  indicatorAudio: '/sounds/cognados/medio/nivel1/indicador.mp3',
  selectableImage: '/images/cognados/medio/nivel1/elemento.png',
  correctAudio: '/sounds/cognados/medio/nivel1/correcto.mp3',
  incorrectAudio: '/sounds/cognados/medio/nivel1/incorrecto.mp3'
});

// Placeholder para niveles difícil (5 niveles)
const cognadosDificilNivel1 = createLevelConfig({
  tiempoMaximo: 120, // Tiempo más limitado
  indicatorImage: '/images/cognados/dificil/nivel1/indicador.png',
  indicatorAudio: '/sounds/cognados/dificil/nivel1/indicador.mp3',
  selectableImage: '/images/cognados/dificil/nivel1/elemento.png',
  correctAudio: '/sounds/cognados/dificil/nivel1/correcto.mp3',
  incorrectAudio: '/sounds/cognados/dificil/nivel1/incorrecto.mp3'
});

/**
 * Función principal para obtener la configuración de cualquier nivel
 */
export const getNivelConfig = (gameType, difficulty, level) => {
  if (gameType === 'cognados') {
    if (difficulty === 'facil') {
      const facilLevels = {
        '1': cognadosFacilNivel1,
        '2': cognadosFacilNivel2,
        '3': cognadosFacilNivel3,
        '4': cognadosFacilNivel4,
        '5': cognadosFacilNivel5,
        '6': cognadosFacilNivel6,
        '7': cognadosFacilNivel7,
        '8': cognadosFacilNivel8,
        '9': cognadosFacilNivel9,
        '10': cognadosFacilNivel10
      };
      return facilLevels[level] || null;
    } 
    else if (difficulty === 'medio') {
      const medioLevels = {
        '1': cognadosMedioNivel1,
        // TODO: Agregar niveles 2-5 para medio
      };
      return medioLevels[level] || null;
    } 
    else if (difficulty === 'dificil') {
      const dificilLevels = {
        '1': cognadosDificilNivel1,
        // TODO: Agregar niveles 2-5 para difícil
      };
      return dificilLevels[level] || null;
    }
  } 
  else if (gameType === 'pares-minimos') {
    // TODO: Implementar configuraciones para pares mínimos
    return null;
  }
  
  return null;
};

/**
 * Obtiene el número máximo de niveles para una dificultad específica
 */
export const getMaxLevels = (gameType, difficulty) => {
  if (gameType === 'cognados') {
    const levelCounts = {
      'facil': 10,
      'medio': 5,
      'dificil': 5
    };
    return levelCounts[difficulty] || 5;
  } else if (gameType === 'pares-minimos') {
    return 5; // Placeholder
  }
  return 5;
};

/**
 * Verifica si un nivel existe
 */
export const levelExists = (gameType, difficulty, level) => {
  const config = getNivelConfig(gameType, difficulty, level);
  return config !== null;
};

/**
 * Obtiene información sobre el progreso del nivel
 */
export const getLevelProgressInfo = (gameType, difficulty, currentLevel) => {
  const maxLevels = getMaxLevels(gameType, difficulty);
  return {
    current: parseInt(currentLevel),
    total: maxLevels,
    isLastLevel: parseInt(currentLevel) === maxLevels,
    nextLevel: parseInt(currentLevel) + 1,
    progressPercentage: Math.round((parseInt(currentLevel) / maxLevels) * 100)
  };
};

// Funciones de configuración específicas
export const getAnimationConfig = (element, animationType) => {
  return element.animations?.[animationType] || {};
};

export const getFeedbackConfig = (element, feedbackType) => {
  return element.feedback?.[feedbackType] || '';
};

export const getScoringConfig = (element) => {
  return element.scoring || baseScoringConfig;
};

// Exportar configuraciones base
export { 
  baseGameSettings, 
  baseAudioSettings, 
  baseUISettings,
  baseScoringConfig,
  baseFeedbackConfig 
};