import { Request, Response } from 'express';
import { gameManager } from '../../services/GameManager';

export class ScriptController {
  
  static uploadScript(req: Request, res: Response) {
    // 1. Recibir datos del cuerpo del POST
    const { playerId, unitType, code } = req.body;

    // 2. Validaciones básicas
    if (!playerId || !unitType) {
      return res.status(400).json({ error: 'Faltan datos (playerId, unitType)' });
    }

    if (typeof code !== 'string') {
        return res.status(400).json({ error: 'El código debe ser texto' });
    }

    // 3. Registrar en el Motor del Juego
    try {
        gameManager.engine.registerScript(playerId, unitType, code);
        
        console.log(`Script guardado: Player [${playerId}] - Unit [${unitType}]`);
        
        return res.json({ 
            success: true, 
            message: `Script de ${unitType} actualizado correctamente.` 
        });

    } catch (error) {
        console.error("Error guardando script:", error);
        return res.status(500).json({ error: 'Error interno al guardar el script' });
    }
  }

  // Opcional: Para recuperar el código al recargar la página
  static getScripts(req: Request, res: Response) {
      const { playerId } = req.params;
      const scripts = gameManager.engine.playerScripts[playerId] || {};
      return res.json(scripts);
  }
}