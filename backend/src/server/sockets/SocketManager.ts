import { Server, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';
import { ConnectionHandler } from './handlers/ConnectionHandler';

export class SocketManager {
  private io: Server;

  constructor(httpServer: HttpServer) {
    this.io = new Server(httpServer, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"]
      }
    });

    this.io.on('connection', (socket: Socket) => {
      this.handleConnection(socket);
    });
  }

  private handleConnection(socket: Socket) {
    ConnectionHandler.onConnect(this.io, socket);
  }

  // ¡Método crucial! Este lo llamamos desde el GameLoop
  public emitGameState(state: any) {
    // 'volatile' significa: si el cliente va lento y pierde un paquete, 
    // no intentes reenviarlo, envía el siguiente (mejor para juegos en tiempo real)
    this.io.volatile.emit('game_tick', state);
  }
}