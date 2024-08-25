import { Module } from '@nestjs/common';
import { UsersRolesService } from './users_roles.service';
import { UsersRolesController } from './users_roles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersRole } from './entities/users_role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UsersRole])],
  controllers: [UsersRolesController],
  providers: [UsersRolesService],
  exports: [UsersRolesService]
})
export class UsersRolesModule { }
