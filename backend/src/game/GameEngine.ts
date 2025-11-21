import { Entity } from './core/Entity'
import { Point } from './core/Point'
import { Monster } from './entities/units/Monster'
import { Resource } from './entities/environment/Resource'
import { Warrior } from './entities/units/Warrior'
import { Colony } from './entities/structures/Colony'
import { Tower } from './entities/structures/Tower'
import { Harvester } from './entities/units/Harvester'

export class GameEngine {
  public entities: Map<string, Entity> = new Map(); //publica por el momento (para probar los websockets)
  private tickCount: number = 0;
  private gameLoopInterval: NodeJS.Timeout | null = null;

  // Configuración
  private TICK_RATE_MS = 200; // Actualizar cada 200ms (5 FPS)

  constructor() {
    this.initializeWorld();
  }

  private initializeWorld() {
    console.log("Inicializando mundo...");

    this.addEntity(new Resource(new Point(200, 200), 1000));
    this.addEntity(new Resource(new Point(-200, -200), 1000));
    
    const p1Base = new Colony(new Point(-400, -300), 'player1');
    this.addEntity(p1Base);
    
    this.addEntity(new Tower(new Point(-350, -300), 'player1'));

    this.addEntity(new Harvester(new Point(-380, -280), 'player1'));
    this.addEntity(new Warrior(new Point(-380, -320), 'player1'));

    this.spawnMonster();
  }

  public addEntity(entity: Entity) {
    this.entities.set(entity.id, entity);
  }

  public start() {
    if (this.gameLoopInterval) return;
    console.log("Juego iniciado. - -- - - - - - -- -- - - -- --- ");
    this.gameLoopInterval = setInterval(() => this.update(), this.TICK_RATE_MS);
  }

  public stop() {
    if (this.gameLoopInterval) {
      clearInterval(this.gameLoopInterval);
      this.gameLoopInterval = null;
      console.log("🛑 Juego detenido.");
    }
  }

  private update() {
    this.tickCount++;
    
    // Spawn de Monstruos (cada 10 ticks)
    if (this.tickCount % 10 === 0) {
      this.spawnMonster();
    }

    // Actualizar cada entidad
    const allEntities = Array.from(this.entities.values());
    
    // Pasamos una referencia del estado del juego a las entidades
    const gameStateStub = { entities: allEntities };

    allEntities.forEach(entity => {
      entity.tick(gameStateStub);
    });

    // Limpieza de muertos
    allEntities.forEach(entity => {
      if (entity.isMarkedForDeletion) {
        this.entities.delete(entity.id);
      }
    });

    // Log de depuración
    this.logStatus();
  }

  private spawnMonster() {
    // Aparece en una posición aleatoria
    const x = (Math.random() * 200) + 200; // Entre 200 y 400
    const y = (Math.random() * 200) + 200;
    const monster = new Monster(new Point(x, y));
    this.addEntity(monster);
    console.log(`Nuevo Monstruo generado en (${x.toFixed(0)}, ${y.toFixed(0)})`);
  }

  private logStatus() {
    // Solo imprime cada cierto tiempo para no spammear
    if (this.tickCount % 5 === 0) {
        console.log(`--- Tick ${this.tickCount} | Entidades: ${this.entities.size} ---`);
        this.entities.forEach(e => {
             if (e instanceof Monster) console.log(`   👹 Monstruo en [${e.position.x.toFixed(0)}, ${e.position.y.toFixed(0)}]`);
             if (e instanceof Warrior) console.log(`   🛡️ Guerrero en [${e.position.x.toFixed(0)}, ${e.position.y.toFixed(0)}]`);
        });
    }
  }
}