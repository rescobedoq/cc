import { Structure } from './Structure';
import { Point } from '../../core/Point';
import { GameEngine } from '../../GameEngine'; // Ajusta la ruta según tu estructura

import { GameState } from '../../../config/Game';

export class Colony extends Structure {
  // Propiedad única: El banco de energía del jugador
  public energy: number = 100; // Empezamos con un poco para que puedan crear algo
  public type: string;

  // Configuración de Costos (Balance del juego)
  private static UNIT_COSTS: Record<string, number> = {
    'Warrior': 50,
    'Harvester': 30,
    'Tower': 100
  };

  constructor(position: Point, ownerId: string) {
    // Vida: 1000 (Es resistente), Radio: 400 (Ocupa espacio)
    super(position, 1000, 700, ownerId);
    this.type = 'Colony'; // Importante para el frontend
  }

  /**
   * Ciclo de vida de la Colonia
   * Por ahora es pasiva, pero aquí podríamos poner regeneración de escudo
   */
  tick(gameState: GameState): void {
    // Regeneración pasiva muy lenta (opcional)
    if (this.health < 1000 && this.health > 0) {
      this.health += 0.05;
    }
  }

  /**
   * Método llamado por los Harvesters para depositar cristales
   */
  public depositResources(amount: number): void {
    if (amount <= 0) return;
    
    this.energy += amount;
    // Podrías emitir un evento visual aquí "Floating text +50"
    console.log(`[Colony ${this.ownerId}] Recibidos ${amount} energía. Total: ${this.energy}`);
  }

  /**
   * Intenta fabricar una unidad.
   * Retorna TRUE si tuvo éxito (para que el API sepa si cobrar o dar error).
   */
  public spawnUnit(unitType: string, engine: GameEngine): boolean {
    const cost = Colony.UNIT_COSTS[unitType];

    // 1. Validaciones
    if (!cost) {
      console.warn(`[Colony] Intento de crear unidad desconocida: ${unitType}`);
      return false;
    }
    
    if (this.energy < cost) {
      // console.log(`[Colony] Energía insuficiente. Tienes ${this.energy}, necesitas ${cost}`);
      return false;
    }

    // 2. Cobrar
    this.energy -= cost;

    // 3. Calcular posición de salida (Spawn Point)
    // No queremos que nazca DENTRO de la colonia, sino al lado.
    // Generamos un ángulo aleatorio para que no se amontonen siempre en el mismo sitio.
    const angle = Math.random() * Math.PI * 2;
    const distance = this.radius + 15; // Radio de la colonia + espacio seguro
    const spawnX = this.position.x + Math.cos(angle) * distance;
    const spawnY = this.position.y + Math.sin(angle) * distance;

    // 4. Ordenar al Motor que cree la unidad real
    // Nota: Aquí delegamos al engine porque él maneja la lista de entidades
    // Pasamos un string vacío como código inicial
    engine.spawnUnit(unitType, this.ownerId, ""); 
    
    // OJO: En tu implementación actual de spawnUnit en GameEngine, asegúrate de poder
    // pasarle las coordenadas (spawnX, spawnY). Si no, aparecerán en (0,0).
    
    return true;
  }
}