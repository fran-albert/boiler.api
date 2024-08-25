import { Module, forwardRef } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { jwtConstants } from './constants/jwt.constant';
import { JwtModule } from '@nestjs/jwt';
// import { EmailModule } from 'src/email/email.module';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    //   JwtModule.registerAsync({
    //     imports: [ConfigModule],
    //     useFactory: async (configService: ConfigService) => ({
    //       secret: configService.get<string>('JWT_SECRET'),
    //       global: true,
    //       signOptions: { expiresIn: '1d' },
    //     }),
    //     inject: [ConfigService],
    //   }),
    // ],
    // EmailModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [JwtModule],
})
export class AuthModule {}
