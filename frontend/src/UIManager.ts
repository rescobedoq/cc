// UIManager.ts - Maneja toda la UI (logs, stats, modals)

export class UIManager {
  private maxEnergy = 100;

  constructor() {
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    // Clear logs
    const clearLogsBtn = document.getElementById('clearLogsBtn');
    if (clearLogsBtn) {
      clearLogsBtn.addEventListener('click', () => this.clearLogs());
    }

    // Close modal
    const closeModalBtn = document.getElementById('closeModalBtn');
    if (closeModalBtn) {
      closeModalBtn.addEventListener('click', () => this.hideGameOver());
    }

    // ESC para cerrar modal
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.hideGameOver();
      }
    });
  }

  public updateStatus(connected: boolean): void {
    const dot = document.getElementById('statusDot');
    const text = document.getElementById('statusText');
    
    if (dot && text) {
      if (connected) {
        dot.classList.add('connected');
        text.textContent = 'Conectado';
      } else {
        dot.classList.remove('connected');
        text.textContent = 'Desconectado';
      }
    }
  }

  public updateStats(tick: number, entityCount: number, energy: number): void {
    const tickEl = document.getElementById('tickText');
    const countEl = document.getElementById('entityCount');
    const energyEl = document.getElementById('energyText');

    if (tickEl) tickEl.textContent = tick.toString();
    if (countEl) countEl.textContent = entityCount.toString();
    if (energyEl) energyEl.textContent = energy.toString();

    // Track max energy
    if (energy > this.maxEnergy) {
      this.maxEnergy = energy;
    }
  }

  public updatePing(ping: number): void {
    const pingEl = document.getElementById('pingText');
    if (pingEl) {
      pingEl.textContent = `${ping}ms`;
    }
  }

  public log(message: string, type: 'info' | 'success' | 'error' | 'warning' = 'info'): void {
    const logArea = document.getElementById('logArea');
    if (!logArea) return;

    const time = new Date().toLocaleTimeString();
    const logEntry = document.createElement('div');
    logEntry.className = `log-entry log-${type}`;
    logEntry.textContent = `[${time}] ${message}`;

    logArea.appendChild(logEntry);
    logArea.scrollTop = logArea.scrollHeight;

    // Limitar a 100 logs
    while (logArea.children.length > 100) {
      logArea.removeChild(logArea.firstChild!);
    }
  }

  public clearLogs(): void {
    const logArea = document.getElementById('logArea');
    if (logArea) {
      logArea.innerHTML = '';
      this.log('Logs limpiados', 'info');
    }
  }

  public showGameOver(reason: string, ticks: number): void {
    const modal = document.getElementById('gameOverModal');
    const reasonEl = document.getElementById('gameOverReason');
    const ticksEl = document.getElementById('finalTicks');
    const energyEl = document.getElementById('maxEnergy');

    if (modal) modal.style.display = 'flex';
    if (reasonEl) reasonEl.textContent = reason;
    if (ticksEl) ticksEl.textContent = ticks.toString();
    if (energyEl) energyEl.textContent = this.maxEnergy.toString();

    this.log(`🚨 GAME OVER: ${reason}`, 'error');
  }

  public hideGameOver(): void {
    const modal = document.getElementById('gameOverModal');
    if (modal) modal.style.display = 'none';
  }

  public showLoading(show: boolean): void {
    const loading = document.getElementById('loading');
    const game = document.getElementById('game-container');

    if (loading && game) {
      if (show) {
        loading.style.display = 'block';
        game.style.display = 'none';
      } else {
        loading.style.display = 'none';
        game.style.display = 'flex';
      }
    }
  }
}