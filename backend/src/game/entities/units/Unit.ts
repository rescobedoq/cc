import { Entity } from '../../core/Entity';
import { Point } from '../../core/Point';

export abstract class Unit extends Entity {
  constructor(
    position: Point,
    health: number,
    radius: number,
    ownerId: string,
    public speed: number
  ) {
    super(position, health, radius, ownerId);
  }

  public move(target: Point): void {
    this.position = this.position.moveTowards(target, this.speed);
  }
}
