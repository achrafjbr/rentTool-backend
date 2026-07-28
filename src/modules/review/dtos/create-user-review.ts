import {
  IsMongoId,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Types } from 'mongoose';

export class CreateUserReviewDto {
  @IsMongoId()
  @IsNotEmpty()
  to!: Types.ObjectId;

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(500)
  review!: string;
}
