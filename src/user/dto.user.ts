import { IsNotEmpty, IsString, IsEmail } from 'class-validator';

export class UserUpdateDto {
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;
}
