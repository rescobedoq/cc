import { Structure } from './Structure';
import { Point } from '../../core/Point';
import { Entity } from '../../core/Entity';

export class Tower extends Structure {
  // Configuración de combate
  public damage: number = 5;      // Daño por disparo
  public range: number = 100;      // Rango de visión/ataque
  public fireRate: number = 5;     // Dispara cada 5 ticks (aprox 1 segundo si tick=200ms)
  
  // Estado interno
  private cooldown: number = 0;

  constructor(position: Point, ownerId: string) {
    // Vida: 300 (Resistente), Radio: 15, Owner: jugador
    super(position, 300, 10, ownerId);
    (this as any).type = 'Tower';
  }

  /**
   * Cerebro Automático de la Torre
   */
  tick(gameState: any): void {
    // 1. Manejo del Cooldown (Recarga)
    if (this.cooldown > 0) {
      this.cooldown--;
      return; // Aún está recargando
    }

    // 2. Buscar objetivos
    // Usamos el motor para ver qué hay alrededor
    // Nota: gameState.engine debe ser accesible
    const nearby = gameState.engine.getNearbyEntities(this.position, this.range, this.id);

    // 3. Filtrar Enemigos
    // - Que estén vivos
    // - Que NO sean de mi equipo (ownerId diferente)
    // - Que NO sean recursos neutrales (opcional, por si no quieres disparar a piedras)
    const enemies = nearby.filter((e: Entity) => 
        e.isAlive() && 
        e.ownerId !== this.ownerId && 
        e.ownerId !== 'neutral'
    );

    if (enemies.length === 0) return;

    // 4. Seleccionar el mejor objetivo (El más cercano)
    // Ordenamos el array por distancia
    enemies.sort((a: Entity, b: Entity) => 
        this.position.distanceTo(a.position) - this.position.distanceTo(b.position)
    );
    
    const target = enemies[0];

    // 5. ¡FUEGO!
    this.attack(target, gameState.engine);
  }

  private attack(target: Entity, engine: any) {
    // A. Aplicar Daño
    target.takeDamage(this.damage);
    
    // B. Reiniciar Cooldown
    this.cooldown = this.fireRate;

    // C. Efecto Visual (Animación)
    // Enviamos un evento al frontend para que dibuje el láser/bala
    if (engine.addEvent) {
        engine.addEvent({
            type: 'attack_laser',
            from: { x: this.position.x, y: this.position.y },
            to: { x: target.position.x, y: target.position.y },
            color: 'cyan', // O el color del jugador
            duration: 100 // ms que dura el dibujo
        });
    }

    // Log opcional
    // console.log(`[Tower] Disparó a ${target.constructor.name} (HP restante: ${target.health})`);
  }
}