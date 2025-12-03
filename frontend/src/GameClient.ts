// GameClient.ts - Cliente principal del juego

import { io, Socket } from 'socket.io-client';
import type { GameTickData } from './types';  // ← Solo GameTickData
import { CanvasRenderer } from './CanvasRenderer';
import { UIManager } from './UIManager';

export class GameClient {
  private socket: Socket;
  private renderer: CanvasRenderer;
  private ui: UIManager;
  private readonly API_URL = 'http://localhost:3000';
  private readonly PLAYER_ID = 'player1';

  // Estado actual
  private currentTick = 0;
  private currentEnergy = 100;

  constructor() {
    this.renderer = new CanvasRenderer('gameCanvas');
    this.ui = new UIManager();

    // Conectar Socket
    this.socket = io(this.API_URL);
    this.setupSocketEvents();
    this.setupUIEvents();

    // Ping loop
    this.startPingLoop();
  }

  private setupSocketEvents(): void {
    this.socket.on('connect', () => {
      this.ui.updateStatus(true);
      this.ui.log('Conectado al servidor ✅', 'success');
      this.ui.showLoading(false);
      
      // Identificarse
      this.socket.emit('join_game', { username: 'Player' });
    });

    this.socket.on('disconnect', () => {
      this.ui.updateStatus(false);
      this.ui.log('Desconectado del servidor ❌', 'error');
    });

    // EVENTO PRINCIPAL: Recibir estado del juego
    this.socket.on('game_tick', (data: GameTickData) => {
      this.handleGameTick(data);
    });

    // Game Over
    this.socket.on('game_over', (data: { reason: string }) => {
      this.ui.showGameOver(data.reason || 'Game Over', this.currentTick);
    });
  }

  private handleGameTick(data: GameTickData): void {
    this.currentTick = data.t;

    // Calcular energía actual (buscar Colony del jugador)
    const colony = data.e.find(e => 
      e.type === 'Colony' && e.owner === this.PLAYER_ID
    ) as any;
    
    if (colony && colony.energy !== undefined) {
      this.currentEnergy = colony.energy;
    }

    // Actualizar UI
    this.ui.updateStats(this.currentTick, data.e.length, this.currentEnergy);

    // Renderizar
    this.renderer.render(data.e, data.ev || []);
  }

  private setupUIEvents(): void {
    // Botones de deploy de código
    document.querySelectorAll('.deploy-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const unitType = (e.target as HTMLElement).getAttribute('data-unit');
        if (unitType) {
          this.deployCode(unitType);
        }
      });
    });

    // Botones de spawn
    document.querySelectorAll('.spawn-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const unitType = (e.target as HTMLElement).getAttribute('data-unit');
        if (unitType) {
          this.spawnUnit(unitType);
        }
      });
    });

    // Botón reset
    const resetBtn = document.getElementById('resetBtn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => this.resetGame());
    }

    // Botón restart (en modal)
    const restartBtn = document.getElementById('restartBtn');
    if (restartBtn) {
      restartBtn.addEventListener('click', () => {
        this.ui.hideGameOver();
        this.resetGame();
      });
    }

    // Controles de cámara
    const resetCameraBtn = document.getElementById('resetCameraBtn');
    if (resetCameraBtn) {
      resetCameraBtn.addEventListener('click', () => {
        this.renderer.resetCamera();
        this.ui.log('Cámara centrada', 'info');
      });
    }

    const zoomInBtn = document.getElementById('zoomInBtn');
    if (zoomInBtn) {
      zoomInBtn.addEventListener('click', () => this.renderer.zoomIn());
    }

    const zoomOutBtn = document.getElementById('zoomOutBtn');
    if (zoomOutBtn) {
      zoomOutBtn.addEventListener('click', () => this.renderer.zoomOut());
    }
  }

  private async deployCode(unitType: string): Promise<void> {
    const textareaId = unitType === 'Harvester' ? 'harvesterCode' : 'warriorCode';
    const textarea = document.getElementById(textareaId) as HTMLTextAreaElement;
    
    if (!textarea) return;

    const code = textarea.value;
    this.ui.log(`Subiendo código para ${unitType}...`, 'info');

    try {
      const response = await fetch(`${this.API_URL}/api/script/upload`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playerId: this.PLAYER_ID,
          unitType: unitType,
          code: code
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        this.ui.log(`✅ ${data.message}`, 'success');
      } else {
        this.ui.log(`⚠️ Error: ${data.error || 'Error desconocido'}`, 'error');
      }
    } catch (error) {
      this.ui.log(`❌ Error de red: ${error}`, 'error');
    }
  }

  private async spawnUnit(unitType: string): Promise<void> {
    const cost = unitType === 'Warrior' ? 50 : 30;

    if (this.currentEnergy < cost) {
      this.ui.log(`⚠️ Energía insuficiente. Tienes ${this.currentEnergy}, necesitas ${cost}`, 'warning');
      return;
    }

    this.ui.log(`Creando ${unitType}...`, 'info');

    try {
      const response = await fetch(`${this.API_URL}/api/game/spawn`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playerId: this.PLAYER_ID,
          unitType: unitType
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        this.ui.log(`✅ ${unitType} creado!`, 'success');
      } else {
        this.ui.log(`⚠️ ${data.error || 'Error al crear unidad'}`, 'error');
      }
    } catch (error) {
      this.ui.log(`❌ Error de red: ${error}`, 'error');
    }
  }

  private async resetGame(): Promise<void> {
    if (!confirm('¿Seguro que quieres reiniciar el mundo? Se perderá todo el progreso.')) {
      return;
    }

    this.ui.log('Reiniciando mundo...', 'info');

    try {
      const response = await fetch(`${this.API_URL}/api/game/reset`, {
        method: 'POST'
      });

      if (response.ok) {
        this.ui.log('♻️ Mundo reiniciado', 'success');
        this.ui.clearLogs();
      }
    } catch (error) {
      this.ui.log(`❌ Error al reiniciar: ${error}`, 'error');
    }
  }

  private startPingLoop(): void {
    setInterval(() => {
      const start = Date.now();
      this.socket.emit('ping');
      this.socket.once('pong', () => {
        const latency = Date.now() - start;
        this.ui.updatePing(latency);
      });
    }, 2000);
  }

  public disconnect(): void {
    this.socket.disconnect();
  }
}