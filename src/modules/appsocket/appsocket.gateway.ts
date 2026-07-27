import { OnModuleInit, UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
  WsResponse,
} from '@nestjs/websockets';
import { AuthGuard } from 'src/common/decorators/decorator.authGuard';
import { AppsocketService } from './appsocket.service';
import { Server } from 'socket.io';
import { Socket } from 'socket.io';
import { AuthenticationJwtService } from '../authentication/authentication.jwt.service';
import { JwtPayloadType } from 'src/common/types/types.auth';

@WebSocketGateway({
  cors: {
    credentials: true,
    origin: 'http://localhost:5173',
  },
})
@UseGuards(AuthGuard)
export class AppsocketGateway
  implements OnModuleInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly appsocketService: AppsocketService,
    private readonly authenticationJwtService: AuthenticationJwtService,
  ) {}

  @WebSocketServer()
  server: Server;
  afterInit() {
    console.log('afterInit func');
    this.appsocketService.setServer(this.server);
  }
  onModuleInit() {
    console.log('onModuleInit func');
  }

  handleConnection(client: Socket, ...args: any[]) {
    const token = client.handshake.auth.token;
    if (!token) {
      client.disconnect();
      throw new WsException('no token provided');
    }
    try {
      const payload: JwtPayloadType =
        this.authenticationJwtService.verifyToken(token);
      client.data.user = payload;
      client.join(`user${payload.id}`);
      console.log(
        `🟢 User id: ${payload.id} | socketId: ${client.id} connected`,
      );
    } catch (error: any) {
      console.log('Error:', error.message);
      client.disconnect();
    }
  }
  handleDisconnect(client: Socket) {
    console.log(`🔴 ${client.data.user.id} disconnected`);
  }

  @SubscribeMessage('add_tool_review')
  reviewTool(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ): void {
    //-> data will be included 'reviewDto': {
    // from (id) :How sent the review,
    // to (id): Tool owner,
    // toolId,
    // review: the review comment,
    //}
    // 1 - create toolNotification.
    // 2 - create toolReview.
    // 3 - send (notify) in realtime the review & notification to the owner &
  }

  @SubscribeMessage('add_user_review')
  reviewUser(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ): void {}
}
