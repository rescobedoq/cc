import { Unit } from './Unit';
import { Point } from '../../core/Point';

export class Warrior extends Unit {
  constructor(position: Point, ownerId: string) {
    // Vida: 100, Radio: 10, Vel: 3
    super(position, 100, 10, ownerId, 3);
  }

  tick(gameState: any): void {
    // aquí irá la ejecución del código del usuario.
    // Por ahora, simulamos un comportamiento por defecto: Patrullar.
    
    // moverse un poco a la derecha
    const patrolPoint = new Point(this.position.x + 100, this.position.y);
    this.move(patrolPoint); 
  }
}