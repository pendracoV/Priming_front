// Configuraciones para Pares Mínimos - MEDIO (2 indicadores)
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
 * Crea la configuración completa de un nivel MEDIO de Pares Mínimos (2 indicadores)
 */
const createLevelConfigParesMinimosMedio = (config) => ({
  tiempoMaximo: config.tiempoMaximo || 240,
  instructionsAudio: config.instructionsAudio || '/sounds/pares-minimos/medio/instrucciones/instrucciones.mp3',
  backgroundImage: config.backgroundImage || '/images/pirate-island.png',
  successAudio: config.successAudio || '/sounds/feedback/success.mp3',
  
  // 2 indicadores para nivel medio
  indicators: [
    {
      id: 1,
      image: config.indicator1Image,
      audio: config.indicator1Audio,
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
  
  // 16 selectables: 8 para indicador 1 + 8 para indicador 2
  selectables: [
    // 4 correctos para indicador 1
    ...Array.from({ length: 4 }, (_, index) => ({
      id: index + 1,
      image: config.selectableImage,
      isCorrect: true,
      indicatorId: 1,
      audio: config.correct1Audio,
      scoring: baseScoringConfig,
      animations: correctElementAnimations,
      feedback: {
        ...baseFeedbackConfig,
        correctSound: config.correct1Audio,
        incorrectSound: config.incorrect1Audio,
        textColor: '#4CAF50'
      }
    })),
    
    // 4 incorrectos para indicador 1
    ...Array.from({ length: 4 }, (_, index) => ({
      id: index + 5,
      image: config.selectableImage,
      isCorrect: false,
      indicatorId: 1,
      audio: config.incorrect1Audio,
      scoring: baseScoringConfig,
      animations: incorrectElementAnimations,
      feedback: {
        ...baseFeedbackConfig,
        correctSound: config.correct1Audio,
        incorrectSound: config.incorrect1Audio,
        textColor: '#ff6b6b'
      }
    })),
    
    // 4 correctos para indicador 2
    ...Array.from({ length: 4 }, (_, index) => ({
      id: index + 9,
      image: config.selectableImage,
      isCorrect: true,
      indicatorId: 2,
      audio: config.correct2Audio,
      scoring: baseScoringConfig,
      animations: correctElementAnimations,
      feedback: {
        ...baseFeedbackConfig,
        correctSound: config.correct2Audio,
        incorrectSound: config.incorrect2Audio,
        textColor: '#4CAF50'
      }
    })),
    
    // 4 incorrectos para indicador 2
    ...Array.from({ length: 4 }, (_, index) => ({
      id: index + 13,
      image: config.selectableImage,
      isCorrect: false,
      indicatorId: 2,
      audio: config.incorrect2Audio,
      scoring: baseScoringConfig,
      animations: incorrectElementAnimations,
      feedback: {
        ...baseFeedbackConfig,
        correctSound: config.correct2Audio,
        incorrectSound: config.incorrect2Audio,
        textColor: '#ff6b6b'
      }
    }))
  ],
  
  gameMode: 'medio',
  trainingConfig: {
    totalClicks: 10, // 5 por cada indicador
    clicksPerIndicator: 5,
    indicatorCount: 2
  },
  winCondition: {
    requiredCorrect: 8, // 4 por cada indicador
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
 * Obtiene la configuración de un nivel específico de Pares Mínimos - MEDIO
 */
export const getNivelConfigParesMinimosMedio = (nivel) => {
  const configs = {
    '1': createLevelConfigParesMinimosMedio({
      tiempoMaximo: 240,
      indicator1Image: '/images/pares-minimos/medio/nivel1/indicador1.png',
      indicator1Audio: '/sounds/pares-minimos/medio/nivel1/indicador1.mp3',
      indicator2Image: '/images/pares-minimos/medio/nivel1/indicador2.png',
      indicator2Audio: '/sounds/pares-minimos/medio/nivel1/indicador2.mp3',
      selectableImage: '/images/pares-minimos/medio/nivel1/selector.png',
      correct1Audio: '/sounds/pares-minimos/medio/nivel1/correcto1.mp3',
      incorrect1Audio: '/sounds/pares-minimos/medio/nivel1/incorrecto1.mp3',
      correct2Audio: '/sounds/pares-minimos/medio/nivel1/correcto2.mp3',
      incorrect2Audio: '/sounds/pares-minimos/medio/nivel1/incorrecto2.mp3',
      instructionsAudio: '/sounds/pares-minimos/medio/instrucciones/instrucciones1.mp3',
      successAudio: '/sounds/feedback/success.mp3',
      backgroundImage: '/images/pirate-island.png'
    }),
    '2': createLevelConfigParesMinimosMedio({
      tiempoMaximo: 240,
      indicator1Image: '/images/pares-minimos/medio/nivel2/indicador1.png',
      indicator1Audio: '/sounds/pares-minimos/medio/nivel2/indicador1.mp3',
      indicator2Image: '/images/pares-minimos/medio/nivel2/indicador2.png',
      indicator2Audio: '/sounds/pares-minimos/medio/nivel2/indicador2.mp3',
      selectableImage: '/images/pares-minimos/medio/nivel2/selector.png',
      correct1Audio: '/sounds/pares-minimos/medio/nivel2/correcto1.mp3',
      incorrect1Audio: '/sounds/pares-minimos/medio/nivel2/incorrecto1.mp3',
      correct2Audio: '/sounds/pares-minimos/medio/nivel2/correcto2.mp3',
      incorrect2Audio: '/sounds/pares-minimos/medio/nivel2/incorrecto2.mp3',
      instructionsAudio: '/sounds/pares-minimos/medio/instrucciones/instrucciones2.mp3',
      successAudio: '/sounds/feedback/success.mp3',
      backgroundImage: '/images/pirate-island.png'
    }),
    '3': createLevelConfigParesMinimosMedio({
      tiempoMaximo: 240,
      indicator1Image: '/images/pares-minimos/medio/nivel3/indicador1.png',
      indicator1Audio: '/sounds/pares-minimos/medio/nivel3/indicador1.mp3',
      indicator2Image: '/images/pares-minimos/medio/nivel3/indicador2.png',
      indicator2Audio: '/sounds/pares-minimos/medio/nivel3/indicador2.mp3',
      selectableImage: '/images/pares-minimos/medio/nivel3/selector.png',
      correct1Audio: '/sounds/pares-minimos/medio/nivel3/correcto1.mp3',
      incorrect1Audio: '/sounds/pares-minimos/medio/nivel3/incorrecto1.mp3',
      correct2Audio: '/sounds/pares-minimos/medio/nivel3/correcto2.mp3',
      incorrect2Audio: '/sounds/pares-minimos/medio/nivel3/incorrecto2.mp3',
      instructionsAudio: '/sounds/pares-minimos/medio/instrucciones/instrucciones3.mp3',
      successAudio: '/sounds/feedback/success.mp3',
      backgroundImage: '/images/pirate-island.png'
    }),
    '4': createLevelConfigParesMinimosMedio({
      tiempoMaximo: 240,
      indicator1Image: '/images/pares-minimos/medio/nivel4/indicador1.png',
      indicator1Audio: '/sounds/pares-minimos/medio/nivel4/indicador1.mp3',
      indicator2Image: '/images/pares-minimos/medio/nivel4/indicador2.png',
      indicator2Audio: '/sounds/pares-minimos/medio/nivel4/indicador2.mp3',
      selectableImage: '/images/pares-minimos/medio/nivel4/selector.png',
      correct1Audio: '/sounds/pares-minimos/medio/nivel4/correcto1.mp3',
      incorrect1Audio: '/sounds/pares-minimos/medio/nivel4/incorrecto1.mp3',
      correct2Audio: '/sounds/pares-minimos/medio/nivel4/correcto2.mp3',
      incorrect2Audio: '/sounds/pares-minimos/medio/nivel4/incorrecto2.mp3',
      instructionsAudio: '/sounds/pares-minimos/medio/instrucciones/instrucciones4.mp3',
      successAudio: '/sounds/feedback/success.mp3',
      backgroundImage: '/images/pirate-island.png'
    }),
    '5': createLevelConfigParesMinimosMedio({
      tiempoMaximo: 240,
      indicator1Image: '/images/pares-minimos/medio/nivel5/indicador1.png',
      indicator1Audio: '/sounds/pares-minimos/medio/nivel5/indicador1.mp3',
      indicator2Image: '/images/pares-minimos/medio/nivel5/indicador2.png',
      indicator2Audio: '/sounds/pares-minimos/medio/nivel5/indicador2.mp3',
      selectableImage: '/images/pares-minimos/medio/nivel5/selector.png',
      correct1Audio: '/sounds/pares-minimos/medio/nivel5/correcto1.mp3',
      incorrect1Audio: '/sounds/pares-minimos/medio/nivel5/incorrecto1.mp3',
      correct2Audio: '/sounds/pares-minimos/medio/nivel5/correcto2.mp3',
      incorrect2Audio: '/sounds/pares-minimos/medio/nivel5/incorrecto2.mp3',
      instructionsAudio: '/sounds/pares-minimos/medio/instrucciones/instrucciones5.mp3',
      successAudio: '/sounds/feedback/success.mp3',
      backgroundImage: '/images/pirate-island.png'
    })
  };

  return configs[nivel] || configs['1'];
};
