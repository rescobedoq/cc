import { Entity } from './core/Entity';
import { Point } from './core/Point';
import { Monster } from './entities/units/Monster';
import { Resource } from './entities/environment/Resource';
import { Warrior } from './entities/units/Warrior';
import { Colony } from './entities/structures/Colony';
import { Tower } from './entities/structures/Tower';
import { Harvester } from './entities/units/Harvester';
import { Unit } from './entities/units/Unit';

import { Event, GameState } from '../config/Game';
import { TICK_RATE } from '../config/constants';

import { gameManager } from '../server/services/GameManager';
import { Structure } from './entities/structures/Structure';

export class GameEngine {
  // Mapa de entidades vivas
  public entities: Map<string, Entity> = new Map(); 
  
  // Lista de eventos visuales (disparos, explosiones) del tick actual
  public events: Event[] = []; 

  // Almacén de scripts de usuarios: ownerId -> { 'Warrior': 'código...', 'Harvester': '...' }
  // Cambiamos a un objeto simple o Map según prefieras. Aquí uso un objeto anidado para facilitar acceso.
  public playerScripts: Record<string, Record<string, string>> = {};

  private tickCount: number = 0;
  private gameLoopInterval: NodeJS.Timeout | null = null;
  private dificultyLevel: number = 100; 
  private monstersPerWave: number = 2; 

  // Referencia rápida a la colonia del jugador principal (juego de un solo jugador)
  private colony: Colony;

  constructor() {
    this.colony = new Colony(new Point(0, 0), 'player1');
    this.addEntity(this.colony);
    
    this.initializeWorld();
  }

  public getGameLoopInterval() {
    return this.gameLoopInterval;
  }

  public initializeWorld() {
    console.log("Inicializando mundo...");

    // Recursos
    this.addEntity(new Resource(new Point(200, 200), 1000));
    this.addEntity(new Resource(new Point(-200, -200), 1000));
    
    // Jugador (desactivado para implementar aviso de game over)
    //this.addEntity(new Tower(new Point(-80, 0), 'player1'));
    //this.addEntity(new Tower(new Point(80, 0), 'player1'));

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
  public addEvent(event: Event) {
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
    this.gameLoopInterval = setInterval(() => this.updateWorld(), TICK_RATE);
  }

  public stop() {
    if (this.gameLoopInterval) {
      clearInterval(this.gameLoopInterval);
      this.gameLoopInterval = null;
      console.log("Juego detenido.");
    }
  }

  public updateWorld() {
    this.tickCount++;
    this.dificultyLevel -= 0.001
    
    // 1. Limpiar eventos del tick anterior (ya se enviaron o se perdieron)
    this.events = []; 

    this.updateDifficulty();

    // 2. Lógica Global - Spawn de Monstruos y Recursos
    if (this.tickCount % Math.floor(this.dificultyLevel) === 0) {
      this.spawnMonsterWave();
    }

    if (this.tickCount % 350 === 0) {
      this.spawnResource();
    }

    // 3. Preparar el CONTEXTO para las entidades
    // Esto es lo que reciben en su método tick(gameState)
    const gameStateContext: GameState = {
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

    if (this.colony && !this.colony.isAlive()) {
      console.log("La colonia ha sido destruida. Fin del juego. x_x");
      this.stop();
    }

    // Log periódico
    this.logStatus();
  }

  private updateDifficulty() {
    const timeInSeconds = this.tickCount / 60; // Asumiendo 60 ticks/segundo

    // Cada 30 segundos, reducir el intervalo (spawn más frecuente)
    if (this.tickCount % (30 * 60) === 0 && this.dificultyLevel > 100) {
      this.dificultyLevel -= 20;
      console.log(`⚠️ Dificultad aumentada! Spawn cada ${Math.floor(this.dificultyLevel)} ticks`);
    }

    // Cada 45 segundos, aumentar cantidad de monstruos por oleada
    if (this.tickCount % (45 * 60) === 0 && this.monstersPerWave < 5) {
      this.monstersPerWave++;
      console.log(`⚠️ Oleada aumentada! ${this.monstersPerWave} monstruos por spawn`);
    }

    // Opcional: Dificultad continua (más suave)
    if (this.dificultyLevel > 100) {
      this.dificultyLevel -= 0.01; // Reducción gradual
    }
  }

  private spawnMonsterWave() {
    for (let i = 0; i < this.monstersPerWave; i++) {
      // Posiciones aleatorias en los bordes del mapa
      const side = Math.floor(Math.random() * 4);
      let x = 0, y = 0;

      switch(side) {
        case 0: // Arriba
          x = (Math.random() - 0.5) * 400;
          y = -300;
          break;
        case 1: // Derecha
          x = 300;
          y = (Math.random() - 0.5) * 400;
          break;
        case 2: // Abajo
          x = (Math.random() - 0.5) * 400;
          y = 300;
          break;
        case 3: // Izquierda
          x = -300;
          y = (Math.random() - 0.5) * 400;
          break;
        }

      const monster = new Monster(new Point(x, y));
      this.addEntity(monster);
      
      console.log(`👹 Monstruo spawneado en (${x.toFixed(0)}, ${y.toFixed(0)})`);
    }
  }

  public reset() {
    console.log("Reseteando mundo...");
      
      // 1. Detener el juego
    this.stop();
      
      // 2. Limpiar todo
    this.entities.clear();
    this.events = [];
    this.playerScripts = {};
    this.tickCount = 0;

    this.dificultyLevel = 100;
    this.monstersPerWave = 2;
      
      // 3. Reinicializar
    this.colony = new Colony(new Point(0, 0), 'player1'); // ← Nueva referencia
    this.addEntity(this.colony);
    this.initializeWorld();
      
    // 4. Reiniciar el juego
    this.start();
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

    let unit: Unit | Structure;

    switch (type) {
      case 'Warrior': unit = new Warrior(pos, ownerId); break;
      case 'Harvester': unit = new Harvester(pos, ownerId); break;
      case 'Tower': unit = new Tower(pos, ownerId); break;
      default: console.error("Tipo desconocido:", type); return;
    }

    // Si nos pasan código al crear (opcional), lo registramos globalmente
    if (code) {
        this.registerScript(ownerId, type, code);
    }

    this.addEntity(unit);
  }

  public spawnMonster() {
    const angle = Math.random() * Math.PI * 2;
    const distance = 300;
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;
    
    const monster = new Monster(new Point(x, y));
    this.addEntity(monster);
    console.log(`👹 Monstruo spawneado en (${x.toFixed(0)}, ${y.toFixed(0)})`);
  }

  private spawnResource () {
    const angle = Math.random() * Math.PI * 2;
    const dist = 100 + Math.random() * 400;
    const x = Math.cos(angle) * dist;
    const y = Math.sin(angle) * dist;

    const resource = new Resource(new Point(x, y), 1000);
    this.addEntity(resource);
    console.log(`Recurso en (${x.toFixed(0)}, ${y.toFixed(0)})`);
  }

  private logStatus() {
    if (this.tickCount % 20 === 0) { // Menos spam en consola
        console.log(`--- Tick ${this.tickCount} | Entidades: ${this.entities.size} | Scripts: ${Object.keys(this.playerScripts).length} ---`);
    }
  }
}