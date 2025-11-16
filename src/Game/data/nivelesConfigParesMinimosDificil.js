// Configuraciones para Pares Mínimos - DIFÍCIL (3 indicadores)
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
 * Crea la configuración completa de un nivel DIFÍCIL de Pares Mínimos (3 indicadores)
 */
const createLevelConfigParesMinimosDificil = (config) => ({
  tiempoMaximo: config.tiempoMaximo || 90, // 1:30 min como Cognados Difícil
  instructionsAudio: config.instructionsAudio || '/sounds/paresminimos/dificil/instrucciones/instrucciones.mp3',
  backgroundImage: config.backgroundImage || '/images/pirate-island.png',
  successAudio: config.successAudio || '/sounds/feedback/success.mp3',
  
  // 3 indicadores para nivel difícil
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
    },
    {
      id: 3,
      image: config.indicator3Image,
      audio: config.indicator3Audio,
      group: 'group3',
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
  
  // DIFÍCIL: 9 selectables (3 del indicador 1 + 3 del indicador 2 + 3 del indicador 3)
  // Todos son CORRECTOS - solo necesitan coincidir con el indicador correcto
  selectables: [
    // 3 elementos del indicador 1
    ...Array.from({ length: 3 }, (_, index) => ({
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
    
    // 3 elementos del indicador 2
    ...Array.from({ length: 3 }, (_, index) => ({
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
    })),
    
    // 3 elementos del indicador 3
    ...Array.from({ length: 3 }, (_, index) => ({
      id: `group3_${index + 1}`,
      image: config.selectableImage,
      isCorrect: true,
      indicatorId: 3,
      group: 'group3',
      audio: config.correct3Audio,
      scoring: baseScoringConfig,
      animations: correctElementAnimations,
      feedback: {
        ...baseFeedbackConfig,
        correctSound: config.correct3Audio,
        incorrectSound: config.incorrect3Audio,
        textColor: '#4CAF50'
      }
    }))
  ],
  
  gameMode: 'dificil',
  trainingConfig: {
    totalClicks: 15, // 5 por cada indicador (3 indicadores)
    clicksPerIndicator: 5,
    indicatorCount: 3
  },
  winCondition: {
    requiredCorrect: 9, // 3 por cada indicador
    minimumScorePercentage: 0.8
  },
  totalCorrect: 9,
  totalIncorrect: 0,
  totalSelectables: 9,
  
  gameSettings: baseGameSettings,
  audioSettings: baseAudioSettings,
  uiSettings: baseUISettings,
  baseScoringConfig,
  baseFeedbackConfig
});

/**
 * Obtiene la configuración de un nivel específico de Pares Mínimos - DIFÍCIL
 */
export const getNivelConfigParesMinimosDificil = (nivel) => {
  const configs = {
    '1': createLevelConfigParesMinimosDificil({
      tiempoMaximo: 90,
      indicator1Image: '/images/paresminimos/dificil/nivel1/carne.png',
      indicator1Audio: '/sounds/paresminimos/dificil/nivel1/bee.mp3',
      indicator2Image: '/images/paresminimos/dificil/nivel1/huevo.png',
      indicator2Audio: '/sounds/paresminimos/dificil/nivel1/pea.mp3',
      indicator3Image: '/images/paresminimos/dificil/nivel1/pancakes.png',
      indicator3Audio: '/sounds/paresminimos/dificil/nivel1/sun.mp3',
      selectableImage: '/images/paresminimos/dificil/nivel1/salero.gif',
      correct1Audio: '/sounds/paresminimos/dificil/nivel1/bee.mp3',
      incorrect1Audio: '/sounds/paresminimos/dificil/nivel1/pea.mp3',
      correct2Audio: '/sounds/paresminimos/dificil/nivel1/pea.mp3',
      incorrect2Audio: '/sounds/paresminimos/dificil/nivel1/bee.mp3',
      correct3Audio: '/sounds/paresminimos/dificil/nivel1/sun.mp3',
      incorrect3Audio: '/sounds/paresminimos/dificil/nivel1/bee.mp3',
      instructionsAudio: '/sounds/paresminimos/dificil/instrucciones/instrucciones1.mp3',
      successAudio: '/sounds/paresminimos/dificil/success/success1.mp3',
      backgroundImage: '/images/paresminimos/dificil/nivel1/fondo_1.jpeg'
    }),
    '2': createLevelConfigParesMinimosDificil({
      tiempoMaximo: 90,
      indicator1Image: '/images/paresminimos/dificil/nivel2/vidrio.png',
      indicator1Audio: '/sounds/paresminimos/dificil/nivel2/crash.mp3',
      indicator2Image: '/images/paresminimos/dificil/nivel2/vidrio.png',
      indicator2Audio: '/sounds/paresminimos/dificil/nivel2/ball.mp3',
      indicator3Image: '/images/paresminimos/dificil/nivel2/vidrio.png',
      indicator3Audio: '/sounds/paresminimos/dificil/nivel2/trash.mp3',
      selectableImage: '/images/paresminimos/dificil/nivel2/silicon.gif',
      correct1Audio: '/sounds/paresminimos/dificil/nivel2/crash.mp3',
      incorrect1Audio: '/sounds/paresminimos/dificil/nivel2/ball.mp3',
      correct2Audio: '/sounds/paresminimos/dificil/nivel2/ball.mp3',
      incorrect2Audio: '/sounds/paresminimos/dificil/nivel2/crash.mp3',
      correct3Audio: '/sounds/paresminimos/dificil/nivel2/trash.mp3',
      incorrect3Audio: '/sounds/paresminimos/dificil/nivel2/crash.mp3',
      instructionsAudio: '/sounds/paresminimos/dificil/instrucciones/instrucciones2.mp3',
      successAudio: '/sounds/paresminimos/dificil/success/success2.mp3',
      backgroundImage: '/images/paresminimos/dificil/nivel2/fondo_2.jpeg'
    }),
    '3': createLevelConfigParesMinimosDificil({
      tiempoMaximo: 90,
      indicator1Image: '/images/paresminimos/dificil/nivel3/telescopio1.png',
      indicator1Audio: '/sounds/paresminimos/dificil/nivel3/bag.mp3',
      indicator2Image: '/images/paresminimos/dificil/nivel3/telescopio2.png',
      indicator2Audio: '/sounds/paresminimos/dificil/nivel3/park.mp3',
      indicator3Image: '/images/paresminimos/dificil/nivel3/telescopio3.png',
      indicator3Audio: '/sounds/paresminimos/dificil/nivel3/bark.mp3',
      selectableImage: '/images/paresminimos/dificil/nivel3/lente.gif',
      correct1Audio: '/sounds/paresminimos/dificil/nivel3/bag.mp3',
      incorrect1Audio: '/sounds/paresminimos/dificil/nivel3/park.mp3',
      correct2Audio: '/sounds/paresminimos/dificil/nivel3/park.mp3',
      incorrect2Audio: '/sounds/paresminimos/dificil/nivel3/bark.mp3',
      correct3Audio: '/sounds/paresminimos/dificil/nivel3/bark.mp3',
      incorrect3Audio: '/sounds/paresminimos/dificil/nivel3/park.mp3',
      instructionsAudio: '/sounds/paresminimos/dificil/instrucciones/instrucciones3.mp3',
      successAudio: '/sounds/paresminimos/dificil/success/success3.mp3',
      backgroundImage: '/images/paresminimos/dificil/nivel3/fondo_3.jpeg'
    }),
    '4': createLevelConfigParesMinimosDificil({
      tiempoMaximo: 90,
      indicator1Image: '/images/paresminimos/dificil/nivel4/escalera1.png',
      indicator1Audio: '/sounds/paresminimos/dificil/nivel4/pen.mp3',
      indicator2Image: '/images/paresminimos/dificil/nivel4/escalera2.png',
      indicator2Audio: '/sounds/paresminimos/dificil/nivel4/ten.mp3',
      indicator3Image: '/images/paresminimos/dificil/nivel4/escalera3.png',
      indicator3Audio: '/sounds/paresminimos/dificil/nivel4/gag.mp3',
      selectableImage: '/images/paresminimos/dificil/nivel4/clavos.gif',
      correct1Audio: '/sounds/paresminimos/dificil/nivel4/pen.mp3',
      incorrect1Audio: '/sounds/paresminimos/dificil/nivel4/ten.mp3',
      correct2Audio: '/sounds/paresminimos/dificil/nivel4/ten.mp3',
      incorrect2Audio: '/sounds/paresminimos/dificil/nivel4/pen.mp3',
      correct3Audio: '/sounds/paresminimos/dificil/nivel4/gag.mp3',
      incorrect3Audio: '/sounds/paresminimos/dificil/nivel4/pen.mp3',
      instructionsAudio: '/sounds/paresminimos/dificil/instrucciones/instrucciones4.mp3',
      successAudio: '/sounds/paresminimos/dificil/success/success4.mp3',
      backgroundImage: '/images/paresminimos/dificil/nivel4/fondo_4.jpeg'
    }),
    '5': createLevelConfigParesMinimosDificil({
      tiempoMaximo: 90,
      indicator1Image: '/images/paresminimos/dificil/nivel5/cofre1.png',
      indicator1Audio: '/sounds/paresminimos/dificil/nivel5/big.mp3',
      indicator2Image: '/images/paresminimos/dificil/nivel5/cofre2.png',
      indicator2Audio: '/sounds/paresminimos/dificil/nivel5/pig.mp3',
      indicator3Image: '/images/paresminimos/dificil/nivel5/cofre3.png',
      indicator3Audio: '/sounds/paresminimos/dificil/nivel5/buy.mp3',
      selectableImage: '/images/paresminimos/dificil/nivel5/iman.gif',
      correct1Audio: '/sounds/paresminimos/dificil/nivel5/big.mp3',
      incorrect1Audio: '/sounds/paresminimos/dificil/nivel5/pig.mp3',
      correct2Audio: '/sounds/paresminimos/dificil/nivel5/pig.mp3',
      incorrect2Audio: '/sounds/paresminimos/dificil/nivel5/buy.mp3',
      correct3Audio: '/sounds/paresminimos/dificil/nivel5/buy.mp3',
      incorrect3Audio: '/sounds/paresminimos/dificil/nivel5/pig.mp3',
      instructionsAudio: '/sounds/paresminimos/dificil/instrucciones/instruccionesu5.mp3',
      successAudio: '/sounds/paresminimos/dificil/success/success5.mp3',
      backgroundImage: '/images/paresminimos/dificil/nivel5/fondo_5.jpeg'
    })
  };

  return configs[nivel] || configs['1'];
};
