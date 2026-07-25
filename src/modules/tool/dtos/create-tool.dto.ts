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
  @IsNotEmpty()
  @Min(1)
  pricePerDay!: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  dipositAmount!: number;

  @IsEnum(ToolStatus)
  @IsOptional()
  toolSatatus?: string;
}
