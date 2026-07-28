import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { Types } from 'mongoose';

export class CreateToolReviewDto {
  author?: Types.ObjectId;
  tool?: Types.ObjectId;

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(500)
  review!: string;
}
