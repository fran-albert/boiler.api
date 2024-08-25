import { IsEmail, IsEnum, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { Gender } from 'src/common/enums/gender.enum';
import { User } from '../entities/user.entity';

export class CreateUserDto {

    @IsString()
    name: string;

    @IsString()
    lastName: string;

    @IsString()
    @MaxLength(8)
    dni: string;

    @IsEmail({}, { message: 'Correo Electrónico inválido' })
    email: string;

    @IsString()
    @MinLength(6)
    password: string;

    @IsEnum(Gender)
    gender: Gender;

    @IsString()
    @IsOptional()
    phone?: string;

    @IsString()
    photo: string;

    @IsString()
    instagram: string;

    @IsString()
    role: string;

    @IsString()
    @IsOptional()
    publicBossId?: string;

}
