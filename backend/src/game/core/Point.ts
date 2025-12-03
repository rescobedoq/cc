export class Point {
  constructor(public x: number, public y: number) {}

  // Calcula la distancia a otro punto 
  public distanceTo(other: Point): number {
    return Math.sqrt(Math.pow(this.x - other.x, 2) + Math.pow(this.y - other.y, 2));
  }

  // Devuelve un nuevo punto moviéndose hacia el target una cierta distancia
  public moveTowards(target: Point, distance: number): Point {
    const totalDistance = this.distanceTo(target);
    
    // Si ya estamos más cerca que la distancia a mover, llegamos
    if (totalDistance <= distance) {
      return new Point(target.x, target.y);
    }

    const ratio = distance / totalDistance;
    const newX = this.x + (target.x - this.x) * ratio;
    const newY = this.y + (target.y - this.y) * ratio;

    return new Point(newX, newY);
  }
}