//src/Game/data/nivelesConfigDificil.js
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
 * Crea la configuración completa de un nivel DIFÍCIL
 * @param {Object} config - Configuración del nivel
 * @returns {Object} Configuración completa del nivel
 */
const createLevelConfigDificil = (config) => ({
  // Configuraciones básicas - DIFÍCIL: 1 minuto 30 segundos
  tiempoMaximo: config.tiempoMaximo || 90, // 1:30 min
  instructionsAudio: config.instructionsAudio || '/sounds/cognados/dificil/instrucciones/instrucciones.mp3',
  backgroundImage: config.backgroundImage || '/images/fondo_isla.png',
  successAudio: config.successAudio || '/sounds/cognados/facil/succes/success.mp3',
  
  // MODO DIFÍCIL: 3 indicadores
  indicators: [
    {
      id: 1,
      image: config.indicator1Image,
      audio: config.indicator1Audio,
      group: 'group1', // Grupo para asociar con selectables
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
    },
    {
      id: 2,
      image: config.indicator2Image,
      audio: config.indicator2Audio,
      group: 'group2', // Grupo para asociar con selectables
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
    },
    {
      id: 3,
      image: config.indicator3Image,
      audio: config.indicator3Audio,
      group: 'group3', // Grupo para asociar con selectables
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
    }
  ],
  
  // DIFÍCIL: 9 selectables (3 del grupo 1 + 3 del grupo 2 + 3 del grupo 3)
  selectables: [
    // 3 elementos del grupo 1 (indicador 1)
    ...Array.from({ length: 3 }, (_, index) => ({
      id: `group1_${index + 1}`,
      image: config.selectableImage,
      isCorrect: true,
      indicatorId: 1,
      group: 'group1',
      audio: config.indicator1Audio, // Mismo audio que el indicador 1
      scoring: baseScoringConfig,
      animations: correctElementAnimations,
      feedback: {
        ...baseFeedbackConfig,
        correctSound: '/sounds/feedback/victory.mp3',
        incorrectSound: '/sounds/feedback/defeat.mp3',
      }
    })),
    
    // 3 elementos del grupo 2 (indicador 2)
    ...Array.from({ length: 3 }, (_, index) => ({
      id: `group2_${index + 1}`,
      image: config.selectableImage,
      isCorrect: true,
      indicatorId: 2,
      group: 'group2',
      audio: config.indicator2Audio, // Mismo audio que el indicador 2
      scoring: baseScoringConfig,
      animations: correctElementAnimations,
      feedback: {
        ...baseFeedbackConfig,
        correctSound: '/sounds/feedback/victory.mp3',
        incorrectSound: '/sounds/feedback/defeat.mp3',
      }
    })),
    
    // 3 elementos del grupo 3 (indicador 3)
    ...Array.from({ length: 3 }, (_, index) => ({
      id: `group3_${index + 1}`,
      image: config.selectableImage,
      isCorrect: true,
      indicatorId: 3,
      group: 'group3',
      audio: config.indicator3Audio, // Mismo audio que el indicador 3
      scoring: baseScoringConfig,
      animations: correctElementAnimations,
      feedback: {
        ...baseFeedbackConfig,
        correctSound: '/sounds/feedback/victory.mp3',
        incorrectSound: '/sounds/feedback/defeat.mp3',
      }
    }))
  ],
  
  // Configuración específica del modo DIFÍCIL
  gameMode: 'dificil',
  trainingConfig: {
    totalClicks: 15, // 5 clicks por cada indicador (3 indicadores)
    clicksPerIndicator: 5,
    indicatorCount: 3
  },
  winCondition: {
    requiredCorrect: 9, // Todos los selectables deben ser correctos
    minimumScorePercentage: 0.8 // 80% del puntaje posible
  },
  totalCorrect: 9,
  gameSettings: baseGameSettings,
  audioSettings: baseAudioSettings,
  uiSettings: baseUISettings
});

// CONFIGURACIONES DE LOS 5 NIVELES DIFÍCIL
export const cognadosDificilNivel1 = createLevelConfigDificil({
  tiempoMaximo: 90,
  instructionsAudio: '/sounds/cognados/facil/instrucciones/instrucciones1.mp3',
  backgroundImage: '/images/cognados/nivel1/fondo_isla.png',
  
  indicator1Image: '/images/cognados/dificil/nivel1/indicador1.png',
  indicator1Audio: '/sounds/cognados/dificil/nivel1/audio1.mp3',
  
  indicator2Image: '/images/cognados/dificil/nivel1/indicador2.png',
  indicator2Audio: '/sounds/cognados/dificil/nivel1/audio2.mp3',
  
  indicator3Image: '/images/cognados/dificil/nivel1/indicador3.png',
  indicator3Audio: '/sounds/cognados/dificil/nivel1/audio3.mp3',
  
  selectableImage: '/images/cognados/dificil/nivel1/seleccionable.png',
  
  successAudio: '/sounds/cognados/dificil/succes/success1.mp3'
});

