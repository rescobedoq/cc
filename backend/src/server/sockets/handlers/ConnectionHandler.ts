import { Server, Socket } from 'socket.io';

export class ConnectionHandler {
  static onConnect(io: Server, socket: Socket) {
    console.log(`Socket conectado: ${socket.id}`);

    // Cuando el cliente dice "Hola, soy el Jugador 1"
    socket.on('join_game', (data) => {
      console.log(`Usuario identificado: ${data.username || 'Anon'} (${socket.id})`);
      // Podríamos guardar la relación socket.id <-> playerId aquí
    });

    socket.on('disconnect', () => {
      console.log(`Socket desconectado: ${socket.id}`);
    });
    
    // Ping-Pong para medir latencia
    socket.on('ping', () => {
        socket.emit('pong', { t: Date.now() });
    });
  }
}