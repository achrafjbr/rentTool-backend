import { Injectable } from '@nestjs/common';
import { Server } from 'socket.io';

@Injectable()
export class RealtimeService {
  private server!: Server;

  public setServer(server: Server) {
    this.server = server;
  }
  public notifyUser(userId: string, event: string, payload: unknown) {
    console.log('Payload', payload);
    this.server.to(`user:${userId}`).emit(event, payload);
  }
}
