import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
  MaxLength,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  fullName!: string;

  @IsNotEmpty()
  @IsString()
  email!: string;

  @IsNotEmpty()
  @IsString()
  @IsStrongPassword()
  password!: string;

  @IsNotEmpty()
  @IsString()
  phone!: string;

  @IsOptional()
  @IsString()
  city!: string;

  @IsOptional()
  @IsString()
  picture!: string;

  @IsOptional()
  @MaxLength(800)
  @IsString()
  bio!: string;

  @IsOptional()
  @IsString()
  whatsapp!: string;
}
