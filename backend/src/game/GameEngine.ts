import { Entity } from './core/Entity';
import { Point } from './core/Point';
import { Monster } from './entities/units/Monster';
import { Resource } from './entities/environment/Resource';
import { Warrior } from './entities/units/Warrior';
import { Colony } from './entities/structures/Colony';
import { Tower } from './entities/structures/Tower';
import { Harvester } from './entities/units/Harvester';
import { Unit } from './entities/units/Unit';

export class GameEngine {
  // Mapa de entidades vivas
  public entities: Map<string, Entity> = new Map(); 
  
  // Lista de eventos visuales (disparos, explosiones) del tick actual
  public events: any[] = []; 

  // Almacén de scripts de usuarios: ownerId -> { 'Warrior': 'código...', 'Harvester': '...' }
  // Cambiamos a un objeto simple o Map según prefieras. Aquí uso un objeto anidado para facilitar acceso.
  public playerScripts: Record<string, Record<string, string>> = {};

  private tickCount: number = 0;
  private gameLoopInterval: NodeJS.Timeout | null = null;
  private TICK_RATE_MS = 200; // 5 FPS

  constructor() {
    this.initializeWorld();
  }

  private initializeWorld() {
    console.log("Inicializando mundo...");

    // Recursos
    this.addEntity(new Resource(new Point(200, 200), 1000));
    this.addEntity(new Resource(new Point(-200, -200), 1000));
    
    // Jugador 1
    const p1Base = new Colony(new Point(-400, -300), 'player1');
    this.addEntity(p1Base);
    this.addEntity(new Tower(new Point(-350, -300), 'player1'));
    this.addEntity(new Harvester(new Point(-380, -280), 'player1'));
    this.addEntity(new Warrior(new Point(-380, -320), 'player1'));

    // Enemigo inicial
    this.spawnMonster();
  }

  public addEntity(entity: Entity) {
    this.entities.set(entity.id, entity);
  }

  /**
   * MÉTODO NUEVO: Registrar un evento visual
   * Las entidades llamarán a esto: engine.addEvent(...)
   */
  public addEvent(event: any) {
    this.events.push(event);
  }

  /**
   * MÉTODO NUEVO: Guardar/Actualizar script de usuario
   */
  public registerScript(playerId: string, unitType: string, code: string) {
    if (!this.playerScripts[playerId]) {
      this.playerScripts[playerId] = {};
    }
    this.playerScripts[playerId][unitType] = code;
    console.log(`Script registrado para ${playerId} [${unitType}]`);
  }

  public start() {
    if (this.gameLoopInterval) return;
    console.log("Juego iniciado.");
    // Usamos bind para no perder el contexto de 'this'
    this.gameLoopInterval = setInterval(() => this.updateWorld(), this.TICK_RATE_MS);
  }

  public stop() {
    if (this.gameLoopInterval) {
      clearInterval(this.gameLoopInterval);
      this.gameLoopInterval = null;
      console.log("🛑 Juego detenido.");
    }
  }

  public updateWorld() {
    this.tickCount++;
    
    // 1. Limpiar eventos del tick anterior (ya se enviaron o se perdieron)
    // Es vital limpiar esto, si no la lista crece infinitamente y explota la memoria.
    this.events = []; 

    // 2. Lógica Global (Spawn de Monstruos cada 50 ticks para no saturar)
    if (this.tickCount % 50 === 0) {
      this.spawnMonster();
    }

    // 3. Preparar el CONTEXTO para las entidades
    // Esto es lo que reciben en su método tick(gameState)
    const gameStateContext = {
      engine: this,              // Pasamos el motor entero para que usen addEvent y getNearby
      entities: this.entities,   // Acceso directo (lectura)
      scripts: this.playerScripts // Acceso a los scripts
    };

    // 4. Actualizar cada entidad
    // Usamos Array.from para iterar sobre una copia y evitar problemas si se borran durante el loop
    const allEntities = Array.from(this.entities.values());

    allEntities.forEach(entity => {
      try {
        entity.tick(gameStateContext);
      } catch (error) {
        console.error(`Error en entidad ${entity.id}:`, error);
      }
    });

    // 5. Limpieza de muertos
    allEntities.forEach(entity => {
      if (entity.isMarkedForDeletion) {
        // Opcional: Evento de muerte visual
        this.addEvent({ type: 'death', x: entity.position.x, y: entity.position.y });
        this.entities.delete(entity.id);
      }
    });

    // Log periódico
    this.logStatus();
  }

  public getNearbyEntities(center: Point, radius: number, excludeId?: string): Entity[] {
    const found: Entity[] = [];
    for (const entity of this.entities.values()) {
      if (excludeId && entity.id === excludeId) continue;
      if (!entity.isAlive()) continue;

      if (center.distanceTo(entity.position) <= radius) {
        found.push(entity);
      }
    }
    return found;
  }

  public spawnUnit(type: string, ownerId: string, code: string, x?: number, y?: number) {
    const startX = x !== undefined ? x : (Math.random() * 100);
    const startY = y !== undefined ? y : (Math.random() * 100);
    const pos = new Point(startX, startY);

    let unit: Unit;

    switch (type) {
      case 'Warrior': unit = new Warrior(pos, ownerId); break;
      case 'Harvester': unit = new Harvester(pos, ownerId); break;
      default: console.error("Tipo desconocido:", type); return;
    }

    // Si nos pasan código al crear (opcional), lo registramos globalmente
    if (code) {
        this.registerScript(ownerId, type, code);
    }

    this.addEntity(unit);
  }

  private spawnMonster() {
    // Generar lejos del centro para dar tiempo
    const angle = Math.random() * Math.PI * 2;
    const dist = 300 + Math.random() * 200; // Entre 300 y 500 de distancia
    const x = Math.cos(angle) * dist;
    const y = Math.sin(angle) * dist;
    
    const monster = new Monster(new Point(x, y));
    this.addEntity(monster);
    console.log(`⚠️ Monstruo en (${x.toFixed(0)}, ${y.toFixed(0)})`);
  }

  private logStatus() {
    if (this.tickCount % 20 === 0) { // Menos spam en consola
        console.log(`--- Tick ${this.tickCount} | Entidades: ${this.entities.size} | Scripts: ${Object.keys(this.playerScripts).length} ---`);
    }
  }
}