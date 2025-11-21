import { Entity } from './Entity';

// Cualquier cosa que pueda atacar (Torre, Guerrero, Monstruo)
export interface ICombat {
    damage: number;
    attackRange: number;
    attack(target: Entity): void;
}

// Cualquier cosa que pueda cargar recursos (Harvester)
export interface ICollector {
    capacity: number;
    currentLoad: number;
    collect(amount: number): void;
}