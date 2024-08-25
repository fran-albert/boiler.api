import { InstagramStory } from "src/instagram-stories/entities/instagram-story.entity";
import { Tickets } from "src/tickets/entities/tickets.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Event {

    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column()
    name: string;

    @Column()
    date: Date;

    @Column()
    expectedStoryCountPerUser: number;

    @Column({ nullable: true })
    image: string;

    @OneToMany(() => InstagramStory, instagramStory => instagramStory.event)
    instagramStories: InstagramStory[];

    @OneToMany(() => Tickets, tickets => tickets.event)
    ticketsFree: Tickets[];
}
