import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import bodyParser from 'body-parser';
import { GameEngine } from '../game/GameEngine';

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(cors());
app.use(bodyParser.json());

// INICIALIZAR EL JUEGO
const game = new GameEngine();

// Bucle personalizado para conectar juego -> web sockets
setInterval(() => {
    game['update'](); 

    // Crear DTO ligero para enviar (Optimización futura necesaria)
    const stateToSend = {
        tick: game['tickCount'],
        entities: Array.from(game['entities'].values()).map(e => ({
            id: e.id,
            type: e.constructor.name,
            x: e.position.x,
            y: e.position.y,
            owner: e.ownerId
        }))
    };

    // EMITIR A TODOS LOS CLIENTES
    io.emit('gameState', stateToSend);

}, 200); 

// API PARA RECIBIR CÓDIGO
const playerScripts: Record<string, Record<string, string>> = {};

game['update'] = function() {
    // Pasamos los scripts al tick de las entidades
    const gameStateMock = { 
        entities: Array.from(this.entities.values()),
        scripts: playerScripts 
    };
    
    this.entities.forEach(e => e.tick(gameStateMock));
    // ... resto de lógica de limpieza ...
}

app.post('/api/upload-script', (req, res) => {
    const { code, unitType } = req.body;
    const playerId = 'player1'; // Hardcodeado para la prueba

    if (!playerScripts[playerId]) playerScripts[playerId] = {};
    playerScripts[playerId][unitType] = code;

    console.log(`Script recibido para ${unitType}: ${code}`);
    res.json({ success: true });
});

server.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
});