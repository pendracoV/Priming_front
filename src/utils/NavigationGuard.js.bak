// src/utils/NavigationGuard.js
// Sistema completo de protección de navegación durante el juego

/**
 * Clase para manejar el bloqueo de navegación durante el juego
 */
export class NavigationGuard {
    constructor(user, gameType, dificultad, nivel) {
      this.user = user;
      this.gameType = gameType;
      this.dificultad = dificultad;
      this.nivel = nivel;
      this.currentPath = `/nivel/${gameType}/${dificultad}/${nivel}`;
      this.isActive = false;
      this.listeners = [];
      this.intervals = [];
    }
  
    /**
     * Activa la protección de navegación
     */
    activate() {
      if (this.isActive) return;
      
      this.isActive = true;
      console.log(`🔒 Protección de navegación activada para ${this.currentPath}`);
      
      // 1. Bloquear botones atrás/adelante
      this.blockBrowserNavigation();
      
      // 2. Bloquear recarga de página
      this.blockPageReload();
      
      // 3. Monitorear cambios de URL
      this.monitorUrlChanges();
      
      // 4. Bloquear atajos de teclado
      this.blockKeyboardShortcuts();
      
      // 5. Forzar URL correcta
      this.enforceCorrectUrl();
    }
  
    /**
     * Desactiva la protección de navegación
     */
    deactivate() {
      if (!this.isActive) return;
      
      this.isActive = false;
      console.log(`🔓 Protección de navegación desactivada para ${this.currentPath}`);
      
      // Limpiar todos los listeners
      this.listeners.forEach(({ element, event, handler }) => {
        element.removeEventListener(event, handler);
      });
      
      // Limpiar todos los intervals
      this.intervals.forEach(interval => {
        clearInterval(interval);
      });
      
      this.listeners = [];
      this.intervals = [];
    }
  
    /**
     * Bloquea navegación con botones del navegador
     */
    blockBrowserNavigation() {
      const handlePopState = (event) => {
        if (this.isActive) {
          event.preventDefault();
          event.stopPropagation();
          
          // Forzar la URL correcta
          window.history.replaceState(null, '', this.currentPath);
          
          // Mostrar mensaje al usuario
          this.showNavigationBlockedMessage();
          
          return false;
        }
      };
  
      // Agregar al historial para interceptar navegación
      window.history.pushState(null, '', this.currentPath);
      
      window.addEventListener('popstate', handlePopState);
      this.listeners.push({ 
        element: window, 
        event: 'popstate', 
        handler: handlePopState 
      });
    }
  
    /**
     * Bloquea recarga de página y cierre de ventana
     */
    blockPageReload() {
      const handleBeforeUnload = (event) => {
        if (this.isActive) {
          const message = '¿Estás seguro de salir? Perderás el progreso del nivel actual.';
          event.preventDefault();
          event.returnValue = message;
          return message;
        }
      };
  
      const handleUnload = (event) => {
        if (this.isActive) {
          // Guardar estado antes de cerrar
          this.saveCurrentState();
        }
      };
  
      window.addEventListener('beforeunload', handleBeforeUnload);
      window.addEventListener('unload', handleUnload);
      
      this.listeners.push({ 
        element: window, 
        event: 'beforeunload', 
        handler: handleBeforeUnload 
      });
      this.listeners.push({ 
        element: window, 
        event: 'unload', 
        handler: handleUnload 
      });
    }
  
    /**
     * Monitorea cambios de URL constantemente
     */
    monitorUrlChanges() {
      const urlWatcher = setInterval(() => {
        if (this.isActive && window.location.pathname !== this.currentPath) {
          console.log(`🚫 URL no autorizada detectada: ${window.location.pathname}`);
          window.history.replaceState(null, '', this.currentPath);
          this.showNavigationBlockedMessage();
        }
      }, 100); // Verificar cada 100ms
  
      this.intervals.push(urlWatcher);
    }
  
