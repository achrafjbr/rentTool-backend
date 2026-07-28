import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ToolModule } from '../tool/tool.module';
import { NotificationModule } from '../notification/notification.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ToolReview, ToolReviewSchema } from './schemas/tool-review.schema';
import { UserReview, UserReviewSchema } from './schemas/user-review.schema';
import { UserModule } from '../user/user.module';
import { RealtimeModule } from '../realtime/realtime.module';
import { ReviewController } from './review.controller';

@Module({
  providers: [ReviewService],
  controllers: [ReviewController],
  imports: [
    RealtimeModule,
    ToolModule,
    NotificationModule,
    UserModule,
    MongooseModule.forFeature([
      { name: ToolReview.name, schema: ToolReviewSchema },
      { name: UserReview.name, schema: UserReviewSchema },
    ]),
  ],
  exports: [ReviewService],
})
export class ReviewModule {}
