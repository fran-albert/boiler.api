import { Body, Controller, Get, Patch, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Auth } from './decorators/auth.decorator';
import { UserActiveInterface } from '../common/interface/user-active.interface';
import { ActiveUser } from '../common/decorators/active-user.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RequestResetPasswordDto } from './dto/request-reset-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { Role } from 'src/common/enums/role.enum';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  // @Auth(Role.ADMIN)
  // @Post('register')
  // register(
  //   @Body()
  //   registerDto: RegisterDto,
  //   file: Express.Multer.File,
  // ) {
  //   return this.authService.register(registerDto, file);
  // }

  @Post('login')
  login(
    @Body()
    loginDto: LoginDto,
  ) {
    return this.authService.login(loginDto);
  }

  @ApiBearerAuth()
  @Get('profile')
  getProfile(@ActiveUser() user: UserActiveInterface) {
    return this.authService.getProfile(user);
  }

  // @Patch('/request-reset-password')
  // requestResetPassword(
  //   @Body() requestResetPasswordDto: RequestResetPasswordDto,
  // ): Promise<void> {
  //   return this.authService.requestResetPassword(requestResetPasswordDto);
  // }

  // @Patch('/reset-password')
  // resetPassword(@Body() resetPasswordDto: ResetPasswordDto): Promise<void> {
  //   return this.authService.resetPassword(resetPasswordDto);
  // }
}
