import { Unit } from './Unit';
import { Point } from '../../core/Point';

export class Monster extends Unit {
  private damage: number = 10;
  private attackRange: number = 15;

  constructor(position: Point) {
    // Vida: 50, Radio: 10, Owner: 'enemy', Vel: 2
    super(position, 50, 10, 'enemy', 2); 
  }

  tick(gameState: any): void {
    // IA SIMPLE:
    // 1. Buscar objetivo (por ahora, asumimos que la base está en 0,0)
    const target = new Point(0, 0);
    const dist = this.position.distanceTo(target);

    if (dist <= this.attackRange) {
       // Lógica de ataque (pendiente de conectar con la Colonia real)
       console.log(`>:v Monstruo ataca la base!`);
    } else {
       this.move(target);
    }
  }
}