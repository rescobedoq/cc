import { Point } from './Point';
import { v4 as uuidv4 } from 'uuid'; 

export abstract class Entity {
  public id: string;
  public isMarkedForDeletion: boolean = false;

  constructor(
    public position: Point,
    public health: number,
    public radius: number, // Para colisiones
    public ownerId: string = 'neutral' // 'player1', 'enemy', 'neutral'
  ) {
    this.id = uuidv4();
  }

  // Método que se ejecutará en cada ciclo del juego
  abstract tick(gameState: any): void; 

  public takeDamage(amount: number): void {
    this.health -= amount;
    if (this.health <= 0) {
      this.health = 0;
      this.isMarkedForDeletion = true;
      console.log(`Entidad ${this.id.split('-')[0]} ha muerto.`);
    }
  }

  public isAlive(): boolean {
    return this.health > 0;
  }
}