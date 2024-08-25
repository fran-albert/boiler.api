import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UsersRolesService } from 'src/users_roles/users_roles.service';
import { RolesService } from 'src/roles/roles.service';
import { isUUID } from 'class-validator';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly usersRolesService: UsersRolesService,
    private readonly rolesService: RolesService
  ) { }

  async create(createUserDto: CreateUserDto) {
    await this.findOneByEmail(createUserDto.email);
    await this.findOneByDNI(createUserDto.dni);

    const role = await this.rolesService.findRoleByName(createUserDto.role);
    if (!role) {
      throw new Error('Role not found');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    if (createUserDto.publicBossId) {
      const publicBoss = await this.userRepository.findOne({ where: { id: createUserDto.publicBossId } });
      if (!publicBoss) {
        throw new Error('PublicBoss not found');
      }
      user.publicBoss = publicBoss;
    }

    const savedUser = await this.userRepository.save(user);
    await this.usersRolesService.assignRoleToUser(savedUser.id, role.id);

    return savedUser;
  }

  async findAll() {
    const users = await this.userRepository.find({
      order: { lastName: 'ASC' },
    });

    const usersWithRoles = await Promise.all(users.map(async user => {
      const roles = await this.usersRolesService.findRolesByUserId(user.id);
      return { ...user, roles };
    }));

    return usersWithRoles;
  }

  async findOneByEmail(email: string) {
    const user = await this.userRepository.findOneBy({ email });

    if (user) {
      throw new BadRequestException('El email ya está en uso');
    }

    return user;
  }

  async findOneByDNI(dni: string) {
    const user = await this.userRepository.findOneBy({ dni });

    if (user) {
      throw new BadRequestException('El dni ya está en uso');
    }

    return user;
  }

  async findRRPPByBoss(bossId: string): Promise<User[]> {

    if (!bossId || !isUUID(bossId)) {
      throw new BadRequestException('UUID del jefe no es válido o está indefinido');
    }

    const boss = await this.userRepository.findOne({
      where: { id: bossId },
      relations: ['rrpp'],
    });


    if (!boss) {
      console.error('Jefe de Publicas no encontrado');
      throw new NotFoundException('Jefe de Publicas no encontrado');
    }

    if (boss.rrpp.length === 0) {
      console.warn('No se encontraron RRPP bajo este jefe.');
      throw new NotFoundException('No se encontraron RRPP bajo este jefe.');
    }

    return boss.rrpp;
  }

  async findByEmailWithPassword(email: string) {
    return this.userRepository.findOne({
      where: { email },
      select: ['id', 'name', 'email', 'password', 'photo'],
      relations: ['userRoles', 'userRoles.role'],
    });
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['publicBoss'],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    const roles = await this.usersRolesService.findRolesByUserId(user.id);

    return {
      ...user,
      roles,
    };
  }


  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
