// src/components/SaveProgressButton.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import ninoService from '../api/ninoService';

const FloatingButton = styled.button`
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: 3px solid rgba(255, 255, 255, 0.3);
  color: white;
  font-size: 2rem;
  cursor: pointer;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
  transition: all 0.3s;
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    transform: scale(1.1) rotate(10deg);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
  }
  
  &:active {
    transform: scale(0.95);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Tooltip = styled.div`
  position: fixed;
  bottom: 110px;
  right: 30px;
  background: rgba(30, 27, 75, 0.95);
  color: white;
  padding: 10px 15px;
  border-radius: 10px;
  font-size: 0.9rem;
  white-space: nowrap;
  z-index: 998;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  animation: fadeIn 0.3s;
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  &:after {
    content: '';
    position: absolute;
    bottom: -8px;
    right: 20px;
    width: 0;
    height: 0;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-top: 8px solid rgba(30, 27, 75, 0.95);
  }
`;

const SaveProgressButton = ({ 
  currentLevel, 
  accumulatedScore, 
  gameType, 
  difficulty,
  autoSaveOnClick = true 
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const handleSaveAndNavigate = async () => {
    const ninoStr = localStorage.getItem('currentNino');
    
    if (!ninoStr) {
      alert('No hay sesión activa');
      navigate('/ninos-list');
      return;
    }

    const nino = JSON.parse(ninoStr);
    
    console.log('🔍 Guardando progreso con valores:');
    console.log('  - currentLevel:', currentLevel, typeof currentLevel);
    console.log('  - accumulatedScore:', accumulatedScore, typeof accumulatedScore);
    console.log('  - gameType:', gameType);
    console.log('  - difficulty:', difficulty);
    
    // Crear objeto de progreso completo
    const progressData = {
      ninoId: nino.id,
      gameType: gameType,
      difficulty: difficulty,
      currentLevel: currentLevel,
      accumulatedScore: accumulatedScore,
      timestamp: Date.now()
    };
    
    // Guardar en localStorage con estructura especial para recuperación
    localStorage.setItem('lastSavedProgress', JSON.stringify(progressData));
    
    // 🔑 IMPORTANTE: Actualizar localStorage con valores individuales POR NIÑO
    localStorage.setItem(`lastLevel_${nino.id}`, String(currentLevel));
    localStorage.setItem(`accumulatedScore_${nino.id}`, String(accumulatedScore));
    localStorage.setItem(`lastGameType_${nino.id}`, gameType);
    localStorage.setItem(`lastDifficulty_${nino.id}`, difficulty);

    if (autoSaveOnClick) {
      setSaving(true);
      
      try {
        await ninoService.saveProgresoEspecifico(nino.id, {
          game_type: gameType,
          difficulty: difficulty,
          current_level: currentLevel,
          accumulated_score: accumulatedScore
        });

        console.log('✅ Progreso guardado exitosamente:', progressData);
      } catch (error) {
        console.error('❌ Error guardando progreso en backend:', error);
        // Continuar navegando aunque falle el guardado en backend
        // El progreso en localStorage servirá como respaldo
      } finally {
        setSaving(false);
      }
    }

    // Navegar a la encuesta
    navigate('/encuesta');
  };

  return (
    <>
      <FloatingButton
        onClick={handleSaveAndNavigate}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        disabled={saving}
        title="Ir a Encuesta"
      >
        {saving ? '💾' : '📊'}
      </FloatingButton>
      
      {showTooltip && !saving && (
        <Tooltip>
          Ir a Encuesta
        </Tooltip>
      )}
    </>
  );
};

SaveProgressButton.propTypes = {
  currentLevel: PropTypes.number.isRequired,
  accumulatedScore: PropTypes.number.isRequired,
  gameType: PropTypes.string.isRequired,
  difficulty: PropTypes.string.isRequired,
  autoSaveOnClick: PropTypes.bool
};

export default SaveProgressButton;
