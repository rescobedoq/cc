// main.ts - Punto de entrada

import './style.css';
import { GameClient } from './GameClient';

let gameClient: GameClient;

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  gameClient = new GameClient();
});

// Cleanup al cerrar
window.addEventListener('beforeunload', () => {
  if (gameClient) {
    gameClient.disconnect();
  }
});