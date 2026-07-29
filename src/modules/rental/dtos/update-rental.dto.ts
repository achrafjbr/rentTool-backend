import { PartialType } from '@nestjs/mapped-types';
import { CreateRentalDto } from './create-rental.dto';

export class UreateRentalDto extends PartialType(CreateRentalDto) {}
