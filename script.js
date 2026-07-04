/**
 * ============================================================================
 * Tic Tac Toe — Modern Edition (Application Entry Point)
 * Initializes the modular ES6 application once the DOM is fully loaded.
 * ============================================================================
 */

import { UIController } from './js/ui.js';

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => UIController.init());
} else {
  UIController.init();
}