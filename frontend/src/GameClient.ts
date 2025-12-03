import { io, Socket } from 'socket.io-client';

interface GameEntity {
  type: string;
  x: number;
  y: number;
  id?: string;
}

interface GameState {
  entities: GameEntity[];
}

export class GameClient {
  private socket: Socket;
  private ctx: CanvasRenderingContext2D;

  constructor(canvasId: string) {
    // 1. CONEXIÓN SOCKET
    this.socket = io('http://localhost:3000');
    
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    this.ctx = canvas.getContext('2d')!;
    
    // Centrar coordenadas (0,0 en el centro del canvas)
    this.ctx.translate(250, 250);
    
    this.setupSocketEvents();
  }

  private setupSocketEvents(): void {
    this.socket.on('connect', () => {
      const statusElement = document.getElementById('status');
      if (statusElement) {
        statusElement.innerText = "Conectado al Servidor";
      }
    });

    // 2. DIBUJAR EL MUNDO
    this.socket.on('gameState', (state: GameState) => {
      this.renderGameState(state);
    });
  }

  private renderGameState(state: GameState): void {
    // Limpiar (recordar que el 0,0 está en el centro ahora)
    this.ctx.clearRect(-250, -250, 500, 500);

    state.entities.forEach(ent => {
      this.ctx.beginPath();
      if (ent.type === 'Harvester') {
        this.ctx.fillStyle = 'green';
        this.ctx.arc(ent.x, ent.y, 8, 0, Math.PI * 2); // Círculo
      } else if (ent.type === 'Resource') {
        this.ctx.fillStyle = 'cyan';
        this.ctx.fillRect(ent.x - 5, ent.y - 5, 10, 10); // Cuadrado
      } else {
        this.ctx.fillStyle = 'red';
        this.ctx.fillRect(ent.x - 5, ent.y - 5, 10, 10);
      }
      this.ctx.fill();
      
      // ID Label
      this.ctx.fillStyle = 'white';
      this.ctx.font = '10px Arial';
      this.ctx.fillText(ent.type, ent.x + 10, ent.y);
    });
  }

  // 3. ENVIAR CÓDIGO (POST)
  public async deployCode(code: string): Promise<void> {
    try {
      await fetch('http://localhost:3000/api/upload-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          unitType: 'Harvester', 
          code: code 
        })
      });
      
      alert("Código Subido! Mira el canvas.");
    } catch (error) {
      console.error('Error deploying code:', error);
      alert("Error al subir el código");
    }
  }

  public disconnect(): void {
    this.socket.disconnect();
  }
}