export const cognadosDificilNivel2 = createLevelConfigDificil({
  tiempoMaximo: 90,
  instructionsAudio: '/sounds/cognados/facil/instrucciones/instrucciones2.mp3',
  backgroundImage: '/images/cognados/dificil/nivel2/fondo2.jpg',
  
  indicator1Image: '/images/cognados/dificil/nivel2/indicador1.png',
  indicator1Audio: '/sounds/cognados/dificil/nivel2/audio1.mp3',
  
  indicator2Image: '/images/cognados/dificil/nivel2/indicador2.png',
  indicator2Audio: '/sounds/cognados/dificil/nivel2/audio2.mp3',
  
  indicator3Image: '/images/cognados/dificil/nivel2/indicador3.png',
  indicator3Audio: '/sounds/cognados/dificil/nivel2/audio3.mp3',
  
  selectableImage: '/images/cognados/dificil/nivel2/seleccionable.png',
  
  successAudio: '/sounds/cognados/dificil/succes/success2.mp3'
});

export const cognadosDificilNivel3 = createLevelConfigDificil({
  tiempoMaximo: 90,
  instructionsAudio: '/sounds/cognados/facil/instrucciones/instrucciones3.mp3',
  backgroundImage: '/images/cognados/dificil/nivel3/fondo3.jpg',
  
  indicator1Image: '/images/cognados/dificil/nivel3/indicador1.png',
  indicator1Audio: '/sounds/cognados/dificil/nivel3/audio1.mp3',
  
  indicator2Image: '/images/cognados/dificil/nivel3/indicador2.png',
  indicator2Audio: '/sounds/cognados/dificil/nivel3/audio2.mp3',
  
  indicator3Image: '/images/cognados/dificil/nivel3/indicador3.png',
  indicator3Audio: '/sounds/cognados/dificil/nivel3/audio3.mp3',
  
  selectableImage: '/images/cognados/dificil/nivel3/seleccionable.png',
  
  successAudio: '/sounds/cognados/dificil/succes/success3.mp3'
});

export const cognadosDificilNivel4 = createLevelConfigDificil({
  tiempoMaximo: 90,
  instructionsAudio: '/sounds/cognados/facil/instrucciones/instrucciones4.mp3',
  backgroundImage: '/images/cognados/dificil/nivel4/fondo4.jpg',
  
  indicator1Image: '/images/cognados/dificil/nivel4/indicador1.png',
  indicator1Audio: '/sounds/cognados/dificil/nivel4/audio1.mp3',
  
  indicator2Image: '/images/cognados/dificil/nivel4/indicador2.png',
  indicator2Audio: '/sounds/cognados/dificil/nivel4/audio2.mp3',
  
  indicator3Image: '/images/cognados/dificil/nivel4/indicador3.png',
  indicator3Audio: '/sounds/cognados/dificil/nivel4/audio3.mp3',
  
  selectableImage: '/images/cognados/dificil/nivel4/seleccionable.png',
  
  successAudio: '/sounds/cognados/dificil/succes/success4.mp3'
});

export const cognadosDificilNivel5 = createLevelConfigDificil({
  tiempoMaximo: 90,
  instructionsAudio: '/sounds/cognados/facil/instrucciones/instrucciones5.mp3',
  backgroundImage: '/images/cognados/dificil/nivel5/fondo5.jpg',
  
  indicator1Image: '/images/cognados/dificil/nivel5/indicador1.png',
  indicator1Audio: '/sounds/cognados/dificil/nivel5/audio1.mp3',
  
  indicator2Image: '/images/cognados/dificil/nivel5/indicador2.png',
  indicator2Audio: '/sounds/cognados/dificil/nivel5/audio2.mp3',
  
  indicator3Image: '/images/cognados/dificil/nivel5/indicador3.png',
  indicator3Audio: '/sounds/cognados/dificil/nivel5/audio3.mp3',
  
  selectableImage: '/images/cognados/dificil/nivel5/seleccionable.png',
  
  successAudio: '/sounds/cognados/dificil/succes/success5.mp3'
});

/**
 * Función para obtener la configuración de niveles DIFÍCIL
 */
export const getNivelConfigDificil = (level) => {
  const dificilLevels = {
    '1': cognadosDificilNivel1,
    '2': cognadosDificilNivel2,
    '3': cognadosDificilNivel3,
    '4': cognadosDificilNivel4,
    '5': cognadosDificilNivel5
  };
  return dificilLevels[level] || null;
};

// Exportar configuraciones base
export { 
  baseGameSettings, 
  baseAudioSettings, 
  baseUISettings,
  baseScoringConfig,
  baseFeedbackConfig,
  createLevelConfigDificil
};