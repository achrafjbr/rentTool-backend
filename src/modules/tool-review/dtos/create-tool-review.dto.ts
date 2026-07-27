import {
  IsMongoId,
  IsNotEmpty,
  IsString,
  Length,
  MinLength,
} from 'class-validator';

export class CreateToolReviewDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 500)
  review!: string;

  @IsMongoId()
  toolId!: string;
}
