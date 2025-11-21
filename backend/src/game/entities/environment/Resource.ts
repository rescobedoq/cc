import { Entity } from '../../core/Entity';
import { Point } from '../../core/Point';

export class Resource extends Entity {
  constructor(position: Point, public amount: number) {
    super(position, 10, 5, 'neutral'); // Vida irrelevante, Radio pequeño
  }

  tick(gameState: any): void {
    // Los recursos no hacen nada, solo existen.
  }

  public extract(quantity: number): number {
    const extracted = Math.min(this.amount, quantity);
    this.amount -= extracted;
    if (this.amount <= 0) this.isMarkedForDeletion = true;
    return extracted;
  }
}