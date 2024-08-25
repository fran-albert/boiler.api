import { Transform } from 'class-transformer';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Correo Electrónico incorrecto' })
  email: string;

  @IsString()
  @Transform(({ value }) => value.trim())
  password: string;
}
