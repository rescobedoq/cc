
// CanvasRenderer.ts - Maneja todo el renderizado del Canvas
import type { GameEntity, GameEvent, Camera } from './types';

export class CanvasRenderer {
  private ctx: CanvasRenderingContext2D;
  private canvas: HTMLCanvasElement;
  private camera: Camera = { x: 0, y: 0, zoom: 0.8 };

  // Para drag del mouse
  private isDragging = false;
  private lastMouseX = 0;
  private lastMouseY = 0;

  constructor(canvasId: string) {
    this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    this.ctx = this.canvas.getContext('2d')!;
    
    this.setupMouseControls();
    this.updateCameraInfo();
  }

  private setupMouseControls(): void {
    // Pan con mouse
    this.canvas.addEventListener('mousedown', (e) => {
      this.isDragging = true;
      this.lastMouseX = e.clientX;
      this.lastMouseY = e.clientY;
      this.canvas.style.cursor = 'grabbing';
    });

    this.canvas.addEventListener('mousemove', (e) => {
      if (this.isDragging) {
        const dx = e.clientX - this.lastMouseX;
        const dy = e.clientY - this.lastMouseY;
        
        this.camera.x -= dx / this.camera.zoom;
        this.camera.y -= dy / this.camera.zoom;
        
        this.lastMouseX = e.clientX;
        this.lastMouseY = e.clientY;
        this.updateCameraInfo();
      }
    });

    this.canvas.addEventListener('mouseup', () => {
      this.isDragging = false;
      this.canvas.style.cursor = 'grab';
    });

    this.canvas.addEventListener('mouseleave', () => {
      this.isDragging = false;
      this.canvas.style.cursor = 'grab';
    });

    // Zoom con rueda
    this.canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
      this.camera.zoom = Math.max(0.3, Math.min(2, this.camera.zoom * zoomFactor));
      this.updateCameraInfo();
    });

    this.canvas.style.cursor = 'grab';
  }

  public resetCamera(): void {
    this.camera = { x: 0, y: 0, zoom: 0.8 };
    this.updateCameraInfo();
  }

  public zoomIn(): void {
    this.camera.zoom = Math.min(2, this.camera.zoom * 1.2);
    this.updateCameraInfo();
  }

  public zoomOut(): void {
    this.camera.zoom = Math.max(0.3, this.camera.zoom / 1.2);
    this.updateCameraInfo();
  }

  private updateCameraInfo(): void {
    const info = document.getElementById('camera-info');
    if (info) {
      info.textContent = `(${Math.round(this.camera.x)}, ${Math.round(this.camera.y)}) | Zoom: ${this.camera.zoom.toFixed(2)}x`;
    }
  }

  public render(entities: GameEntity[], events: GameEvent[]): void {
    // Limpiar
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.ctx.save();
    
    // Aplicar cámara
    this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
    this.ctx.scale(this.camera.zoom, this.camera.zoom);
    this.ctx.translate(-this.camera.x, -this.camera.y);

    // Dibujar grid
    this.drawGrid();

    // Dibujar eventos (ataques)
    events.forEach(ev => this.drawEvent(ev));

    // Dibujar entidades
    entities.forEach(ent => this.drawEntity(ent));

    this.ctx.restore();
  }

  private drawGrid(): void {
    this.ctx.strokeStyle = '#1f1f1f';
    this.ctx.lineWidth = 1;

    const gridSize = 50;
    const startX = Math.floor((this.camera.x - this.canvas.width / 2 / this.camera.zoom) / gridSize) * gridSize;
    const endX = Math.ceil((this.camera.x + this.canvas.width / 2 / this.camera.zoom) / gridSize) * gridSize;
    const startY = Math.floor((this.camera.y - this.canvas.height / 2 / this.camera.zoom) / gridSize) * gridSize;
    const endY = Math.ceil((this.camera.y + this.canvas.height / 2 / this.camera.zoom) / gridSize) * gridSize;

    // Líneas verticales
    for (let x = startX; x <= endX; x += gridSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, startY);
      this.ctx.lineTo(x, endY);
      this.ctx.stroke();
    }

    // Líneas horizontales
    for (let y = startY; y <= endY; y += gridSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(startX, y);
      this.ctx.lineTo(endX, y);
      this.ctx.stroke();
    }

    // Ejes principales
    this.ctx.strokeStyle = '#444';
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.moveTo(0, startY);
    this.ctx.lineTo(0, endY);
    this.ctx.moveTo(startX, 0);
    this.ctx.lineTo(endX, 0);
    this.ctx.stroke();
  }

  private drawEntity(ent: GameEntity): void {
    this.ctx.save();
    this.ctx.translate(ent.x, ent.y);

    // Barra de vida
    if (ent.hp > 0 && ent.type !== 'Resource') {
      const maxHp = this.getMaxHp(ent.type);
      const hpPercent = ent.hp / maxHp;
      
      this.ctx.fillStyle = '#333';
      this.ctx.fillRect(-12, -20, 24, 4);
      
      this.ctx.fillStyle = hpPercent > 0.5 ? '#0f0' : hpPercent > 0.25 ? '#ff0' : '#f00';
      this.ctx.fillRect(-12, -20, 24 * hpPercent, 4);
    }

    // Cuerpo según tipo
    switch (ent.type) {
      case 'Colony':
        this.ctx.fillStyle = ent.owner === 'player1' ? '#4db8ff' : '#ff4d4d';
        this.ctx.fillRect(-25, -25, 50, 50);
        this.ctx.strokeStyle = 'white';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(-25, -25, 50, 50);
        // Símbolo
        this.ctx.fillStyle = 'white';
        this.ctx.font = 'bold 20px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText('🏰', 0, 0);
        break;

      case 'Tower':
        this.ctx.fillStyle = '#666';
        this.ctx.beginPath();
        this.ctx.arc(0, 0, 18, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.strokeStyle = ent.owner === 'player1' ? '#4db8ff' : '#ff4d4d';
        this.ctx.lineWidth = 4;
        this.ctx.stroke();
        break;

      case 'Warrior':
        this.ctx.fillStyle = '#ffff00';
        this.ctx.beginPath();
        this.ctx.moveTo(12, 0);
        this.ctx.lineTo(-10, 10);
        this.ctx.lineTo(-10, -10);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.strokeStyle = '#000';
        this.ctx.lineWidth = 1;
        this.ctx.stroke();
        break;

      case 'Harvester':
        this.ctx.fillStyle = '#ff8800';
        this.ctx.beginPath();
        this.ctx.arc(0, 0, 10, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.strokeStyle = '#000';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
        break;

      case 'Monster':
        this.ctx.fillStyle = '#a0a';
        this.ctx.rotate(Math.PI / 4);
        this.ctx.fillRect(-10, -10, 20, 20);
        this.ctx.strokeStyle = '#fff';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(-10, -10, 20, 20);
        break;

      case 'Resource':
        this.ctx.fillStyle = '#0ff';
        const size = Math.max(6, Math.min(15, (ent.val || 1000) / 80));
        this.ctx.rotate(Math.PI / 4);
        this.ctx.fillRect(-size, -size, size * 2, size * 2);
        this.ctx.strokeStyle = '#0aa';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(-size, -size, size * 2, size * 2);
        break;
    }

    this.ctx.restore();
  }

  private drawEvent(event: GameEvent): void {
    if (event.type === 'attack_laser' || event.type === 'attack_melee') {
      if (event.from && event.to) {
        this.ctx.beginPath();
        this.ctx.moveTo(event.from.x, event.from.y);
        this.ctx.lineTo(event.to.x, event.to.y);
        this.ctx.strokeStyle = event.color || '#fff';
        this.ctx.lineWidth = 3;
        this.ctx.stroke();
      }
    } else if (event.type === 'death') {
      // Efecto de muerte
      if (event.x !== undefined && event.y !== undefined) {
        this.ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
        this.ctx.beginPath();
        this.ctx.arc(event.x, event.y, 20, 0, Math.PI * 2);
        this.ctx.fill();
      }
    }
  }

  private getMaxHp(type: string): number {
    switch (type) {
      case 'Colony': return 1000;
      case 'Tower': return 300;
      case 'Warrior': return 120;
      case 'Monster': return 80;
      case 'Harvester': return 50;
      default: return 100;
    }
  }
}