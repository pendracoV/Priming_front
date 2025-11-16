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
  instructionsAudio: config.instructionsAudio || '/sounds/paresminimos/facil/instrucciones/instrucciones1.mp3',
  backgroundImage: config.backgroundImage || '/images/fondo_isla.png',
  successAudio: config.successAudio || '/sounds/paresminimos/facil/success/success.mp3',

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
      indicatorImage: '/images/paresminimos/medio/nivel1/pajaro1.png',
      indicatorAudio: '/sounds/paresminimos/medio/nivel1/bee.mp3',
      selectableImage: '/images/paresminimos/medio/nivel1/rama.gif',
      correctAudio: '/sounds/paresminimos/medio/nivel1/bee.mp3',
      incorrectAudio: '/sounds/paresminimos/medio/nivel1/pea.mp3',
      instructionsAudio: '/sounds/paresminimos/medio/instrucciones/instrucciones1.mp3',
      successAudio: '/sounds/paresminimos/medio/success/success1.mp3',
      backgroundImage: '/images/paresminimos/medio/nivel1/fondo_1.jpeg'
    }),
    '2': createLevelConfigParesMinimos({
      tiempoMaximo: 180,
      indicatorImage: '/images/paresminimos/medio/nivel2/calamar.png',
      indicatorAudio: '/sounds/paresminimos/medio/nivel2/trash.mp3',
      selectableImage: '/images/paresminimos/medio/nivel2/medusa.gif',
      correctAudio: '/sounds/paresminimos/medio/nivel2/trash.mp3',
      incorrectAudio: '/sounds/paresminimos/medio/nivel2/crash.mp3',
      instructionsAudio: '/sounds/paresminimos/medio/instrucciones/instrucciones2.mp3',
      successAudio: '/sounds/paresminimos/medio/success/success2.mp3',
      backgroundImage: '/images/paresminimos/medio/nivel2/fondo_2.jpeg'
    }),
    '3': createLevelConfigParesMinimos({
      tiempoMaximo: 180,
      indicatorImage: '/images/paresminimos/medio/nivel3/cañon.png',
      indicatorAudio: '/sounds/paresminimos/medio/nivel3/bark.mp3',
      selectableImage: '/images/paresminimos/medio/nivel3/bomba.gif',
      correctAudio: '/sounds/paresminimos/medio/nivel3/bark.mp3',
      incorrectAudio: '/sounds/paresminimos/medio/nivel3/park.mp3',
      instructionsAudio: '/sounds/paresminimos/medio/instrucciones/instrucciones3.mp3',
      successAudio: '/sounds/paresminimos/medio/success/success3.mp3',
      backgroundImage: '/images/paresminimos/medio/nivel3/fondo_3.jpeg'
    }),
    '4': createLevelConfigParesMinimos({
      tiempoMaximo: 180,
      indicatorImage: '/images/paresminimos/facil/nivel4/chaleco1.png',
      indicatorAudio: '/sounds/paresminimos/facil/nivel4/pen.mp3',
      selectableImage: '/images/paresminimos/facil/nivel4/chaleco.gif',
      correctAudio: '/sounds/paresminimos/facil/nivel4/pen.mp3',
      incorrectAudio: '/sounds/paresminimos/facil/nivel4/ten.mp3',
      instructionsAudio: '/sounds/paresminimos/facil/instrucciones/instrucciones4.mp3',
      successAudio: '/sounds/paresminimos/facil/success/success4.mp3',
      backgroundImage: '/images/paresminimos/facil/nivel4/fondo_4.jpeg'
    }),
    '5': createLevelConfigParesMinimos({
      tiempoMaximo: 180,
      indicatorImage: '/images/paresminimos/facil/nivel5/iceberg.png',
      indicatorAudio: '/sounds/paresminimos/facil/nivel5/big.mp3',
      selectableImage: '/images/paresminimos/facil/nivel5/hielo.gif',
      correctAudio: '/sounds/paresminimos/facil/nivel5/big.mp3',
      incorrectAudio: '/sounds/paresminimos/facil/nivel5/pig.mp3',
      instructionsAudio: '/sounds/paresminimos/facil/instrucciones/instrucciones5.mp3',
      successAudio: '/sounds/paresminimos/facil/success/success5.mp3',
      backgroundImage: '/images/paresminimos/facil/nivel5/fondo_5.jpeg'
    }),
    '6': createLevelConfigParesMinimos({
      tiempoMaximo: 180,
      indicatorImage: '/images/paresminimos/facil/nivel6/barco.png',
      indicatorAudio: '/sounds/paresminimos/facil/nivel6/boy.mp3',
      selectableImage: '/images/paresminimos/facil/nivel6/palanca.gif',
      correctAudio: '/sounds/paresminimos/facil/nivel6/boy.mp3',
      incorrectAudio: '/sounds/paresminimos/facil/nivel6/toy.mp3',
      instructionsAudio: '/sounds/paresminimos/facil/instrucciones/instrucciones6.mp3',
      successAudio: '/sounds/paresminimos/facil/success/success6.mp3',
      backgroundImage: '/images/paresminimos/facil/nivel6/fondo_6.jpeg'
    }),
    '7': createLevelConfigParesMinimos({
      tiempoMaximo: 180,
      indicatorImage: '/images/paresminimos/facil/nivel7/tabla.png',
      indicatorAudio: '/sounds/paresminimos/facil/nivel7/buy.mp3',
      selectableImage: '/images/paresminimos/facil/nivel7/tabla2.gif',
      correctAudio: '/sounds/paresminimos/facil/nivel7/buy.mp3',
      incorrectAudio: '/sounds/paresminimos/facil/nivel7/tie.mp3',
      instructionsAudio: '/sounds/paresminimos/facil/instrucciones/instrucciones7.mp3',
      successAudio: '/sounds/paresminimos/facil/success/success7.mp3',
      backgroundImage: '/images/paresminimos/facil/nivel7/fondo_7.jpeg'
    }),
    '8': createLevelConfigParesMinimos({
      tiempoMaximo: 180,
      indicatorImage: '/images/paresminimos/facil/nivel8/tiburon.png',
      indicatorAudio: '/sounds/paresminimos/facil/nivel8/ball.mp3',
      selectableImage: '/images/paresminimos/facil/nivel8/tiburon2.gif',
      correctAudio: '/sounds/paresminimos/facil/nivel8/ball.mp3',
      incorrectAudio: '/sounds/paresminimos/facil/nivel8/tall.mp3',
      instructionsAudio: '/sounds/paresminimos/facil/instrucciones/instrucciones8.mp3',
      successAudio: '/sounds/paresminimos/facil/success/success8.mp3',
      backgroundImage: '/images/paresminimos/facil/nivel8/fondo_8.jpeg'
    }),
    '9': createLevelConfigParesMinimos({
      tiempoMaximo: 180,
      indicatorImage: '/images/paresminimos/facil/nivel9/botella1.png',
      indicatorAudio: '/sounds/paresminimos/facil/nivel9/gag.mp3',
      selectableImage: '/images/paresminimos/facil/nivel9/botella2.gif',
      correctAudio: '/sounds/paresminimos/facil/nivel9/gag.mp3',
      incorrectAudio: '/sounds/paresminimos/facil/nivel9/bag.mp3',
      instructionsAudio: '/sounds/paresminimos/facil/instrucciones/instrucciones9.mp3',
      successAudio: '/sounds/paresminimos/facil/success/success9.mp3',
      backgroundImage: '/images/paresminimos/facil/nivel9/fondo_9.jpeg'
    }),
    '10': createLevelConfigParesMinimos({
      tiempoMaximo: 180,
      indicatorImage: '/images/paresminimos/facil/nivel10/caña.png',
      indicatorAudio: '/sounds/paresminimos/facil/nivel10/bald.mp3',
      selectableImage: '/images/paresminimos/facil/nivel10/gusano.gif',
      correctAudio: '/sounds/paresminimos/facil/nivel10/bald.mp3',
      incorrectAudio: '/sounds/paresminimos/facil/nivel10/gold.mp3',
      instructionsAudio: '/sounds/paresminimos/facil/instrucciones/instrucciones10.mp3',
      successAudio: '/sounds/paresminimos/facil/success/success10.mp3',
      backgroundImage: '/images/paresminimos/facil/nivel10/fondo_10.jpeg'
    })
  };

  return configs[nivel] || configs['1'];
};
