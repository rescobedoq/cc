import { Router } from 'express';
import { ScriptController } from './controllers/ScriptController';
import { GameActionController } from './controllers/GameActionController';

const router = Router();

// --- Rutas de Scripts ---
// POST /api/script/upload
router.post('/script/upload', ScriptController.uploadScript);
// GET /api/script/:playerId
router.get('/script/:playerId', ScriptController.getScripts);

// --- Rutas de Juego ---
// POST /api/game/spawn -> Body: { playerId, unitType }
router.post('/game/spawn', GameActionController.handleSpawn);
// POST /api/game/reset
router.post('/game/reset', GameActionController.resetGame);

export default router;