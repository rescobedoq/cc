import { GameEngine } from './game/GameEngine';

const game = new GameEngine();

// Arrancamos el motor
game.start();

//lo paramos a los 10 segundos
setTimeout(() => {
  game.stop();
}, 10000);