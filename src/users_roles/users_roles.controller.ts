import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsersRolesService } from './users_roles.service';
import { CreateUsersRoleDto } from './dto/create-users_role.dto';
import { UpdateUsersRoleDto } from './dto/update-users_role.dto';

@Controller('users-roles')
export class UsersRolesController {
  constructor(private readonly usersRolesService: UsersRolesService) {}

  @Get()
  findAll() {
    return this.usersRolesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersRolesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUsersRoleDto: UpdateUsersRoleDto) {
    return this.usersRolesService.update(+id, updateUsersRoleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersRolesService.remove(+id);
  }
}
