import { Entity } from '../../core/Entity';
import { Point } from '../../core/Point';

export abstract class Structure extends Entity {
  // Propiedad única de estructuras: Tiempo que tardan en construirse (turnos)
  public constructionTime: number = 10; 
  public isBuilt: boolean = true; // Por defecto true para el MVP

  constructor(
    position: Point,
    health: number,
    radius: number,
    ownerId: string
  ) {
    super(position, health, radius, ownerId);
  }
  
  // Las estructuras pueden podrian repararse
}