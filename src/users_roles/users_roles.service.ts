import { Injectable } from '@nestjs/common';
import { CreateUsersRoleDto } from './dto/create-users_role.dto';
import { UpdateUsersRoleDto } from './dto/update-users_role.dto';
import { UsersRole } from './entities/users_role.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UsersRolesService {
  constructor(
    @InjectRepository(UsersRole)
    private readonly usersRoleRepository: Repository<UsersRole>
  ) { }

  async findRolesByUserId(userId: string) {
    const usersRoles = await this.usersRoleRepository.find({
      where: { userId },
      relations: ['role'],
    });

    return usersRoles.map(userRole => ({
      name: userRole.role.name,
    }));
  }

  async assignRoleToUser(userId: string, roleId: string) {
    const userRole = this.usersRoleRepository.create({
      userId,
      roleId
    });

    return this.usersRoleRepository.save(userRole);
  }

  findAll() {
    return `This action returns all usersRoles`;
  }

  findOne(id: number) {
    return `This action returns a #${id} usersRole`;
  }

  update(id: number, updateUsersRoleDto: UpdateUsersRoleDto) {
    return `This action updates a #${id} usersRole`;
  }

  remove(id: number) {
    return `This action removes a #${id} usersRole`;
  }
}
