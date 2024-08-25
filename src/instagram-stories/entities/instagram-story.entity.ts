import { Event } from "src/event/entities/event.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class InstagramStory {

    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column()
    name: string;

    @Column()
    date: Date;

    @Column()
    idUser: string;

    @ManyToOne(() => Event, event => event.instagramStories)
    event: Event;

    @ManyToOne(() => User, user => user.instagramStories)
    @JoinColumn({ name: "idUser" })
    user: User;

}
