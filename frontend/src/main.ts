import './style.css'
//import typescriptLogo from './typescript.svg'
//import viteLogo from '/vite.svg'
//import { setupCounter } from './counter.ts'
import { GameClient } from './GameClient'

const divElement = document.querySelector('#app')
if (divElement instanceof HTMLDivElement) {
  divElement.innerHTML = /*html*/`
    <div>
        <h3>Vista del Mundo (Canvas)</h3>
        <canvas id="gameCanvas" width="500" height="500"></canvas>
        <p id="status">Esperando conexión...</p>
    </div>

    <div id="editor">
        <h3>Programar Harvester</h3>
        <p>API Disponible: <code>me.move(x, y)</code>, <code>me.log("hola")</code></p>
        <textarea id="codeArea">
// Moverse en círculos
const time = new Date().getTime() / 1000;
const x = Math.cos(time) * 100;
const y = Math.sin(time) * 100;

me.move(x, y);
me.log("Moviendome a " + x.toFixed(0));
        </textarea>
        <button id="deployButton" >Subir Código 🚀</button>
    </div>
  `
}

let gameClient: GameClient;

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  gameClient = new GameClient('gameCanvas');
  
  // Configurar el botón de deploy
  const deployButton = document.getElementById('deployButton');
  if (deployButton) {
    deployButton.addEventListener('click', () => {
      const codeArea = document.getElementById('codeArea') as HTMLTextAreaElement;
      if (codeArea) {
        gameClient.deployCode(codeArea.value);
      }
    });
  }
});

// Cleanup al cerrar
window.addEventListener('beforeunload', () => {
  if (gameClient) {
    gameClient.disconnect();
  }
});