import { Gender } from "src/common/enums/gender.enum";
import { InstagramStory } from "src/instagram-stories/entities/instagram-story.entity";
import { UsersRole } from "src/users_roles/entities/users_role.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {

    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column()
    name: string;

    @Column()
    lastName: string;

    @Column({ unique: true, nullable: false })
    dni: string;

    @Column({ unique: true, nullable: false })
    email: string;

    @Column({ nullable: false, select: false })
    password: string;

    @Column({ nullable: true })
    gender: Gender;

    // @Column({
    //     type: 'uuid',
    //     unique: true,
    //     name: 'reset_password_token',
    //     nullable: true,
    //     select: false,
    //   })
    //   resetPasswordToken: string;

    @Column()
    phone: string;

    @Column()
    photo: string;

    @Column()
    instagram: string;

    @ManyToOne(() => User, user => user.rrpp, { nullable: true})
    @JoinColumn({ name: 'bossId' })
    publicBoss: User;

    @OneToMany(() => User, user => user.publicBoss)
    rrpp: User[];

    @OneToMany(() => UsersRole, usersRole => usersRole.user)
    userRoles: UsersRole[];

    @OneToMany(() => InstagramStory, instagramStory => instagramStory.user)
    instagramStories: InstagramStory[];
}
