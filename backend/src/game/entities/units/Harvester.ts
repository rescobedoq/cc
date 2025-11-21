import { Unit } from './Unit';
import { Point } from '../../core/Point';
import { Resource } from '../environment/Resource'; 
import { Colony } from '../structures/Colony';

export class Harvester extends Unit {
  public capacity: number = 50;
  public currentLoad: number = 0;
  
  // Velocidad de recolección por tick
  public harvestRate: number = 2;

  constructor(position: Point, ownerId: string) {
    // Vida: 50, Radio: 8, Owner: jugador, Velocidad: 2 
    super(position, 50, 8, ownerId, 2);
  }

  tick(gameState: any): void {
    // Buscar si hay un script para 'Harvester' de mi dueño
    // Asumimos que gameState tiene un gestor de scripts
    const userScript = gameState.scripts?.[this.ownerId]?.['Harvester'];

    if (!userScript) {
        return;
    }

    try {
        const api = {
            me: {
                id: this.id,
                position: this.position,
                currentLoad: this.currentLoad,
                capacity: this.capacity,
                // Métodos expuestos:
                move: (x: number, y: number) => this.move(new Point(x, y)),
                log: (msg: string) => console.log(`[Harvester ${this.id}]: ${msg}`)
            },
            world: {
                // En una versión real, filtraríamos esto para no ver todo el mapa
                resources: gameState.entities.filter((e: any) => e.constructor.name === 'Resource')
            }
        };

        // EJECUTAR (DANGER: Usamos new Function para prototipo)
        // El usuario escribirá algo como: "me.move(100, 100);"
        const run = new Function('me', 'world', userScript);
        run(api.me, api.world);

    } catch (error) {
        console.error(`Error en script de Harvester:`, error);
    }
  }

  // Métodos específicos que el jugador podrá llamar desde su script
  public gather(resource: Resource) {
      if (this.currentLoad >= this.capacity) {
          return;
      }
      const amount = resource.extract(this.harvestRate);
      this.currentLoad += amount;
  }

  public transfer(colony: Colony) {
      if (this.currentLoad > 0) {
          colony.addEnergy(this.currentLoad);
          this.currentLoad = 0;
      }
  }
}