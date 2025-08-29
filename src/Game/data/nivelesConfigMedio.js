//src/Game/data/nivelesConfigMedio.js
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
   * Crea la configuración completa de un nivel MEDIO
   * @param {Object} config - Configuración del nivel
   * @returns {Object} Configuración completa del nivel
   */
  const createLevelConfigMedio = (config) => ({
    // Configuraciones básicas - MEDIO: 2 minutos 30 segundos
    tiempoMaximo: config.tiempoMaximo || 150, // 2:30 min
    instructionsAudio: config.instructionsAudio || '/sounds/cognados/medio/instrucciones/instrucciones.mp3',
    backgroundImage: config.backgroundImage || '/images/fondo_isla.png',
    successAudio: config.successAudio || '/sounds/cognados/facil/succes/success.mp3',
    
    // MODO MEDIO: 2 indicadores
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
      }
    ],
    
    // MEDIO: 9 selectables (4 del grupo 1 + 5 del grupo 2)
    selectables: [
      // 4 elementos del grupo 1 (indicador 1)
      ...Array.from({ length: 4 }, (_, index) => ({
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
      
      // 5 elementos del grupo 2 (indicador 2)
      ...Array.from({ length: 5 }, (_, index) => ({
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
      }))
    ],
    
    // Configuración específica del modo MEDIO
    gameMode: 'medio',
    trainingConfig: {
      totalClicks: 10, // 5 clicks por cada indicador
      clicksPerIndicator: 5,
      indicatorCount: 2
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
  
  // CONFIGURACIONES DE LOS 5 NIVELES MEDIO
  export const cognadosMedioNivel1 = createLevelConfigMedio({
    tiempoMaximo: 150,
    instructionsAudio: '/sounds/cognados/facil/instrucciones/instrucciones1.mp3',
    backgroundImage: '/images/cognados/medio/nivel1/fondo1.jpg',
    
    indicator1Image: '/images/cognados/medio/nivel1/cofre1.png',
    indicator1Audio: '/sounds/cognados/medio/nivel1/mangoE.mp3',
    
    indicator2Image: '/images/cognados/medio/nivel1/cofre2.png',
    indicator2Audio: '/sounds/cognados/medio/nivel1/mangoS.mp3',
    
    selectableImage: '/images/cognados/medio/nivel1/moneda.gif',

    successAudio: '/sounds/cognados/medio/succes/success1.mp3'
  });
  
  export const cognadosMedioNivel2 = createLevelConfigMedio({
    tiempoMaximo: 150,
    instructionsAudio: '/sounds/cognados/facil/instrucciones/instrucciones2.mp3',
    backgroundImage: '/images/cognados/medio/nivel2/fondo2.jpg',
    
    indicator1Image: '/images/cognados/medio/nivel2/contenedor.png',
    indicator1Audio: '/sounds/cognados/medio/nivel2/mandarina.mp3',
    
    indicator2Image: '/images/cognados/medio/nivel2/contenedor2.png',
    indicator2Audio: '/sounds/cognados/medio/nivel2/mandarine.mp3',
    
    selectableImage: '/images/cognados/medio/nivel2/botella.gif',
    
    successAudio: '/sounds/cognados/medio/succes/success1.mp3'
  });
  
  export const cognadosMedioNivel3 = createLevelConfigMedio({
    tiempoMaximo: 150,
    instructionsAudio: '/sounds/cognados/medio/instrucciones/instrucciones3.mp3',
    backgroundImage: '/images/cognados/medio/nivel3/fondo.png',
    
    indicator1Image: '/images/cognados/medio/nivel3/indicator1.png',
    indicator1Audio: '/sounds/cognados/medio/nivel3/audio1.mp3',
    
    indicator2Image: '/images/cognados/medio/nivel3/indicator2.png',
    indicator2Audio: '/sounds/cognados/medio/nivel3/audio2.mp3',
    
    selectableImage: '/images/cognados/medio/nivel3/selectable.png',
    
    successAudio: '/sounds/cognados/facil/succes/success.mp3'
  });
  
  export const cognadosMedioNivel4 = createLevelConfigMedio({
    tiempoMaximo: 150,
    instructionsAudio: '/sounds/cognados/medio/instrucciones/instrucciones4.mp3',
    backgroundImage: '/images/cognados/medio/nivel4/fondo.png',
    
    indicator1Image: '/images/cognados/medio/nivel4/indicator1.png',
    indicator1Audio: '/sounds/cognados/medio/nivel4/audio1.mp3',
    
    indicator2Image: '/images/cognados/medio/nivel4/indicator2.png',
    indicator2Audio: '/sounds/cognados/medio/nivel4/audio2.mp3',
    
    selectableImage: '/images/cognados/medio/nivel4/selectable.png',
    
    successAudio: '/sounds/cognados/facil/succes/success.mp3'
  });
  
  export const cognadosMedioNivel5 = createLevelConfigMedio({
    tiempoMaximo: 150,
    instructionsAudio: '/sounds/cognados/medio/instrucciones/instrucciones5.mp3',
    backgroundImage: '/images/cognados/medio/nivel5/fondo.png',
    
    indicator1Image: '/images/cognados/medio/nivel5/indicator1.png',
    indicator1Audio: '/sounds/cognados/medio/nivel5/audio1.mp3',
    
    indicator2Image: '/images/cognados/medio/nivel5/indicator2.png',
    indicator2Audio: '/sounds/cognados/medio/nivel5/audio2.mp3',
    
    selectableImage: '/images/cognados/medio/nivel5/selectable.png',
    
    successAudio: '/sounds/cognados/facil/succes/success.mp3'
  });
  
  /**
   * Función para obtener la configuración de niveles MEDIO
   */
  export const getNivelConfigMedio = (level) => {
    const medioLevels = {
      '1': cognadosMedioNivel1,
      '2': cognadosMedioNivel2,
      '3': cognadosMedioNivel3,
      '4': cognadosMedioNivel4,
      '5': cognadosMedioNivel5
    };
    return medioLevels[level] || null;
  };
  
  // Exportar configuraciones base
  export { 
    baseGameSettings, 
    baseAudioSettings, 
    baseUISettings,
    baseScoringConfig,
    baseFeedbackConfig,
    createLevelConfigMedio
  };