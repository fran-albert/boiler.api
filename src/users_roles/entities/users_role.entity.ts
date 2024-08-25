import { Role } from "src/roles/entities/role.entity";
import { User } from "src/users/entities/user.entity";
import { Entity, ManyToOne, PrimaryColumn, JoinColumn } from "typeorm";

@Entity()
export class UsersRole {

    @PrimaryColumn()
    userId: string;

    @PrimaryColumn()
    roleId: string;

    @ManyToOne(() => User, user => user.userRoles)
    @JoinColumn({ name: 'userId' })
    user: User;

    @ManyToOne(() => Role, role => role.userRoles)
    @JoinColumn({ name: 'roleId' })
    role: Role;

}
