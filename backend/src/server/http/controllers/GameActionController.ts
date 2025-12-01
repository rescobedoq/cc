import { Request, Response } from 'express';
import { gameManager } from '../../services/GameManager';
import { Colony } from '../../../game/entities/structures/Colony';

export class GameActionController {

  // Acción: Crear una unidad gastando recursos
  static handleSpawn(req: Request, res: Response) {
    const { playerId, unitType } = req.body;

    if (!playerId || !unitType) {
        return res.status(400).json({ error: 'Faltan datos' });
    }

    // 1. Buscar la Colonia del jugador
    // (Nota: Esto es ineficiente con muchas entidades, pero válido para MVP)
    let myColony: Colony | undefined;
    
    for (const entity of gameManager.engine.entities.values()) {
        if (entity instanceof Colony && entity.ownerId === playerId) {
            myColony = entity;
            break;
        }
    }

    if (!myColony) {
        return res.status(404).json({ error: 'No tienes una colonia viva.' });
    }

    // 2. Intentar crear la unidad (La colonia valida el costo)
    const success = myColony.spawnUnit(unitType, gameManager.engine);

    if (success) {
        return res.json({ success: true, message: `${unitType} en producción.` });
    } else {
        return res.status(400).json({ error: 'Recursos insuficientes o tipo inválido.' });
    }
  }

  // Acción: Reiniciar el juego (Debug)
  static resetGame(req: Request, res: Response) {
      gameManager.engine.entities.clear();
      // Reinicializar lógica básica...
      // (Aquí deberías llamar a un método gameManager.engine.reset())
      return res.json({ message: "Mundo purgado." });
  }
}