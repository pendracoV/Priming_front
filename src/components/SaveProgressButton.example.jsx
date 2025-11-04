// Ejemplo de cómo integrar SaveProgressButton en los componentes de nivel
// Este archivo muestra cómo usar el botón flotante en cualquier nivel del juego

import React from 'react';
import { useParams } from 'react-router-dom';
import SaveProgressButton from '../../components/SaveProgressButton';

// EJEMPLO 1: Nivel de Cognados
const NivelCognados = () => {
  const { dificultad, nivel } = useParams();
  const [score, setScore] = React.useState(200);
  
  // ... resto del código del nivel
  
  return (
    <div>
      {/* Contenido del nivel */}
      
      {/* Botón flotante para guardar progreso */}
      <SaveProgressButton
        currentLevel={parseInt(nivel)}
        accumulatedScore={score}
        gameType="cognados"
        difficulty={dificultad}
        autoSaveOnClick={true}
      />
    </div>
  );
};

// EJEMPLO 2: Nivel de Pares Mínimos
const NivelParesMinimos = () => {
  const { dificultad, nivel } = useParams();
  const [score, setScore] = React.useState(200);
  
  // ... resto del código del nivel
  
  return (
    <div>
      {/* Contenido del nivel */}
      
      {/* Botón flotante para guardar progreso */}
      <SaveProgressButton
        currentLevel={parseInt(nivel)}
        accumulatedScore={score}
        gameType="pares-minimos"
        difficulty={dificultad}
        autoSaveOnClick={true}
      />
    </div>
  );
};

// EJEMPLO 3: Usando con useGameState hook
const NivelConHook = () => {
  const { dificultad, nivel } = useParams();
  const { gameState } = useGameState('cognados', dificultad, nivel, levelConfig);
  
  return (
    <div>
      {/* Contenido del nivel */}
      
      {/* Botón usando estado del hook */}
      <SaveProgressButton
        currentLevel={gameState.level}
        accumulatedScore={gameState.score}
        gameType={gameState.gameType}
        difficulty={gameState.difficulty}
        autoSaveOnClick={true}
      />
    </div>
  );
};

// EJEMPLO 4: Versión sin auto-guardado (el usuario guarda manualmente en encuesta)
const NivelSinAutoGuardado = () => {
  const { dificultad, nivel } = useParams();
  const [score, setScore] = React.useState(200);
  
  return (
    <div>
      {/* Contenido del nivel */}
      
      {/* Solo navega, no guarda automáticamente */}
      <SaveProgressButton
        currentLevel={parseInt(nivel)}
        accumulatedScore={score}
        gameType="cognados"
        difficulty={dificultad}
        autoSaveOnClick={false}  // ← Desactivar auto-guardado
      />
    </div>
  );
};

// NOTAS IMPORTANTES:
// 
// 1. El botón siempre debe recibir:
//    - currentLevel: número del nivel actual
//    - accumulatedScore: puntaje acumulado del jugador
//    - gameType: 'cognados' o 'pares-minimos'
//    - difficulty: 'facil', 'medio', o 'dificil'
//
// 2. El parámetro autoSaveOnClick es opcional:
//    - true (default): guarda en BD antes de navegar a encuesta
//    - false: solo actualiza localStorage y navega
//
// 3. El botón siempre actualiza localStorage antes de navegar:
//    - lastLevel
//    - accumulatedScore
//    - lastGameType
//    - lastDifficulty
//
// 4. Posicionamiento:
//    - El botón es fixed (posición fija)
//    - Aparece en la esquina inferior derecha
//    - No interfiere con el contenido del juego
//    - Tiene z-index alto (999)
//
// 5. Estilos:
//    - Botón circular con gradiente
//    - Tooltip al pasar el mouse
//    - Animaciones suaves
//    - Responsive

export {
  NivelCognados,
  NivelParesMinimos,
  NivelConHook,
  NivelSinAutoGuardado
};
