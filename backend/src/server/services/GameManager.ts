import { GameEngine } from '../../game/GameEngine';

// Patron singleton
class GameManager {
  private static instance: GameManager;
  public engine: GameEngine;

  private constructor() {
    this.engine = new GameEngine();
  }

  public static getInstance(): GameManager {
    if (!GameManager.instance) {
      GameManager.instance = new GameManager();
    }
    return GameManager.instance;
  }
}

export const gameManager = GameManager.getInstance();