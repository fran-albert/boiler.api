import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @IsString()
  @MinLength(1)
  name: string;

  @IsString()
  lastname: string;
  
  @IsEmail({},{message: 'Correo Electrónico incorrecto'})
  email: string;

  @IsString()
  @MinLength(6)
  @Transform(({ value }) => value.trim())
  password: string;

  @IsString()
  phone: string;

  @IsInt()
  @IsPositive()
  idCity: number;

  @IsString()
  @IsOptional()
  photo?: string;

  @IsInt()
  @IsPositive()
  idCategory: number;
}
