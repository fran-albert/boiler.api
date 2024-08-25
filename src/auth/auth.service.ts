import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcryptjs from 'bcryptjs';
// import { v4 as uuidv4 } from 'uuid';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { UsersService } from 'src/users/users.service';
import { RequestResetPasswordDto } from './dto/request-reset-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
// import { EmailService } from 'src/email/email.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    // private readonly emailService: EmailService,
  ) { }

  // async register(registerDto: RegisterDto, file: Express.Multer.File) {
  //   const playerExists = await this.usersService.findOneByEmail(
  //     registerDto.email,
  //   );

  //   if (playerExists) {
  //     throw new BadRequestException('Player already exists');
  //   }

  //   const newPlayer = {
  //     ...registerDto,
  //     password: await bcryptjs.hash(registerDto.password, 10),
  //     city: { id: registerDto.idCity },
  //     role: [Role.PLAYER],
  //     category: { id: registerDto.idCategory },
  //   };

  //   await this.usersService.create(newPlayer, file);

  //   return {
  //     message: 'User created successfully',
  //   };
  // }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmailWithPassword(
      loginDto.email,
    );
    if (!user) {
      throw new UnauthorizedException('Las credenciales son incorrectas');
    }

    const isPasswordValid = await bcryptjs.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('La contraseña es incorrecta');
    }

    // await this.usersService.updateLastLoginDate(player.id, new Date());
    const roles = user.userRoles.map(userRole => userRole.role.name);

    const payload = {
      email: user.email,
      id: user.id,
      photo: user.photo,
      roles: roles,
    };
    const token = await this.jwtService.signAsync(payload);

    return {
      token,
      email: user.email,
      id: user.id,
      photo: user.photo,
      roles: roles,
    };
  }

  async getProfile({ email, roles }: { email: string; roles: string }) {
    return await this.usersService.findOneByEmail(email);
  }

  // async requestResetPassword(
  //   requestResetPasswordDto: RequestResetPasswordDto,
  // ): Promise<void> {
  //   const user = await this.usersService.findUserByEmail(
  //     requestResetPasswordDto.email,
  //   );

  //   if (!user) {
  //     return;
  //   }

  //   const resetToken = uuidv4();
  //   user.resetPasswordToken = resetToken;
  //   await this.usersService.updateResetToken(user.id, resetToken);

  //   return await this.emailService.sendResetPasswordEmail(
  //     user.email,
  //     user.resetPasswordToken,
  //   );
  // }

  // async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<void> {
  //   const { resetPasswordToken, password, confirmPassword } = resetPasswordDto;

  //   if (password !== confirmPassword) {
  //     throw new BadRequestException('Las contraseñas no coinciden');
  //   }

  //   const user =
  //     await this.usersService.findOneByResetPasswordToken(resetPasswordToken);
  //   if (!user) {
  //     throw new BadRequestException('Token de reseteo inválido o expirado');
  //   }

  //   const hashedPassword = await bcryptjs.hash(password, 10);
  //   await this.usersService.updatePasswordWithToken(user.id, hashedPassword);

  //   await this.usersService.updateResetToken(user.id, null);
  // }
}
