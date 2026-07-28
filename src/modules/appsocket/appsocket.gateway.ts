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
import { Server } from 'socket.io';
import { Socket } from 'socket.io';
import { AuthenticationJwtService } from '../authentication/authentication.jwt.service';
import { JwtPayloadType } from 'src/common/types/types.auth';
import { CreateToolReviewDto } from '../review/dtos/create-tool-review.dto';
import { ReviewService } from '../review/review.service';
import { RealtimeService } from '../realtime/realtime.service';

@WebSocketGateway({
  cors: {
    credentials: false,
    origin: 'http://localhost:5173',
  },
})
// @UseGuards(AuthGuard)
export class AppsocketGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly realtimeService: RealtimeService,
    private readonly toolReviewService: ReviewService,
    private readonly authenticationJwtService: AuthenticationJwtService,
  ) {}

  @WebSocketServer()
  server: Server;
  afterInit() {
    console.log('afterInit func');
    this.realtimeService.setServer(this.server);
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
      client.join(`user:${payload.id}`);
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

  @SubscribeMessage('tool_review')
  async reviewTool(
    @ConnectedSocket() client: Socket,
    @MessageBody() dto: CreateToolReviewDto,
  ): Promise<void> {
    console.log('🔥 tool_review received');

    await this.toolReviewService.createToolReview(dto, client.data.user);
  }

  @SubscribeMessage('user_review')
  async reviewUser(
    @ConnectedSocket() client: Socket,
    @MessageBody() dto: CreateToolReviewDto,
  ): Promise<void> {
    console.log('🔥 user_review received');

    await this.toolReviewService.createUserReview(dto, client.data.user);
  }

  @SubscribeMessage('request_rental')
  rentRequest(
    @ConnectedSocket()
    client: Socket,
    @MessageBody()
    data: any,
  ) {}

  @SubscribeMessage('request_rental')
  rentApprove(
    @ConnectedSocket()
    client: Socket,
    @MessageBody()
    data: any,
  ) {}

  @SubscribeMessage('request_rental')
  rentReject(
    @ConnectedSocket()
    client: Socket,
    @MessageBody()
    data: any,
  ) {}
}
