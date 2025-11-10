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
  
  indicators: [
    {
      id: 1,
      image: config.indicator1Image,
      audio: config.indicator1Audio,
      group: 'group1',
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
      group: 'group2',
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
  
  // MEDIO: 9 selectables (4 del indicador 1 + 5 del indicador 2)
  // Todos son CORRECTOS - solo necesitan coincidir con el indicador correcto
  selectables: [
    // 4 elementos del indicador 1
    ...Array.from({ length: 4 }, (_, index) => ({
      id: `group1_${index + 1}`,
      image: config.selectableImage,
      isCorrect: true,
      indicatorId: 1,
      group: 'group1',
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
    
    // 5 elementos del indicador 2
    ...Array.from({ length: 5 }, (_, index) => ({
      id: `group2_${index + 1}`,
      image: config.selectableImage,
      isCorrect: true,
      indicatorId: 2,
      group: 'group2',
      audio: config.correct2Audio,
      scoring: baseScoringConfig,
      animations: correctElementAnimations,
      feedback: {
        ...baseFeedbackConfig,
        correctSound: config.correct2Audio,
        incorrectSound: config.incorrect2Audio,
        textColor: '#4CAF50'
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
    requiredCorrect: 9, // Todos los selectables (4 + 5)
    minimumScorePercentage: 0.8
  },
  totalCorrect: 9, // 4 del indicador 1 + 5 del indicador 2
  totalIncorrect: 0, // No hay incorrectos en medio
  totalSelectables: 9,
  
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
      indicator1Image: '/images/paresminimos/medio/nivel1/pajaro1.png',
      indicator1Audio: '/sounds/paresminimos/medio/nivel1/sun.mp3',
      indicator2Image: '/images/paresminimos/medio/nivel1/pajaro2.png',
      indicator2Audio: '/sounds/paresminimos/medio/nivel1/van.mp3',
      selectableImage: '/images/paresminimos/medio/nivel1/rama.gif',
      correct1Audio: '/sounds/paresminimos/medio/nivel1/sun.mp3',
      incorrect1Audio: '/sounds/paresminimos/medio/nivel1/van.mp3',
      correct2Audio: '/sounds/paresminimos/medio/nivel1/van.mp3',
      incorrect2Audio: '/sounds/paresminimos/medio/nivel1/sun.mp3',
      instructionsAudio: '/sounds/paresminimos/medio/instrucciones/instrucciones1.mp3',
      successAudio: '/sounds/paresminimos/medio/success/success1.mp3',
      backgroundImage: '/images/paresminimos/medio/nivel1/fondo_1.jpeg'
    }),
    '2': createLevelConfigParesMinimosMedio({
      tiempoMaximo: 240,
      indicator1Image: '/images/paresminimos/medio/nivel2/camino1.png',
      indicator1Audio: '/sounds/paresminimos/medio/nivel2/back.mp3',
      indicator2Image: '/images/paresminimos/medio/nivel2/camino2.png',
      indicator2Audio: '/sounds/paresminimos/medio/nivel2/sack.mp3',
      selectableImage: '/images/paresminimos/medio/nivel2/tortuga.gif',
      correct1Audio: '/sounds/paresminimos/medio/nivel2/back.mp3',
      incorrect1Audio: '/sounds/pares-minimos/medio/nivel2/sack.mp3',
      correct2Audio: '/sounds/paresminimos/medio/nivel2/sack.mp3',
      incorrect2Audio: '/sounds/paresminimos/medio/nivel2/back.mp3',
      instructionsAudio: '/sounds/paresminimos/medio/instrucciones/instrucciones2.mp3',
      successAudio: '/sounds/paresminimos/medio/success/success2.mp3',
      backgroundImage: '/images/paresminimos/medio/nivel2/fondo_2.jpeg'
    }),
    '3': createLevelConfigParesMinimosMedio({
      tiempoMaximo: 240,
      indicator1Image: '/images/paresminimos/medio/nivel3/bote1.png',
      indicator1Audio: '/sounds/paresminimos/medio/nivel3/tall.mp3',
      indicator2Image: '/images/paresminimos/medio/nivel3/bote2.png',
      indicator2Audio: '/sounds/paresminimos/medio/nivel3/ball.mp3',
      selectableImage: '/images/paresminimos/medio/nivel3/remos.gif',
      correct1Audio: '/sounds/paresminimos/medio/nivel3/tall.mp3',
      incorrect1Audio: '/sounds/paresminimos/medio/nivel3/ball.mp3',
      correct2Audio: '/sounds/paresminimos/medio/nivel3/ball.mp3',
      incorrect2Audio: '/sounds/paresminimos/medio/nivel3/tall.mp3',
      instructionsAudio: '/sounds/paresminimos/medio/instrucciones/instrucciones3.mp3',
      successAudio: '/sounds/paresminimos/medio/success/success3.mp3',
      backgroundImage: '/images/paresminimos/medio/nivel3/fondo_3.jpeg'
    }),
    '4': createLevelConfigParesMinimosMedio({
      tiempoMaximo: 240,
      indicator1Image: '/images/paresminimos/medio/nivel4/paisaje1.png',
      indicator1Audio: '/sounds/paresminimos/medio/nivel4/dead.mp3',
      indicator2Image: '/images/paresminimos/medio/nivel4/paisaje2.png',
      indicator2Audio: '/sounds/paresminimos/medio/nivel4/red.mp3',
      selectableImage: '/images/paresminimos/medio/nivel4/camara.gif',
      correct1Audio: '/sounds/paresminimos/medio/nivel4/dead.mp3',
      incorrect1Audio: '/sounds/paresminimos/medio/nivel4/red.mp3',
      correct2Audio: '/sounds/paresminimos/medio/nivel4/red.mp3',
      incorrect2Audio: '/sounds/paresminimos/medio/nivel4/dead.mp3',
      instructionsAudio: '/sounds/paresminimos/medio/instrucciones/instrucciones4.mp3',
      successAudio: '/sounds/paresminimos/medio/success/success4.mp3',
      backgroundImage: '/images/paresminimos/medio/nivel4/fondo_4.jpeg'
    }),
    '5': createLevelConfigParesMinimosMedio({
      tiempoMaximo: 240,
      indicator1Image: '/images/paresminimos/medio/nivel5/colchon1.png',
      indicator1Audio: '/sounds/paresminimos/medio/nivel5/beep.mp3',
      indicator2Image: '/images/paresminimos/medio/nivel5/colchon2.png',
      indicator2Audio: '/sounds/paresminimos/medio/nivel5/deep.mp3',
      selectableImage: '/images/paresminimos/medio/nivel5/sabana.gif',
      correct1Audio: '/sounds/paresminimos/medio/nivel5/beep.mp3',
      incorrect1Audio: '/sounds/paresminimos/medio/nivel5/deep.mp3',
      correct2Audio: '/sounds/paresminimos/medio/nivel5/deep.mp3',
      incorrect2Audio: '/sounds/paresminimos/medio/nivel5/beep.mp3',
      instructionsAudio: '/sounds/paresminimos/medio/instrucciones/instrucciones5.mp3',
      successAudio: '/sounds/paresminimos/medio/success/success5.mp3',
      backgroundImage: '/images/paresminimos/medio/nivel5/fondo_5.jpeg'
    })
  };

  return configs[nivel] || configs['1'];
};
