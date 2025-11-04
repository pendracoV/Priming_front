// Configuraciones base para Pares Mínimos - FÁCIL
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
 * Crea la configuración completa de un nivel FÁCIL de Pares Mínimos
 */
const createLevelConfigParesMinimos = (config) => ({
  tiempoMaximo: config.tiempoMaximo || 180,
  instructionsAudio: config.instructionsAudio || '/sounds/pares-minimos/facil/instrucciones/instrucciones.mp3',
  backgroundImage: config.backgroundImage || '/images/fondo_isla.png',
  successAudio: config.successAudio || '/sounds/pares-minimos/facil/succes/success.mp3',
  
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
  
  selectables: [
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
  
  gameMode: 'facil',
  trainingConfig: {
    totalClicks: 10,
    clicksPerIndicator: 10,
    indicatorCount: 1
  },
  winCondition: {
    requiredCorrect: 8,
    minimumScorePercentage: 0.8
  },
  totalCorrect: 8,
  totalIncorrect: 8,
  totalSelectables: 16,
  
  gameSettings: baseGameSettings,
  audioSettings: baseAudioSettings,
  uiSettings: baseUISettings,
  baseScoringConfig,
  baseFeedbackConfig
});

/**
 * Obtiene la configuración de un nivel específico de Pares Mínimos - FÁCIL
 */
export const getNivelConfigParesMinimos = (nivel) => {
  const configs = {
    '1': createLevelConfigParesMinimos({
      tiempoMaximo: 180,
      indicatorImage: '/images/pares-minimos/nivel1/indicador.png',
      indicatorAudio: '/sounds/pares-minimos/facil/nivel1/indicador.mp3',
      selectableImage: '/images/pares-minimos/nivel1/selector.png',
      correctAudio: '/sounds/pares-minimos/facil/nivel1/correcto.mp3',
      incorrectAudio: '/sounds/pares-minimos/facil/nivel1/incorrecto.mp3',
      instructionsAudio: '/sounds/pares-minimos/facil/instrucciones/instrucciones1.mp3',
      successAudio: '/sounds/feedback/success.mp3',
      backgroundImage: '/images/pirate-island.png'
    }),
    '2': createLevelConfigParesMinimos({
      tiempoMaximo: 180,
      indicatorImage: '/images/pares-minimos/nivel2/indicador.png',
      indicatorAudio: '/sounds/pares-minimos/facil/nivel2/indicador.mp3',
      selectableImage: '/images/pares-minimos/nivel2/selector.png',
      correctAudio: '/sounds/pares-minimos/facil/nivel2/correcto.mp3',
      incorrectAudio: '/sounds/pares-minimos/facil/nivel2/incorrecto.mp3',
      instructionsAudio: '/sounds/pares-minimos/facil/instrucciones/instrucciones2.mp3',
      successAudio: '/sounds/feedback/success.mp3',
      backgroundImage: '/images/pirate-island.png'
    }),
    '3': createLevelConfigParesMinimos({
      tiempoMaximo: 180,
      indicatorImage: '/images/pares-minimos/nivel3/indicador.png',
      indicatorAudio: '/sounds/pares-minimos/facil/nivel3/indicador.mp3',
      selectableImage: '/images/pares-minimos/nivel3/selector.png',
      correctAudio: '/sounds/pares-minimos/facil/nivel3/correcto.mp3',
      incorrectAudio: '/sounds/pares-minimos/facil/nivel3/incorrecto.mp3',
      instructionsAudio: '/sounds/pares-minimos/facil/instrucciones/instrucciones3.mp3',
      successAudio: '/sounds/feedback/success.mp3',
      backgroundImage: '/images/pirate-island.png'
    }),
    '4': createLevelConfigParesMinimos({
      tiempoMaximo: 180,
      indicatorImage: '/images/pares-minimos/nivel4/indicador.png',
      indicatorAudio: '/sounds/pares-minimos/facil/nivel4/indicador.mp3',
      selectableImage: '/images/pares-minimos/nivel4/selector.png',
      correctAudio: '/sounds/pares-minimos/facil/nivel4/correcto.mp3',
      incorrectAudio: '/sounds/pares-minimos/facil/nivel4/incorrecto.mp3',
      instructionsAudio: '/sounds/pares-minimos/facil/instrucciones/instrucciones4.mp3',
      successAudio: '/sounds/feedback/success.mp3',
      backgroundImage: '/images/pirate-island.png'
    }),
    '5': createLevelConfigParesMinimos({
      tiempoMaximo: 180,
      indicatorImage: '/images/pares-minimos/nivel5/indicador.png',
      indicatorAudio: '/sounds/pares-minimos/facil/nivel5/indicador.mp3',
      selectableImage: '/images/pares-minimos/nivel5/selector.png',
      correctAudio: '/sounds/pares-minimos/facil/nivel5/correcto.mp3',
      incorrectAudio: '/sounds/pares-minimos/facil/nivel5/incorrecto.mp3',
      instructionsAudio: '/sounds/pares-minimos/facil/instrucciones/instrucciones5.mp3',
      successAudio: '/sounds/feedback/success.mp3',
      backgroundImage: '/images/pirate-island.png'
    }),
    '6': createLevelConfigParesMinimos({
      tiempoMaximo: 180,
      indicatorImage: '/images/pares-minimos/nivel6/indicador.png',
      indicatorAudio: '/sounds/pares-minimos/facil/nivel6/indicador.mp3',
      selectableImage: '/images/pares-minimos/nivel6/selector.png',
      correctAudio: '/sounds/pares-minimos/facil/nivel6/correcto.mp3',
      incorrectAudio: '/sounds/pares-minimos/facil/nivel6/incorrecto.mp3',
      instructionsAudio: '/sounds/pares-minimos/facil/instrucciones/instrucciones6.mp3',
      successAudio: '/sounds/feedback/success.mp3',
      backgroundImage: '/images/pirate-island.png'
    }),
    '7': createLevelConfigParesMinimos({
      tiempoMaximo: 180,
      indicatorImage: '/images/pares-minimos/nivel7/indicador.png',
      indicatorAudio: '/sounds/pares-minimos/facil/nivel7/indicador.mp3',
      selectableImage: '/images/pares-minimos/nivel7/selector.png',
      correctAudio: '/sounds/pares-minimos/facil/nivel7/correcto.mp3',
      incorrectAudio: '/sounds/pares-minimos/facil/nivel7/incorrecto.mp3',
      instructionsAudio: '/sounds/pares-minimos/facil/instrucciones/instrucciones7.mp3',
      successAudio: '/sounds/feedback/success.mp3',
      backgroundImage: '/images/pirate-island.png'
    }),
    '8': createLevelConfigParesMinimos({
      tiempoMaximo: 180,
      indicatorImage: '/images/pares-minimos/nivel8/indicador.png',
      indicatorAudio: '/sounds/pares-minimos/facil/nivel8/indicador.mp3',
      selectableImage: '/images/pares-minimos/nivel8/selector.png',
      correctAudio: '/sounds/pares-minimos/facil/nivel8/correcto.mp3',
      incorrectAudio: '/sounds/pares-minimos/facil/nivel8/incorrecto.mp3',
      instructionsAudio: '/sounds/pares-minimos/facil/instrucciones/instrucciones8.mp3',
      successAudio: '/sounds/feedback/success.mp3',
      backgroundImage: '/images/pirate-island.png'
    }),
    '9': createLevelConfigParesMinimos({
      tiempoMaximo: 180,
      indicatorImage: '/images/pares-minimos/nivel9/indicador.png',
      indicatorAudio: '/sounds/pares-minimos/facil/nivel9/indicador.mp3',
      selectableImage: '/images/pares-minimos/nivel9/selector.png',
      correctAudio: '/sounds/pares-minimos/facil/nivel9/correcto.mp3',
      incorrectAudio: '/sounds/pares-minimos/facil/nivel9/incorrecto.mp3',
      instructionsAudio: '/sounds/pares-minimos/facil/instrucciones/instrucciones9.mp3',
      successAudio: '/sounds/feedback/success.mp3',
      backgroundImage: '/images/pirate-island.png'
    }),
    '10': createLevelConfigParesMinimos({
      tiempoMaximo: 180,
      indicatorImage: '/images/pares-minimos/nivel10/indicador.png',
      indicatorAudio: '/sounds/pares-minimos/facil/nivel10/indicador.mp3',
      selectableImage: '/images/pares-minimos/nivel10/selector.png',
      correctAudio: '/sounds/pares-minimos/facil/nivel10/correcto.mp3',
      incorrectAudio: '/sounds/pares-minimos/facil/nivel10/incorrecto.mp3',
      instructionsAudio: '/sounds/pares-minimos/facil/instrucciones/instrucciones10.mp3',
      successAudio: '/sounds/feedback/success.mp3',
      backgroundImage: '/images/pirate-island.png'
    })
  };

  return configs[nivel] || configs['1'];
};
