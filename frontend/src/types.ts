// types.ts - Interfaces compartidas

export interface GameEntity {
  id: string;
  type: 'Warrior' | 'Harvester' | 'Tower' | 'Colony' | 'Resource' | 'Monster';
  x: number;
  y: number;
  owner: string;
  hp: number;
  val?: number; // Para recursos
}

export interface GameTickData {
  t: number;           // Timestamp
  e: GameEntity[];     // Entities
  ev: GameEvent[];     // Events
}

export interface GameEvent {
  type: string;
  from?: { x: number; y: number };
  to?: { x: number; y: number };
  x?: number;
  y?: number;
  color?: string;
  duration?: number;
}

export interface Camera {
  x: number;
  y: number;
  zoom: number;
}