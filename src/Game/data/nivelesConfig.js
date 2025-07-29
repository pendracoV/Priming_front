// src/data/nivelesConfig.js
// Archivo de configuración para todos los niveles - Versión Actualizada

// Configuración específica para el Nivel 1 de Cognados en modo Fácil
export const cognadosFacilNivel1 = {
  tiempoMaximo: 180, // 3 minutos en segundos
  
  // Audio de instrucciones iniciales
  instructionsAudio: '/audios/instrucciones/cognados_facil_instrucciones.mp3',
  
  // Configuración de indicadores (cocodrilo)
  indicators: [
    {
      id: 1,
      image: '/images/cocodrilo.png',
      audio: '/sounds/cognados/facil/nivel1/indicador.mp3',
      
      // Configuraciones de animación
      animations: {
        hover: {
          scale: 1.1,
          duration: 0.2,
          ease: 'ease-out'
        },
        click: {
          scale: 0.95,
          duration: 0.1,
          ease: 'ease-in'
        },
        idle: {
          // Animación sutil cuando está inactivo
          bobbing: {
            translateY: [-2, 2],
            duration: 2,
            repeat: 'infinite',
            ease: 'ease-in-out'
          }
        }
      },
      
      // Configuraciones de interacción - Clickeable durante entrenamiento
      interaction: {
        clickable: true, // Clickeable durante el entrenamiento
        playAudioOnClick: true,
        autoPlay: false, // NO se reproduce automáticamente
        showRippleEffect: true,
        vibrate: 50 // Vibración en dispositivos móviles (ms)
      }
    }
  ],
  
  // Configuración de selectores
  selectables: [
    // 8 selectores correctos (cognados en inglés)
    { 
      id: 1, 
      image: '/images/cognados/fish.png', 
      isCorrect: true, 
      indicatorId: 1,
      audio: '/sounds/cognados/facil/nivel1/indicador.mp3',
      
      // Configuraciones específicas para elementos correctos
      scoring: {
        pointsOnCorrect: 10,
        pointsOnIncorrect: -10,
        showPointsAnimation: true,
        animationDuration: 1000
      },
      
      animations: {
        hover: {
          scale: 1.05,
          duration: 0.2,
          borderGlow: true,
          glowColor: '#4CAF50'
        },
        click: {
          scale: 0.9,
          duration: 0.15
        },
        correct: {
          scale: [1, 1.2, 1],
          rotation: [0, 5, -5, 0],
          duration: 0.6,
          borderColor: '#4CAF50',
          glow: true
        },
        disabled: {
          opacity: 0.4,
          scale: 1,
          grayscale: 1
        }
      },
      
      feedback: {
        correctSound: '/sounds/cognados/facil/nivel1/indicador.mp3',
        incorrectSound: '/sounds/cognados/facil/nivel1/indicador0.mp3',
        correctMessage: '¡Correcto! +10 monedas',
        incorrectMessage: 'Incorrecto -10 monedas',
        showFloatingText: true,
        textColor: '#4CAF50',
        textDuration: 1500
      }
    },
    { 
      id: 2, 
      image: '/images/cognados/fish.png', 
      isCorrect: true, 
      indicatorId: 1,
      audio: '/sounds/cognados/facil/nivel1/indicador.mp3',
      scoring: { pointsOnCorrect: 10, pointsOnIncorrect: -10, showPointsAnimation: true, animationDuration: 1000 },
      animations: {
        hover: { scale: 1.05, duration: 0.2, borderGlow: true, glowColor: '#4CAF50' },
        click: { scale: 0.9, duration: 0.15 },
        correct: { scale: [1, 1.2, 1], rotation: [0, 5, -5, 0], duration: 0.6, borderColor: '#4CAF50', glow: true },
        disabled: { opacity: 0.4, scale: 1, grayscale: 1 }
      },
      feedback: {
        correctSound: '/sounds/cognados/facil/nivel1/indicador.mp3',
        incorrectSound: '/sounds/cognados/facil/nivel1/indicador0.mp3',
        correctMessage: '¡Correcto! +10 monedas',
        incorrectMessage: 'Incorrecto -10 monedas',
        showFloatingText: true,
        textColor: '#4CAF50',
        textDuration: 1500
      }
    },
    { 
      id: 3, 
      image: '/images/cognados/fish.png', 
      isCorrect: true, 
      indicatorId: 1,
      audio: '/sounds/cognados/facil/nivel1/indicador.mp3',
      scoring: { pointsOnCorrect: 10, pointsOnIncorrect: -10, showPointsAnimation: true, animationDuration: 1000 },
      animations: {
        hover: { scale: 1.05, duration: 0.2, borderGlow: true, glowColor: '#4CAF50' },
        click: { scale: 0.9, duration: 0.15 },
        correct: { scale: [1, 1.2, 1], rotation: [0, 5, -5, 0], duration: 0.6, borderColor: '#4CAF50', glow: true },
        disabled: { opacity: 0.4, scale: 1, grayscale: 1 }
      },
      feedback: {
        correctSound: '/sounds/cognados/facil/nivel1/indicador.mp3',
        incorrectSound: '/sounds/cognados/facil/nivel1/indicador0.mp3',
        correctMessage: '¡Correcto! +10 monedas',
        incorrectMessage: 'Incorrecto -10 monedas',
        showFloatingText: true,
        textColor: '#4CAF50',
        textDuration: 1500
      }
    },
    { 
      id: 4, 
      image: '/images/cognados/fish.png', 
      isCorrect: true, 
      indicatorId: 1,
      audio: '/sounds/cognados/facil/nivel1/indicador.mp3',
      scoring: { pointsOnCorrect: 10, pointsOnIncorrect: -10, showPointsAnimation: true, animationDuration: 1000 },
      animations: {
        hover: { scale: 1.05, duration: 0.2, borderGlow: true, glowColor: '#4CAF50' },
        click: { scale: 0.9, duration: 0.15 },
        correct: { scale: [1, 1.2, 1], rotation: [0, 5, -5, 0], duration: 0.6, borderColor: '#4CAF50', glow: true },
        disabled: { opacity: 0.4, scale: 1, grayscale: 1 }
      },
      feedback: {
        correctSound: '/sounds/cognados/facil/nivel1/indicador.mp3',
        incorrectSound: '/sounds/cognados/facil/nivel1/indicador0.mp3',
        correctMessage: '¡Correcto! +10 monedas',
        incorrectMessage: 'Incorrecto -10 monedas',
        showFloatingText: true,
        textColor: '#4CAF50',
        textDuration: 1500
      }
    },
    { 
      id: 5, 
      image: '/images/cognados/fish.png', 
      isCorrect: true, 
      indicatorId: 1,
      audio: '/sounds/cognados/facil/nivel1/indicador.mp3',
      scoring: { pointsOnCorrect: 10, pointsOnIncorrect: -10, showPointsAnimation: true, animationDuration: 1000 },
      animations: {
        hover: { scale: 1.05, duration: 0.2, borderGlow: true, glowColor: '#4CAF50' },
        click: { scale: 0.9, duration: 0.15 },
        correct: { scale: [1, 1.2, 1], rotation: [0, 5, -5, 0], duration: 0.6, borderColor: '#4CAF50', glow: true },
        disabled: { opacity: 0.4, scale: 1, grayscale: 1 }
      },
      feedback: {
        correctSound: '/sounds/cognados/facil/nivel1/indicador.mp3',
        incorrectSound: '/sounds/cognados/facil/nivel1/indicador0.mp3',
        correctMessage: '¡Correcto! +10 monedas',
        incorrectMessage: 'Incorrecto -10 monedas',
        showFloatingText: true,
        textColor: '#4CAF50',
        textDuration: 1500
      }
    },
    { 
      id: 6, 
      image: '/images/cognados/fish.png', 
      isCorrect: true, 
      indicatorId: 1,
      audio: '/sounds/cognados/facil/nivel1/indicador.mp3',
      scoring: { pointsOnCorrect: 10, pointsOnIncorrect: -10, showPointsAnimation: true, animationDuration: 1000 },
      animations: {
        hover: { scale: 1.05, duration: 0.2, borderGlow: true, glowColor: '#4CAF50' },
        click: { scale: 0.9, duration: 0.15 },
        correct: { scale: [1, 1.2, 1], rotation: [0, 5, -5, 0], duration: 0.6, borderColor: '#4CAF50', glow: true },
        disabled: { opacity: 0.4, scale: 1, grayscale: 1 }
      },
      feedback: {
        correctSound: '/sounds/cognados/facil/nivel1/indicador.mp3',
        incorrectSound: '/sounds/cognados/facil/nivel1/indicador0.mp3',
        correctMessage: '¡Correcto! +10 monedas',
        incorrectMessage: 'Incorrecto -10 monedas',
        showFloatingText: true,
        textColor: '#4CAF50',
        textDuration: 1500
      }
    },
    { 
      id: 7, 
      image: '/images/cognados/fish.png', 
      isCorrect: true, 
      indicatorId: 1,
      audio: '/sounds/cognados/facil/nivel1/indicador.mp3',
      scoring: { pointsOnCorrect: 10, pointsOnIncorrect: -10, showPointsAnimation: true, animationDuration: 1000 },
      animations: {
        hover: { scale: 1.05, duration: 0.2, borderGlow: true, glowColor: '#4CAF50' },
        click: { scale: 0.9, duration: 0.15 },
        correct: { scale: [1, 1.2, 1], rotation: [0, 5, -5, 0], duration: 0.6, borderColor: '#4CAF50', glow: true },
        disabled: { opacity: 0.4, scale: 1, grayscale: 1 }
      },
      feedback: {
        correctSound: '/sounds/cognados/facil/nivel1/indicador.mp3',
        incorrectSound: '/sounds/cognados/facil/nivel1/indicador0.mp3',
        correctMessage: '¡Correcto! +10 monedas',
        incorrectMessage: 'Incorrecto -10 monedas',
        showFloatingText: true,
        textColor: '#4CAF50',
        textDuration: 1500
      }
    },
    { 
      id: 8, 
      image: '/images/cognados/fish.png', 
      isCorrect: true, 
      indicatorId: 1,
      audio: '/sounds/cognados/facil/nivel1/indicador.mp3',
      scoring: { pointsOnCorrect: 10, pointsOnIncorrect: -10, showPointsAnimation: true, animationDuration: 1000 },
      animations: {
        hover: { scale: 1.05, duration: 0.2, borderGlow: true, glowColor: '#4CAF50' },
        click: { scale: 0.9, duration: 0.15 },
        correct: { scale: [1, 1.2, 1], rotation: [0, 5, -5, 0], duration: 0.6, borderColor: '#4CAF50', glow: true },
        disabled: { opacity: 0.4, scale: 1, grayscale: 1 }
      },
      feedback: {
        correctSound: '/sounds/cognados/facil/nivel1/indicador.mp3',
        incorrectSound: '/sounds/cognados/facil/nivel1/indicador0.mp3',
        correctMessage: '¡Correcto! +10 monedas',
        incorrectMessage: 'Incorrecto -10 monedas',
        showFloatingText: true,
        textColor: '#4CAF50',
        textDuration: 1500
      }
    },
    
    // 8 selectores incorrectos (palabras en español)
    { 
      id: 9, 
      image: '/images/cognados/fish.png', 
      isCorrect: false, 
      indicatorId: 1,
      audio: '/sounds/cognados/facil/nivel1/indicador0.mp3',
      
      scoring: {
        pointsOnCorrect: 10,
        pointsOnIncorrect: -10,
        showPointsAnimation: true,
        animationDuration: 1000
      },
      
      animations: {
        hover: {
          scale: 1.05,
          duration: 0.2,
          borderGlow: true,
          glowColor: '#ff6b6b'
        },
        click: {
          scale: 0.9,
          duration: 0.15
        },
        incorrect: {
          shake: true,
          shakeIntensity: 10,
          duration: 0.5,
          borderColor: '#ff6b6b',
          flashColor: '#ff6b6b'
        },
        disabled: {
          opacity: 0.4,
          scale: 1,
          grayscale: 1
        }
      },
      
      feedback: {
        correctSound: '/sounds/cognados/facil/nivel1/indicador.mp3',
        incorrectSound: '/sounds/cognados/facil/nivel1/indicador0.mp3',
        correctMessage: '¡Correcto! +10 monedas',
        incorrectMessage: 'Incorrecto -10 monedas',
        showFloatingText: true,
        textColor: '#ff6b6b',
        textDuration: 1500
      }
    },
    { 
      id: 10, 
      image: '/images/cognados/fish.png', 
      isCorrect: false, 
      indicatorId: 1,
      audio: '/sounds/cognados/facil/nivel1/indicador0.mp3',
      scoring: { pointsOnCorrect: 10, pointsOnIncorrect: -10, showPointsAnimation: true, animationDuration: 1000 },
      animations: {
        hover: { scale: 1.05, duration: 0.2, borderGlow: true, glowColor: '#ff6b6b' },
        click: { scale: 0.9, duration: 0.15 },
        incorrect: { shake: true, shakeIntensity: 10, duration: 0.5, borderColor: '#ff6b6b', flashColor: '#ff6b6b' },
        disabled: { opacity: 0.4, scale: 1, grayscale: 1 }
      },
      feedback: {
        correctSound: '/sounds/cognados/facil/nivel1/indicador.mp3',
        incorrectSound: '/sounds/cognados/facil/nivel1/indicador0.mp3',
        correctMessage: '¡Correcto! +10 monedas',
        incorrectMessage: 'Incorrecto -10 monedas',
        showFloatingText: true,
        textColor: '#ff6b6b',
        textDuration: 1500
      }
    },
    { 
      id: 11, 
      image: '/images/cognados/fish.png', 
      isCorrect: false, 
      indicatorId: 1,
      audio: '/sounds/cognados/facil/nivel1/indicador0.mp3',
      scoring: { pointsOnCorrect: 10, pointsOnIncorrect: -10, showPointsAnimation: true, animationDuration: 1000 },
      animations: {
        hover: { scale: 1.05, duration: 0.2, borderGlow: true, glowColor: '#ff6b6b' },
        click: { scale: 0.9, duration: 0.15 },
        incorrect: { shake: true, shakeIntensity: 10, duration: 0.5, borderColor: '#ff6b6b', flashColor: '#ff6b6b' },
        disabled: { opacity: 0.4, scale: 1, grayscale: 1 }
      },
      feedback: {
        correctSound: '/sounds/cognados/facil/nivel1/indicador.mp3',
        incorrectSound: '/sounds/cognados/facil/nivel1/indicador0.mp3',
        correctMessage: '¡Correcto! +10 monedas',
        incorrectMessage: 'Incorrecto -10 monedas',
        showFloatingText: true,
        textColor: '#ff6b6b',
        textDuration: 1500
      }
    },
    { 
      id: 12, 
      image: '/images/cognados/fish.png', 
      isCorrect: false, 
      indicatorId: 1,
      audio: '/sounds/cognados/facil/nivel1/indicador0.mp3',
      scoring: { pointsOnCorrect: 10, pointsOnIncorrect: -10, showPointsAnimation: true, animationDuration: 1000 },
      animations: {
        hover: { scale: 1.05, duration: 0.2, borderGlow: true, glowColor: '#ff6b6b' },
        click: { scale: 0.9, duration: 0.15 },
        incorrect: { shake: true, shakeIntensity: 10, duration: 0.5, borderColor: '#ff6b6b', flashColor: '#ff6b6b' },
        disabled: { opacity: 0.4, scale: 1, grayscale: 1 }
      },
      feedback: {
        correctSound: '/sounds/cognados/facil/nivel1/indicador.mp3',
        incorrectSound: '/sounds/cognados/facil/nivel1/indicador0.mp3',
        correctMessage: '¡Correcto! +10 monedas',
        incorrectMessage: 'Incorrecto -10 monedas',
        showFloatingText: true,
        textColor: '#ff6b6b',
        textDuration: 1500
      }
    },
    { 
      id: 13, 
      image: '/images/cognados/fish.png', 
      isCorrect: false, 
      indicatorId: 1,
      audio: '/sounds/cognados/facil/nivel1/indicador0.mp3',
      scoring: { pointsOnCorrect: 10, pointsOnIncorrect: -10, showPointsAnimation: true, animationDuration: 1000 },
      animations: {
        hover: { scale: 1.05, duration: 0.2, borderGlow: true, glowColor: '#ff6b6b' },
        click: { scale: 0.9, duration: 0.15 },
        incorrect: { shake: true, shakeIntensity: 10, duration: 0.5, borderColor: '#ff6b6b', flashColor: '#ff6b6b' },
        disabled: { opacity: 0.4, scale: 1, grayscale: 1 }
      },
      feedback: {
        correctSound: '/sounds/cognados/facil/nivel1/indicador.mp3',
        incorrectSound: '/sounds/cognados/facil/nivel1/indicador0.mp3',
        correctMessage: '¡Correcto! +10 monedas',
        incorrectMessage: 'Incorrecto -10 monedas',
        showFloatingText: true,
        textColor: '#ff6b6b',
        textDuration: 1500
      }
    },
    { 
      id: 14, 
      image: '/images/cognados/fish.png', 
      isCorrect: false, 
      indicatorId: 1,
      audio: '/sounds/cognados/facil/nivel1/indicador0.mp3',
      scoring: { pointsOnCorrect: 10, pointsOnIncorrect: -10, showPointsAnimation: true, animationDuration: 1000 },
      animations: {
        hover: { scale: 1.05, duration: 0.2, borderGlow: true, glowColor: '#ff6b6b' },
        click: { scale: 0.9, duration: 0.15 },
        incorrect: { shake: true, shakeIntensity: 10, duration: 0.5, borderColor: '#ff6b6b', flashColor: '#ff6b6b' },
        disabled: { opacity: 0.4, scale: 1, grayscale: 1 }
      },
      feedback: {
        correctSound: '/sounds/cognados/facil/nivel1/indicador.mp3',
        incorrectSound: '/sounds/cognados/facil/nivel1/indicador0.mp3',
        correctMessage: '¡Correcto! +10 monedas',
        incorrectMessage: 'Incorrecto -10 monedas',
        showFloatingText: true,
        textColor: '#ff6b6b',
        textDuration: 1500
      }
    },
    { 
      id: 15, 
      image: '/images/cognados/fish.png', 
      isCorrect: false, 
      indicatorId: 1,
      audio: '/sounds/cognados/facil/nivel1/indicador0.mp3',
      scoring: { pointsOnCorrect: 10, pointsOnIncorrect: -10, showPointsAnimation: true, animationDuration: 1000 },
      animations: {
        hover: { scale: 1.05, duration: 0.2, borderGlow: true, glowColor: '#ff6b6b' },
        click: { scale: 0.9, duration: 0.15 },
        incorrect: { shake: true, shakeIntensity: 10, duration: 0.5, borderColor: '#ff6b6b', flashColor: '#ff6b6b' },
        disabled: { opacity: 0.4, scale: 1, grayscale: 1 }
      },
      feedback: {
        correctSound: '/sounds/cognados/facil/nivel1/indicador.mp3',
        incorrectSound: '/sounds/cognados/facil/nivel1/indicador0.mp3',
        correctMessage: '¡Correcto! +10 monedas',
        incorrectMessage: 'Incorrecto -10 monedas',
        showFloatingText: true,
        textColor: '#ff6b6b',
        textDuration: 1500
      }
    },
    { 
      id: 16, 
      image: '/images/cognados/fish.png', 
      isCorrect: false, 
      indicatorId: 1,
      audio: '/sounds/cognados/facil/nivel1/indicador0.mp3',
      scoring: { pointsOnCorrect: 10, pointsOnIncorrect: -10, showPointsAnimation: true, animationDuration: 1000 },
      animations: {
        hover: { scale: 1.05, duration: 0.2, borderGlow: true, glowColor: '#ff6b6b' },
        click: { scale: 0.9, duration: 0.15 },
        incorrect: { shake: true, shakeIntensity: 10, duration: 0.5, borderColor: '#ff6b6b', flashColor: '#ff6b6b' },
        disabled: { opacity: 0.4, scale: 1, grayscale: 1 }
      },
      feedback: {
        correctSound: '/sounds/cognados/facil/nivel1/indicador.mp3',
        incorrectSound: '/sounds/cognados/facil/nivel1/indicador0.mp3',
        correctMessage: '¡Correcto! +10 monedas',
        incorrectMessage: 'Incorrecto -10 monedas',
        showFloatingText: true,
        textColor: '#ff6b6b',
        textDuration: 1500
      }
    }
  ],
  
  totalCorrect: 8, // Total de elementos correctos en este nivel
  
  // Configuraciones globales del nivel
  gameSettings: {
    shuffleSelectables: true, // Aleatorizar posiciones
    showWordLabels: false, // No mostrar palabras debajo de selectores (actualizado)
    enableParticleEffects: true, // Efectos de partículas
    enableScreenShake: false, // Agitar pantalla en errores
    pauseOnCorrect: 500, // Pausa después de respuesta correcta (ms)
    pauseOnIncorrect: 800, // Pausa después de respuesta incorrecta (ms)
    autoPlayInstructions: true, // Reproducir instrucciones automáticamente
    autoPlayTraining: false, // El entrenamiento ahora es manual (clickeable)
    trainingInterval: 0, // No hay intervalo automático
    disableSelectorsAfterComparison: true // Deshabilitar selectores después de comparación
  },
  
  // Configuraciones de audio
  audioSettings: {
    masterVolume: 0.8,
    effectsVolume: 0.6,
    voiceVolume: 1.0,
    instructionsVolume: 1.0, // Volumen específico para instrucciones
    enableSpatialAudio: false,
    audioDelay: 0 // Delay antes de reproducir audio (ms)
  },
  
  // Configuraciones de UI
  uiSettings: {
    showProgressBar: false, // Ocultar barra de progreso (actualizado)
    showScoreAnimation: true,
    scoreAnimationDuration: 1000,
    enableHapticFeedback: true, // Vibración en móviles
    buttonStyle: 'rounded', // 'rounded' | 'square' | 'circle'
    colorScheme: 'blue', // 'blue' | 'green' | 'purple' | 'orange'
    showLevelInfo: false, // Ocultar información del nivel (actualizado)
    showTimeCounter: true, // Mostrar solo cuando no esté en entrenamiento
    conditionalNextButton: true // Mostrar botón siguiente solo cuando se cumplan condiciones
  }
};

// Función para obtener la configuración de un nivel específico
export const getNivelConfig = (gameType, difficulty, level) => {
  if (gameType === 'cognados') {
    if (difficulty === 'facil') {
      if (level === '1') return cognadosFacilNivel1;
      // Añadir otros niveles fáciles aquí
    } else if (difficulty === 'medio') {
      // Configuraciones para niveles medios
    } else if (difficulty === 'dificil') {
      // Configuraciones para niveles difíciles
    }
  } else if (gameType === 'pares-minimos') {
    // Configuraciones para pares mínimos
  }
  
  return null; // Retornar null si no existe configuración
};

// Función auxiliar para obtener configuraciones de animación
export const getAnimationConfig = (element, animationType) => {
  return element.animations?.[animationType] || {};
};

// Función auxiliar para obtener configuraciones de feedback
export const getFeedbackConfig = (element, feedbackType) => {
  return element.feedback?.[feedbackType] || '';
};

// Función auxiliar para obtener configuraciones de scoring
export const getScoringConfig = (element) => {
  return element.scoring || { pointsOnCorrect: 10, pointsOnIncorrect: -10 };
};