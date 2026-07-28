import { PartialType } from '@nestjs/mapped-types';
import { CreateToolReviewDto } from './create-tool-review.dto';

export class UpdateToolReviewDto extends PartialType(CreateToolReviewDto) {}
