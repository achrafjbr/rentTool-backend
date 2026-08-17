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
import {
  NotificationType,
  RelatedType,
} from '../notification/schemas/notification.schema';
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
import { UpdateToolReviewDto } from './dtos/update-tool-review.dto';
import { UpdateUserReviewDto } from './dtos/update-user-review.dto';
@Injectable()
export class ReviewService {
  constructor(
    @InjectModel(ToolReview.name)
    private readonly toolReviewModel: Model<ToolReview>,
    @InjectModel(UserReview.name)
    private readonly userReviewModel: Model<UserReview>,
    private readonly toolService: ToolService,
    private readonly notificationService: NotificationService,
    private readonly realtimeService: RealtimeService,
    private readonly userService: UserService,
  ) {}

  async createToolReview(
    dto: CreateToolReviewDto,
    userPayload: JwtPayloadType,
  ) {
    // Extract owner from tool.
    const tool = await this.toolService.getTool(dto.tool!.toString());

    if (!tool) {
      throw new NotFoundException('No tool found');
    }

    // Create review.
    const review = await this.toolReviewModel.create({
      review: dto.review,
      tool: dto.tool,
      author: userPayload.id,
    });

    // Create notification,
    const createNotification =
      await this.notificationService.createNotification({
        sender: userPayload.id,
        receiver: tool.owner.id.toString(),
        message: `${userPayload.fullName} a laissé un avis sur "${tool.name}".`,
        title: 'Nouvel avis',
        type: NotificationType.TOOL_REVIEW,
        // relatedTye: RelatedType.TOOL_REVIEW,
        related: review.id,
        isRead: false,
        isSeen: false,
      });

    const notification =
      await this.notificationService.populateNotification(createNotification);

    // notify owner
    this.realtimeService.notifyUser(
      tool.owner._id.toString(),
      NOTIFICATION,
      notification,
    );

    return await review.populate({
      path: 'author',
      select: { fullName: 1, picture: 1, createdAt: 1 },
    });
  }

  async createUserReview(
    dto: CreateUserReviewDto,
    userPayload: JwtPayloadType,
  ) {
    const targetUser = await this.userService.getUserById(String(dto.to));
    console.log('user', targetUser);
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
    const createNotification =
      await this.notificationService.createNotification({
        sender: userPayload.id,
        receiver: targetUser.id,
        message: `${userPayload.fullName} a laissé un avis sur ton profil.`,
        title: 'Nouvel avis',
        type: NotificationType.USER_REVIEW,
        // relatedTye: RelatedType.USER_REVIEW,
        related: review.id,
        isRead: false,
        isSeen: false,
      });

    const notification =
      await this.notificationService.populateNotification(createNotification);

    // notify owner
    this.realtimeService.notifyUser(targetUser.id, NOTIFICATION, notification);

    return await review.populate({
      path: 'from',
      select: { fullName: 1, picture: 1, createdAt: 1 },
    });
  }

  async getToolReviews(toolId: string) {
    return await this.toolReviewModel
      .find({ tool: toolId })
      .populate({
        path: 'author',
        select: { fullName: 1, picture: 1, createdAt: 1 },
      })
      .sort({ createdAt: -1 })
      .exec();
  }

  async getUserReviews(userId: string) {
    return await this.userReviewModel
      .find({ to: userId })
      .populate({
        path: 'from',
        select: { fullName: 1, picture: 1, createdAt: 1 },
      })
      .sort({ createdAt: -1 })
      .exec();
  }

  async updateToolReview(id: string, dto: UpdateToolReviewDto) {
    return await this.toolReviewModel.findByIdAndUpdate(id, dto, {
      returnDocument: 'after',
      projection: { __v: 0 },
    });
  }

  async updateUserReview(id: string, dto: UpdateUserReviewDto) {
    return await this.userReviewModel.findByIdAndUpdate(id, dto, {
      returnDocument: 'after',
      projection: { __v: 0 },
    });
  }

  async deleteToolReview(id: string) {
    return await this.toolReviewModel.findByIdAndDelete(id);
  }

  async deleteUserReview(id: string) {
    return await this.userReviewModel.findByIdAndDelete(id);
  }
}
