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
import { CreateUserReviewDto } from '../review/dtos/create-user-review';

@WebSocketGateway({
  cors: {
    credentials: false,
    origin: [
      'http://localhost:5173',
      'http://localhost:4173',
      'https://renttool-frontend-production.up.railway.app',
    ],
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
    } catch (error: any) {
      console.log('Error:', error.message);
      client.disconnect();
    }
  }
  handleDisconnect(client: Socket) {}

  @SubscribeMessage('tool_review')
  async reviewTool(
    @ConnectedSocket() client: Socket,
    @MessageBody() dto: CreateToolReviewDto,
  ): Promise<void> {
    await this.toolReviewService.createToolReview(dto, client.data.user);
  }

  @SubscribeMessage('user_review')
  async reviewUser(
    @ConnectedSocket() client: Socket,
    @MessageBody() dto: CreateUserReviewDto,
  ): Promise<void> {
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
