import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class ResetPasswordDto {
  @IsString()
  @IsUUID('4')
  resetPasswordToken: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  confirmPassword: string;
}
