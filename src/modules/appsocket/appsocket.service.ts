import { Injectable } from '@nestjs/common';

import { Server } from 'socket.io';

@Injectable()
export class AppsocketService {
  private server!: Server;

  public setServer(server: Server) {
    this.server = server;
  }
  notifyUser(userId: string, event: string, payload: unknown) {
    this.server.to(`user:${userId}`).emit(event, payload);
  }
}
