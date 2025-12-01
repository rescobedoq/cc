import http from 'http';
import app from './app'; // Importamos la app configurada
import { SocketManager } from './server/sockets/SocketManager';
import { gameManager } from './server/services/GameManager';
import { TICK_RATE } from './config/constants';

// 1. Crear servidor HTTP con la app de Express
const server = http.createServer(app);

// 2. Inicializar Sockets sobre el servidor HTTP
const socketManager = new SocketManager(server);

// 4. Iniciar el Motor Lógico
gameManager.engine.start(); // Esto inicia el intervalo interno de lógica del motor

// 5. Bucle de RED (Separado de la lógica)
// El motor actualiza la lógica internamente. 
// Aquí solo nos encargamos de enviar la "foto" a los clientes.
setInterval(() => {
    // A. Obtener entidades
    const entities = Array.from(gameManager.engine.entities.values());

    // B. Transformar a formato ligero (DTO)
    const entitiesDTO = entities.map(e => ({
        id: e.id,
        type: (e as any).type || e.constructor.name,
        x: Number(e.position.x.toFixed(2)),
        y: Number(e.position.y.toFixed(2)),
        owner: e.ownerId,
        hp: Math.ceil(e.health),
        // Si es recurso, mandamos cantidad. Si es torre, rango.
        val: (e as any).amount !== undefined ? (e as any).amount : undefined
    }));

    // C. Obtener eventos (disparos, etc)
    const currentEvents = [...gameManager.engine.events];
    
    // D. Emitir
    socketManager.emitGameState({
        t: Date.now(),
        e: entitiesDTO,
        ev: currentEvents
    });

    // E. Importante: Limpiar eventos en el motor para no repetir animaciones
    gameManager.engine.events = [];

}, TICK_RATE);


// 6. Arrancar Servidor
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`\n🚀 CodeColony Backend listo!`);
  console.log(`   ➜ API: http://localhost:${PORT}/api`);
  console.log(`   ➜ WS:  ws://localhost:${PORT}\n`);
});