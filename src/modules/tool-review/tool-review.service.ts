import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ToolReview } from './schemas/tool-review.schema';
import { Model } from 'mongoose';
import { CreateToolReviewDto } from './dtos/create-tool-review.dto';
import { JwtPayloadType } from 'src/common/types/types.auth';
import { ToolService } from '../tool/tool.service';
import { NotificationService } from '../notification/notification.service';
import { NotificationType } from '../notification/schemas/notification.schema';

@Injectable()
export class ToolReviewService {
  constructor(
    @InjectModel(ToolReview.name)
    private readonly reviewToolModel: Model<ToolReview>,
    private readonly toolService: ToolService,
    private readonly notificationService: NotificationService,
  ) {}

  async createReview(dto: CreateToolReviewDto, userPayload: JwtPayloadType) {
    // Get tool for use the tool owner later in notification .
    const tool = await this.toolService.getTool(dto.toolId);
    if (!tool) {
      throw new NotFoundException();
    }

    // create review.
    const review = await this.reviewToolModel.create({
      review: dto.review,
      tool: dto.toolId,
      author: userPayload.id,
    });

    // create notification,
    const notification = await this.notificationService.createNotification({
      sender: userPayload.id,
      receiver: tool.owner,
      message: `${userPayload.fullName} a laissé un avis sur "${tool.name}".`,
      title: 'Nouvel avis',
      type: NotificationType.TOOL_REVIEW,
      review: review._id,
    });
    // notify owner

    //     this.notificationService.notify(
    //         tool.ownerId.toString(),
    //         "notification",
    //         notification,
    //     );

    //     this.realtimeService.notifyUser(
    //         tool.ownerId.toString(),
    //         "tool_review",
    //         review,
    //     );
  }

  create;
}
