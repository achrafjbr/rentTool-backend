import { Module } from '@nestjs/common';
import { ToolReviewController } from './tool-review.controller';
import { ToolReviewService } from './tool-review.service';

@Module({
  controllers: [ToolReviewController],
  providers: [ToolReviewService]
})
export class ToolReviewModule {}
