// src/api/ninoService.js
import API_URL from './config';

const ninoService = {
  /**
   * Valida la contraseña del niño
   * @param {number} ninoId - ID del niño
   * @param {string} password - Contraseña a validar
   * @returns {Promise} - Promesa con la respuesta del servidor
   */
  async validarPassword(ninoId, password) {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    try {
      const response = await fetch(`${API_URL}/nino/validar-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        body: JSON.stringify({
          nino_id: ninoId,
          password: password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al validar contraseña');
      }

      return data;
    } catch (error) {
      console.error('Error en validarPassword:', error);
      throw error;
    }
  },

  /**
   * Obtiene el progreso específico del niño para un juego y dificultad
   * @param {number} ninoId - ID del niño
   * @param {string} gameType - Tipo de juego ('cognados' o 'pares-minimos')
   * @param {string} difficulty - Dificultad ('facil', 'medio', 'dificil')
   * @returns {Promise} - Promesa con el progreso del niño
   */
  async getProgresoEspecifico(ninoId, gameType, difficulty) {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    try {
      const response = await fetch(
        `${API_URL}/nino/${ninoId}/progreso-especifico?gameType=${gameType}&difficulty=${difficulty}`,
        {
          method: 'GET',
          headers: {
            'Authorization': token
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al obtener progreso');
      }

      return data;
    } catch (error) {
      console.error('Error en getProgresoEspecifico:', error);
      throw error;
    }
  },

  /**
   * Guarda el progreso del niño
   * @param {number} ninoId - ID del niño
   * @param {object} progresoData - Datos del progreso a guardar
   * @returns {Promise} - Promesa con la respuesta del servidor
   */
  async saveProgresoEspecifico(ninoId, progresoData) {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    try {
      const response = await fetch(`${API_URL}/nino/${ninoId}/progreso-especifico`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        body: JSON.stringify(progresoData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al guardar progreso');
      }

      return data;
    } catch (error) {
      console.error('Error en saveProgresoEspecifico:', error);
      throw error;
    }
  },

  /**
   * Obtiene la información completa del niño
   * @param {number} ninoId - ID del niño
   * @returns {Promise} - Promesa con los datos del niño
   */
  async getNinoInfo(ninoId) {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    try {
      const response = await fetch(`${API_URL}/evaluador/nino/${ninoId}`, {
        method: 'GET',
        headers: {
          'Authorization': token
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al obtener información del niño');
      }

      return data;
    } catch (error) {
      console.error('Error en getNinoInfo:', error);
      throw error;
    }
  }
};

export default ninoService;
