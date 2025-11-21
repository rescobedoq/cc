import { Structure } from './Structure';
import { Point } from '../../core/Point';
import { Entity } from '../../core/Entity';

export class Tower extends Structure {
  public damage: number = 5;
  public range: number = 80; // Rango largo

  constructor(position: Point, ownerId: string) {
    // Vida: 300, Radio: 15
    super(position, 300, 15, ownerId);
  }

  tick(gameState: any): void {
    // Lógica básica de defensa automática
    // 1. Buscar enemigo más cercano dentro del rango
    // 2. Disparar
  }
  
  public attack(target: Entity) {
      // Visualmente aquí lanzaríamos un proyectil
      target.takeDamage(this.damage);
  }
}