import { Unit } from './Unit';
import { Point } from '../../core/Point';
import { Entity } from '../../core/Entity';

import { GameEngine } from '../../GameEngine';

import { GameState } from '../../../config/Game';

export class Monster extends Unit {
  // Configuración de Amenaza
  public damage: number = 10;
  public attackRange: number = 60; // Cuerpo a cuerpo
  public aggroRange: number = 300; // Distancia a la que "huele" al enemigo
  public attackSpeed: number = 10; // Ticks entre ataques
  
  private cooldown: number = 0;

  constructor(position: Point) {
    // Vida: 80, Radio: 12, Owner: 'enemy', Vel: 1.5 (Más lento que el guerrero)
    super(position, 80, 12, 'enemy', 1.5);
    (this as any).type = 'Monster';
  }

  tick(gameState: GameState): void {
    if (this.cooldown > 0) this.cooldown--;

    // 1. INTELIGENCIA ARTIFICIAL (IA)
    
    // Paso A: Escanear entorno
    const nearby = gameState.engine.getNearbyEntities(this.position, this.aggroRange, this.id);
    
    // Paso B: Filtrar presas (Todo lo que no sea 'enemy' ni 'neutral')
    const targets = nearby.filter((e: Entity) => 
        e.isAlive() && 
        e.ownerId !== 'enemy' && 
        e.ownerId !== 'neutral'
    );

    // Si no hay nadie cerca, ir hacia el centro del mapa (o vagar)
    if (targets.length === 0) {
        this.move(new Point(0, 0)); 
        return;
    }

    // Paso C: Elegir víctima (la más cercana)
    targets.sort((a: Entity, b: Entity) => 
        this.position.distanceTo(a.position) - this.position.distanceTo(b.position)
    );
    const target = targets[0];
    const dist = this.position.distanceTo(target.position);

    // Paso D: Decidir acción
    if (dist <= this.attackRange) {
        // ATACAR
        if (this.cooldown === 0) {
            this.performAttack(target, gameState.engine);
        }
    } else {
        // PERSEGUIR
        this.move(target.position);
    }
  }

  private performAttack(target: Entity, engine: GameEngine) {
    target.takeDamage(this.damage);
    this.cooldown = this.attackSpeed;

    // Evento visual (Mordisco/Golpe rojo)
    if (engine.addEvent) {
        engine.addEvent({
            type: 'attack_melee',
            from: { x: this.position.x, y: this.position.y },
            to: { x: target.position.x, y: target.position.y },
            color: 'red',
            duration: 100
        });
    }
  }
}