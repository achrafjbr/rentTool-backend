import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { ParseObjectIdPipe } from '@nestjs/mongoose';
import { CreateToolReviewDto } from './dtos/create-tool-review.dto';
import type { JwtPayloadType } from 'src/common/types/types.auth';
import { CurrentUser } from 'src/common/decorators/decorators.currentUser';
import { CreateUserReviewDto } from './dtos/create-user-review';
import { AuthGuard } from 'src/common/decorators/decorator.authGuard';
import { UpdateToolReviewDto } from './dtos/update-tool-review.dto';
import { UpdateUserReviewDto } from './dtos/update-user-review.dto';

@Controller('review')
@UseGuards(AuthGuard)
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  /// -> DONE
  // POST   /reviews/tool
  // POST   /reviews/user
  // GETT    review/tool/:toolId/
  // GETT    review/users/:userId/

  /// ->I'll do this in V2
  // DELETE /reviews/tool/:id
  // DELETE /reviews/user/:id

  @Post('tool')
  async createToolReview(
    @Body() dto: CreateToolReviewDto,
    @CurrentUser() userPayload: JwtPayloadType,
  ) {
    return await this.reviewService.createToolReview(dto, userPayload);
  }

  @Post('user')
  async createUserReview(
    @Body() dto: CreateUserReviewDto,
    @CurrentUser() userPayload: JwtPayloadType,
  ) {
    return await this.reviewService.createUserReview(dto, userPayload);
  }

  @Get('tool/:toolId')
  async getToolReviews(@Param('toolId') toolId: string) {
    console.log('toolId', toolId);
    return this.reviewService.getToolReviews(toolId);
  }

  @Get('user/:userId')
  async getUserReviews(@Param('userId') userId: string) {
    console.log('userId', userId);
    return this.reviewService.getUserReviews(userId);
  }

  @Patch('tool/:id')
  async updateToolReview(
    @Param('id') id: string,
    @Body() dto: UpdateToolReviewDto,
  ) {
    return await this.reviewService.updateToolReview(id, dto);
  }

  @Patch('user/:id')
  async updateUserReview(
    @Param('id') id: string,
    @Body() dto: UpdateUserReviewDto,
  ) {
    return await this.reviewService.updateUserReview(id, dto);
  }

  @Delete('tool/:id')
  async deleteToolReview(@Param('id') id: string) {
    return await this.reviewService.deleteToolReview(id);
  }

  @Delete('user/:id')
  async deleteUserReview(@Param('id') id: string) {
    return await this.reviewService.deleteUserReview(id);
  }
}
