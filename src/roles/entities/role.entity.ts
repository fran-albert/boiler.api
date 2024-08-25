import { UsersRole } from "src/users_roles/entities/users_role.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";



@Entity()
export class Role {

    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column()
    name: string;

    @OneToMany(() => UsersRole, usersRole => usersRole.role)
    userRoles: UsersRole[];

}

