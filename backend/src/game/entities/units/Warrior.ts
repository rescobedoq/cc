import { Unit } from './Unit';
import { Point } from '../../core/Point';
import { Entity } from '../../core/Entity';

import { GameEngine } from '../../GameEngine';

import { GameState } from '../../../config/Game';

export class Warrior extends Unit {
  // Stats de Combate
  public damage: number = 15;
  public attackRange: number = 30; // Un poco más que el monstruo
  public attackSpeed: number = 8;  // Ataca un poco más rápido
  
  private cooldown: number = 0;

  constructor(position: Point, ownerId: string) {
    // Vida: 120 (Tanque), Radio: 10, Owner: Jugador, Vel: 2.5 (Rápido)
    super(position, 120, 10, ownerId, 2.5);
    (this as any).type = 'Warrior';
  }

  // Acción interna de ataque
  public fight(target: Entity, engine: GameEngine) {
    if (this.cooldown > 0) return; // Recargando
    
    // Validar rango
    if (this.position.distanceTo(target.position) > this.attackRange) {
        this.move(target.position); // Acercarse automágicamente si está un poco lejos
        return;
    }

    // Ejecutar daño
    target.takeDamage(this.damage);
    this.cooldown = this.attackSpeed;

    // Visual
    if (engine.addEvent) {
        engine.addEvent({
            type: 'attack_melee', // O 'attack_sword'
            from: { x: this.position.x, y: this.position.y },
            to: { x: target.position.x, y: target.position.y },
            color: 'white', // Color del espadazo
            duration: 100
        });
    }
  }

  tick(gameState: GameState): void {
    if (this.cooldown > 0) this.cooldown--;

    const userScript = gameState.scripts?.[this.ownerId]?.['Warrior'];

    // COMPORTAMIENTO POR DEFECTO (Si el usuario no programa nada)
    // Importante para que no se queden parados mientras los matan
    if (!userScript) {
        this.defaultBehavior(gameState);
        return;
    }

    try {
      // --- API DE COMBATE PARA EL USUARIO ---
      const api = {
        me: {
          id: this.id,
          position: { x: this.position.x, y: this.position.y },
          hp: this.health,
          maxHp: 120,
          range: this.attackRange,
          isReady: this.cooldown === 0, // Saber si puede atacar ya

          move: (x: number, y: number) => this.move(new Point(x, y)),
          
          attack: (targetId: string) => {
            const target = gameState.engine.entities.get(targetId);
            // Solo atacar si existe, está vivo y NO es amigo
            if (target && target.isAlive() && target.ownerId !== this.ownerId) {
                this.fight(target, gameState.engine);
            }
          },
          
          log: (msg: string) => console.log(`[Warrior ${this.id.split('-')[0]}]: ${msg}`)
        },
        
        world: {
            scan: (radius: number = 100) => {
                const entities = gameState.engine.getNearbyEntities(this.position, radius, this.id);
                return entities.map((e: Entity) => ({
                    id: e.id,
                    type: (e as any).type || e.constructor.name,
                    x: e.position.x,
                    y: e.position.y,
                    hp: e.health,
                    owner: e.ownerId,
                    dist: this.position.distanceTo(e.position)
                }));
            }
        }
      };

      const run = new Function('me', 'world', userScript);
      run(api.me, api.world);

    } catch (e) {
      // console.error(`Error script Warrior`, e);
    }
  }

  // IA Tonta por defecto (Atacar al enemigo más cercano si lo veo)
  private defaultBehavior(gameState: GameState) {
      const nearby = gameState.engine.getNearbyEntities(this.position, 100, this.id);
      const enemies = nearby.filter((e: Entity) => e.ownerId !== this.ownerId && e.ownerId !== 'neutral');
      
      if (enemies.length > 0) {
          this.fight(enemies[0], gameState.engine);
      }
  }
}