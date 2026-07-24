import {
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()
  @IsString()
  fullName!: string;

  @IsNotEmpty()
  @IsPhoneNumber()
  phone!: string;

  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @IsStrongPassword()
  password!: string;
}
