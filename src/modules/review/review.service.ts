import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtPayloadType } from 'src/common/types/types.auth';
import { ToolService } from '../tool/tool.service';
import { NotificationService } from '../notification/notification.service';
import { NotificationType } from '../notification/schemas/notification.schema';
import {
  NOTIFICATION,
  TOOL_REVIEW,
  USER_REVIEW,
} from 'src/common/constants/constants';
import { ToolReview } from './schemas/tool-review.schema';
import { CreateToolReviewDto } from './dtos/create-tool-review.dto';
import { UserReview } from './schemas/user-review.schema';
import { CreateUserReviewDto } from './dtos/create-user-review';
import { UserService } from '../user/user.service';
import { RealtimeService } from '../realtime/realtime.service';
@Injectable()
export class ReviewService {
  constructor(
    @InjectModel(ToolReview.name)
    private readonly toolReviewModel: Model<ToolReview>,
    @InjectModel(ToolReview.name)
    private readonly userReviewModel: Model<UserReview>,
    private readonly toolService: ToolService,
    private readonly notificationService: NotificationService,
    private readonly realtimeService: RealtimeService,
    private readonly userService: UserService,
  ) {}

  async createToolReview(
    dto: CreateToolReviewDto,
    userPayload: JwtPayloadType,
  ): Promise<void> {
    console.log('createToolReview');
    // Get tool for use the tool owner later in notification .
    const tool = await this.toolService.getTool(String(dto.tool));
    if (!tool) {
      throw new NotFoundException();
    }

    // Create review.
    const review = await this.toolReviewModel.create({
      review: dto.review,
      tool: dto.tool,
      author: userPayload.id,
    });

    // Create notification,
    const createdNotification =
      await this.notificationService.createNotification({
        sender: userPayload.id,
        receiver: tool.owner,
        message: `${userPayload.fullName} a laissé un avis sur "${tool.name}".`,
        title: 'Nouvel avis',
        type: NotificationType.TOOL_REVIEW,
        related: review._id,
        isRead: false,
        isSeen: false,
      });

    const notification = this.notificationService.getNotificationById(
      createdNotification.id,
    );

    // notify owner
    this.realtimeService.notifyUser(
      tool.owner.toString(),
      NOTIFICATION,
      notification,
    );

    // this line was just for test, I'll delete it later
    this.realtimeService.notifyUser(tool.owner.toString(), TOOL_REVIEW, review);
  }

  async createUserReview(
    dto: CreateUserReviewDto,
    userPayload: JwtPayloadType,
  ) {
    const targetUser = await this.userService.getUserById(String(dto.to));

    if (!targetUser) {
      throw new NotFoundException('User not found');
    }

    // Create review.
    const review = await this.userReviewModel.create({
      review: dto.review,
      from: userPayload.id,
      to: dto.to,
    });

    // Create notification,
    const createdNotification =
      await this.notificationService.createNotification({
        sender: userPayload.id,
        receiver: targetUser._id,
        message: `${userPayload.fullName} a laissé un avis sur ton profil.`,
        title: 'Nouvel avis',
        type: NotificationType.USER_REVIEW,
        related: review._id,
        isRead: false,
        isSeen: false,
      });

    const notification = this.notificationService.getNotificationById(
      createdNotification.id,
    );

    // notify owner
    this.realtimeService.notifyUser(targetUser.id, NOTIFICATION, notification);

    // this line was just for test, I'll delete it later
    this.realtimeService.notifyUser(targetUser.id, USER_REVIEW, review);
  }

  async getToolReviews(toolId: string) {
    return await this.toolReviewModel
      .find({ tool: toolId })
      .populate({
        path: 'author',
        select: { fullName: 1, picture: 1 },
      })
      .sort({ createdAt: -1 })
      .exec();
  }

  async getUserReviews(userId: string) {
    return await this.userReviewModel
      .find({ to: userId })
      .populate({
        path: 'from',
        select: { fullName: 1, picture: 1 },
      })
      .sort({ createdAt: -1 })
      .exec();
  }
}