    /**
     * Bloquea atajos de teclado comunes
     */
    blockKeyboardShortcuts() {
      const handleKeyDown = (event) => {
        if (!this.isActive) return;
  
        const { key, ctrlKey, altKey, metaKey, shiftKey } = event;
        
        // Lista de combinaciones bloqueadas
        const blockedCombinations = [
          // Navegación
          { key: 'F5' }, // Refrescar
          { key: 'r', ctrlKey: true }, // Ctrl+R
          { key: 'R', ctrlKey: true, shiftKey: true }, // Ctrl+Shift+R
          { key: 'ArrowLeft', altKey: true }, // Alt+← (atrás)
          { key: 'ArrowRight', altKey: true }, // Alt+→ (adelante)
          { key: 'Backspace', altKey: true }, // Alt+Backspace (atrás)
          
          // Herramientas de desarrollo
          { key: 'F12' }, // DevTools
          { key: 'I', ctrlKey: true, shiftKey: true }, // Ctrl+Shift+I
          { key: 'J', ctrlKey: true, shiftKey: true }, // Ctrl+Shift+J
          { key: 'C', ctrlKey: true, shiftKey: true }, // Ctrl+Shift+C
          
          // Otras combinaciones
          { key: 'u', ctrlKey: true }, // Ctrl+U (ver código fuente)
          { key: 's', ctrlKey: true }, // Ctrl+S (guardar)
          { key: 'w', ctrlKey: true }, // Ctrl+W (cerrar pestaña)
          { key: 't', ctrlKey: true }, // Ctrl+T (nueva pestaña)
          { key: 'n', ctrlKey: true }, // Ctrl+N (nueva ventana)
        ];
  
        // Verificar si la combinación está bloqueada
        const isBlocked = blockedCombinations.some(combo => {
          return combo.key === key &&
                 (combo.ctrlKey === undefined || combo.ctrlKey === ctrlKey) &&
                 (combo.altKey === undefined || combo.altKey === altKey) &&
                 (combo.metaKey === undefined || combo.metaKey === metaKey) &&
                 (combo.shiftKey === undefined || combo.shiftKey === shiftKey);
        });
  
        if (isBlocked) {
          event.preventDefault();
          event.stopPropagation();
          this.showKeyboardBlockedMessage(key);
          return false;
        }
      };
  
      document.addEventListener('keydown', handleKeyDown, true);
      this.listeners.push({ 
        element: document, 
        event: 'keydown', 
        handler: handleKeyDown 
      });
    }
  
    /**
     * Fuerza la URL correcta periódicamente
     */
    enforceCorrectUrl() {
      const urlEnforcer = setInterval(() => {
        if (this.isActive) {
          const currentUrl = window.location.pathname;
          if (currentUrl !== this.currentPath) {
            window.history.replaceState(null, '', this.currentPath);
          }
        }
      }, 250); // Verificar cada 250ms
  
      this.intervals.push(urlEnforcer);
    }
  
    /**
     * Muestra mensaje cuando se bloquea navegación
     */
    showNavigationBlockedMessage() {
      // Crear elemento de notificación
      const notification = document.createElement('div');
      notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #ff6b6b, #ee5a52);
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        z-index: 10000;
        font-family: 'Arial', sans-serif;
        font-size: 14px;
        font-weight: bold;
        border: 2px solid rgba(255,255,255,0.2);
        animation: slideIn 0.3s ease-out;
      `;
      
      notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
          <span style="font-size: 18px;">🚫</span>
          <span>No puedes navegar fuera del nivel actual</span>
        </div>
      `;
  
      // Agregar CSS de animación
      if (!document.getElementById('navigation-guard-styles')) {
        const style = document.createElement('style');
        style.id = 'navigation-guard-styles';
        style.textContent = `
          @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
          @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
          }
        `;
        document.head.appendChild(style);
      }
  
      document.body.appendChild(notification);
  
      // Remover después de 3 segundos
      setTimeout(() => {
        if (notification.parentNode) {
          notification.style.animation = 'slideOut 0.3s ease-in';
          setTimeout(() => {
            if (notification.parentNode) {
              notification.parentNode.removeChild(notification);
            }
          }, 300);
        }
      }, 3000);
    }
  
