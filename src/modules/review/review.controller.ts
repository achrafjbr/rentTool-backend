import { Controller, Get, Param, Post } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ParseObjectIdPipe } from '@nestjs/mongoose';
import { CreateToolReviewDto } from './dtos/create-tool-review.dto';
import type { JwtPayloadType } from 'src/common/types/types.auth';
import { CurrentUser } from 'src/common/decorators/decorators.currentUser';
import { CreateUserReviewDto } from './dtos/create-user-review';

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  /// -> DONE
  // POST   /reviews/tool
  // POST   /reviews/user
  // GETT    /tools/:toolId/reviews
  // GETT    /users/:userId/reviews

  /// ->I'll do this in V2
  // DELETE /reviews/tool/:id
  // DELETE /reviews/user/:id

  @Post('tool')
  async createToolReview(
    dto: CreateToolReviewDto,
    @CurrentUser() userPayload: JwtPayloadType,
  ) {
    return await this.reviewService.createToolReview(dto, userPayload);
  }

  @Post('user')
  async createUserReview(
    dto: CreateUserReviewDto,
    @CurrentUser() userPayload: JwtPayloadType,
  ) {
    return await this.reviewService.createUserReview(dto, userPayload);
  }

  @Get('tool/:toolId')
  async getToolReview(@Param('toolId', ParseObjectIdPipe) toolId: string) {
    this.reviewService.getToolReviews(toolId);
  }

  @Get('user/:userId')
  async getUserReview(@Param('userId', ParseObjectIdPipe) userId: string) {
    this.reviewService.getUserReviews(userId);
  }
}
