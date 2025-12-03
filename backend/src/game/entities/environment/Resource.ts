import { Entity } from '../../core/Entity';
import { Point } from '../../core/Point';

export class Resource extends Entity {
  // Cantidad de energía que le queda al cristal
  public amount: number;
  public type: string;

  constructor(position: Point, initialAmount: number) {
    // Llamada al padre:
    // Health: 1 (Irrelevante, no se destruyen a golpes, sino recolectando)
    // Radius: 15 (Tamaño físico para colisiones)
    // Owner: 'neutral' (No pertenece a nadie)
    super(position, 1, 15, 'neutral');
    
    this.amount = initialAmount;
    
    this.type = 'Resource';
  }

  tick(gameState: any): void {
    // Vacio ya que los recursos no hacen nada
  }

  //Método clave: Extraer energía de forma segura.
  public extract(capacity: number): number {
    if (this.amount <= 0) return 0;

    // Solo puedes tomar lo que queda o tu capacidad máxima, lo que sea menor.
    const actualExtracted = Math.min(this.amount, capacity);
    
    this.amount -= actualExtracted;

    // Si se vacía, el recurso "muere" y desaparece del mapa
    if (this.amount <= 0) {
      this.amount = 0;
      this.isMarkedForDeletion = true; // El GameEngine lo borrará en el próximo ciclo
    }

    return actualExtracted;
  }
}