    /**
     * Muestra mensaje cuando se bloquea atajo de teclado
     */
    showKeyboardBlockedMessage(key) {
      console.log(`⌨️ Atajo bloqueado: ${key}`);
      
      // Crear notificación más sutil para atajos de teclado
      const notification = document.createElement('div');
      notification.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0,0,0,0.8);
        color: #ffcc00;
        padding: 10px 20px;
        border-radius: 8px;
        z-index: 10001;
        font-family: 'Arial', sans-serif;
        font-size: 12px;
        border: 1px solid #ffcc00;
        animation: fadeInOut 1.5s ease-in-out;
      `;
      
      notification.textContent = `Atajo "${key}" bloqueado durante el juego`;
  
      // CSS para animación
      if (!document.getElementById('keyboard-guard-styles')) {
        const style = document.createElement('style');
        style.id = 'keyboard-guard-styles';
        style.textContent = `
          @keyframes fadeInOut {
            0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
            20% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
            80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
            100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
          }
        `;
        document.head.appendChild(style);
      }
  
      document.body.appendChild(notification);
  
      // Remover automáticamente
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 1500);
    }
  
    /**
     * Guarda el estado actual antes de cerrar
     */
    saveCurrentState() {
      // Esta función se puede personalizar según las necesidades del juego
      console.log(`💾 Guardando estado antes de cerrar: ${this.currentPath}`);
      
      // Aquí se puede integrar con el sistema de guardado del juego
      const event = new CustomEvent('saveGameState', {
        detail: {
          gameType: this.gameType,
          dificultad: this.dificultad,
          nivel: this.nivel,
          forced: true
        }
      });
      
      window.dispatchEvent(event);
    }
  
    /**
     * Actualiza la ruta actual (útil para navegación programática permitida)
     */
    updateCurrentPath(newPath) {
      this.currentPath = newPath;
      console.log(`🔄 Ruta actualizada a: ${newPath}`);
    }
  }
  
  // ═══════════════════════════════════════════════════════════════════════════════
  // 🎯 FUNCIONES DE UTILIDAD
  // ═══════════════════════════════════════════════════════════════════════════════
  
  /**
   * Crea y activa un guardia de navegación
   * @param {Object} user - Usuario autenticado
   * @param {string} gameType - Tipo de juego
   * @param {string} dificultad - Dificultad
   * @param {string|number} nivel - Nivel
   * @returns {NavigationGuard} Instancia del guardia
   */
  export const createNavigationGuard = (user, gameType, dificultad, nivel) => {
    const guard = new NavigationGuard(user, gameType, dificultad, nivel);
    guard.activate();
    return guard;
  };
  
  /**
   * Hook de React para usar el guardia de navegación
   * @param {Object} user - Usuario autenticado
   * @param {string} gameType - Tipo de juego
   * @param {string} dificultad - Dificultad
   * @param {string|number} nivel - Nivel
   * @param {boolean} isActive - Si debe estar activo
   * @returns {NavigationGuard} Instancia del guardia
   */
  export const useNavigationGuard = (user, gameType, dificultad, nivel, isActive = true) => {
    const [guard, setGuard] = React.useState(null);
  
    React.useEffect(() => {
      if (!user || !isActive) {
        if (guard) {
          guard.deactivate();
          setGuard(null);
        }
        return;
      }
  
      const newGuard = new NavigationGuard(user, gameType, dificultad, nivel);
      newGuard.activate();
      setGuard(newGuard);
  
      return () => {
        newGuard.deactivate();
      };
    }, [user, gameType, dificultad, nivel, isActive]);
  
    return guard;
  };
  
  export default NavigationGuard;