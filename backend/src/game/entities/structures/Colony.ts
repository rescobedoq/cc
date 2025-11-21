import { Structure } from './Structure';
import { Point } from '../../core/Point';

export class Colony extends Structure {
  // Aquí se guarda la energía del jugador
  public energy: number = 0;
  
  constructor(position: Point, ownerId: string) {
    // Vida: 1000, Radio: 30 (Grande), Owner: el jugador
    super(position, 1000, 30, ownerId); // vida y radio por defecto
  }

  tick(gameState: any): void {
    // La colonia es pasiva por ahora. 
    // Más adelante aquí pondremos usar la energia disponible para crear unidades
    
    // Regeneración pasiva de vida
    if (this.health < 1000 && this.health > 0) {
        this.health += 0.1;
    }
  }

  public addEnergy(amount: number) {
    this.energy += amount;
  }
}