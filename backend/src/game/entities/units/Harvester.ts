import { Unit } from './Unit';
import { Point } from '../../core/Point';
import { Resource } from '../environment/Resource';
import { Colony } from '../structures/Colony';
import { Entity } from '../../core/Entity';

import { GameState } from '../../../config/Game';

export class Harvester extends Unit {
  // Capacidad de carga
  public capacity: number = 50;
  public currentLoad: number = 0;
  
  // Velocidad de minado (cuánto extrae por tick)
  private harvestRate: number = 5;
  
  // Rango de interacción (debe estar cerca para trabajar)
  private interactRange: number = 20;

  constructor(position: Point, ownerId: string) {
    // Vida: 50 (Frágil), Radio: 10, Owner: jugador, Vel: 2 (Lento)
    super(position, 50, 10, ownerId, 2);
    (this as any).type = 'Harvester';
  }

  // Lógica interna de recolección (llamada por la API del usuario)
  public gather(resource: Resource): void {
    // 1. Validaciones físicas
    if (this.position.distanceTo(resource.position) > this.interactRange) {
      // Si está lejos, nos movemos hacia él automáticamente (ayuda al usuario)
      this.move(resource.position);
      return;
    }

    // 2. Validar capacidad
    if (this.currentLoad >= this.capacity) {
      // console.log(`[Harvester ${this.id}] ¡Estoy lleno!`);
      return;
    }

    // 3. Extraer
    // Calculamos cuánto espacio libre nos queda
    const spaceLeft = this.capacity - this.currentLoad;
    const amountToExtract = Math.min(this.harvestRate, spaceLeft);
    
    const extracted = resource.extract(amountToExtract);
    this.currentLoad += extracted;
  }

  //Lógica interna de entrega (llamada por la API del usuario)
  public transfer(colony: Colony): void {
    // 1. Validaciones físicas
    if (this.position.distanceTo(colony.position) > this.interactRange + colony.radius) {
      this.move(colony.position);
      return;
    }

    // 2. Entregar
    if (this.currentLoad > 0) {
      colony.depositResources(this.currentLoad);
      this.currentLoad = 0; // Vacío
    }
  }

  // Ejecutar código del usuario
  tick(gameState: GameState): void {
    const userScript = gameState.scripts?.[this.ownerId]?.['Harvester'];
    if (!userScript) return;

    try {
      // --- API SEGURA PARA EL USUARIO ---
      const api = {
        me: {
          // Datos
          id: this.id,
          position: { x: this.position.x, y: this.position.y },
          load: this.currentLoad,
          capacity: this.capacity,
          
          // Acciones
          move: (x: number, y: number) => this.move(new Point(x, y)),
          
          gather: (targetId: string) => {
            // Buscamos la entidad en el motor
            const target = gameState.engine.entities.get(targetId);
            // Verificamos que sea un Recurso válido
            if (target && target instanceof Resource) {
              this.gather(target);
            }
          },

          transfer: (targetId: string) => {
             const target = gameState.engine.entities.get(targetId);
             // Verificamos que sea UNA COLONIA y que sea MÍA
             if (target && target instanceof Colony && target.ownerId === this.ownerId) {
               this.transfer(target);
             }
          },
          
          log: (msg: string) => console.log(`[Harvester ${this.id.split('-')[0]}]: ${msg}`)
        },
        
        world: {
            // Escáner simple para encontrar recursos o la base
            scan: (radius: number = 200) => {
                const entities = gameState.engine.getNearbyEntities(this.position, radius, this.id);
                return entities.map((e: Entity) => ({
                    id: e.id,
                    type: (e as any).type || e.constructor.name,
                    x: e.position.x,
                    y: e.position.y,
                    dist: this.position.distanceTo(e.position),
                    owner: e.ownerId,
                    // Info extra si es recurso o colonia
                    amount: e instanceof Resource ? e.amount : undefined 
                }));
            }
        }
      };

      const run = new Function('me', 'world', userScript);
      run(api.me, api.world);

    } catch (e) {
      console.error(`Error script Harvester:`, e);
    }
  }
}