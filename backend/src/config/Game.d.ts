import { GameEngine } from "../game/GameEngine"
import { Entity } from "../game/core/Entity"

export interface GameState {
  engine: GameEngine
  entities: Map<string, Entity>
  scripts: Record<string, Record<string, string>>
}

export interface Event {
  type: string // O 'attack_sword'
  from?: { x: number, y: number } // ataques
  to?: { x: number, y: number }
  x?: number //Muertes
  y?: number
  color?: string 
  duration?: number
}
