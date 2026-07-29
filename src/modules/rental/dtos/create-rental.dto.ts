import { IsDateString, IsMongoId } from 'class-validator';

export class CreateRentalDto {
  @IsMongoId()
  tool!: string;

  @IsDateString()
  startDate!: string;

  @IsDateString()
  endDate!: string;
}
