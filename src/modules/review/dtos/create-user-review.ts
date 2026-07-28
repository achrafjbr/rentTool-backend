import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { Types } from 'mongoose';

export class CreateUserReviewDto {
  to?: Types.ObjectId;

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(500)
  review!: string;
}
