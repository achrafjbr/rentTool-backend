import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { ToolStatus } from '../schemas/schema.tool';
import { Type } from 'class-transformer';

export class CreateToolDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(800)
  description!: string;

  @IsString()
  @IsNotEmpty()
  category!: string;

  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  @Min(1)
  pricePerDay!: number;

  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  @Min(1)
  depositAmount!: number;

  @IsEnum(ToolStatus)
  @IsOptional()
  toolSatatus?: string;
}
