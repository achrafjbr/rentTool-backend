import { Module } from '@nestjs/common';
import { ToolReviewController } from './tool-review.controller';
import { ToolReviewService } from './tool-review.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ToolReview, ToolReviewSchema } from './schemas/tool-review.schema';
import { ToolModule } from '../tool/tool.module';
import { NotificationModule } from '../notification/notification.module';

@Module({
  controllers: [ToolReviewController],
  providers: [ToolReviewService],
  imports: [
    ToolModule,
    NotificationModule,
    MongooseModule.forFeature([
      { name: ToolReview.name, schema: ToolReviewSchema },
    ]),
  ],
})
export class ToolReviewModule {}
