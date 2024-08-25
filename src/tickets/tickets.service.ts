import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CreateTicketsDto } from './dto/create-tickets.dto';
import { UpdateTicketsDto } from './dto/update-tickets.dto';
import { Tickets } from './entities/tickets.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InstagramStoriesService } from 'src/instagram-stories/instagram-stories.service';
import { User } from 'src/users/entities/user.entity';
import { EventService } from 'src/event/event.service';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Tickets)
    private readonly ticketRepository: Repository<Tickets>,
    @Inject(forwardRef(() => InstagramStoriesService))
    private readonly instagramStoryService: InstagramStoriesService,
    private readonly eventService: EventService,
  ) { }
  create(createTicketsDto: CreateTicketsDto) {
    return 'This action adds a new tickets';
  }

  async finalizeEventAndGenerateTickets(eventId: string): Promise<User[]> {
    const event = await this.eventService.findOne(eventId);

    const users = await this.instagramStoryService.getUsersForEvent(eventId);
    const usersWithTickets = [];

    for (const user of users) {
      const existingTicket = await this.ticketRepository.findOne({
        where: {
          event: { id: eventId },
          user: { id: user.id },
        }
      });

      if (existingTicket) {
        usersWithTickets.push(user);
        continue;
      }

      const stories = await this.instagramStoryService.getStoriesForUserAndEvent(user.id, eventId);
      const allStoriesCompleted = stories.length >= event.expectedStoryCountPerUser;

      if (allStoriesCompleted) {
        const ticket = this.ticketRepository.create({
          user: { id: user.id },
          event: { id: eventId },
        });

        await this.ticketRepository.save(ticket);
        usersWithTickets.push(user);
      }
    }

    return usersWithTickets;
  }


  async checkAndCreateTicketForUser(eventId: string, userId: string): Promise<void> {
    const existingTicket = await this.ticketRepository.findOne({
      where: {
        event: { id: eventId },
        user: { id: userId },
      }
    });

    if (existingTicket) {
      return;  // Ya tiene un ticket, no hacemos nada
    }

    const totalExpectedStories = await this.instagramStoryService.getTotalExpectedStoriesForEvent(eventId);
    const stories = await this.instagramStoryService.getStoriesForUserAndEvent(userId, eventId);

    console.log(`Total expected stories: ${totalExpectedStories}, Stories completed by user ${userId}: ${stories.length}`);

    const allStoriesCompleted = stories.length === totalExpectedStories;

    if (allStoriesCompleted) {
      const ticket = this.ticketRepository.create({
        user: { id: userId },
        event: { id: eventId },
      });

      await this.ticketRepository.save(ticket);
      console.log(`Ticket created for user ${userId} for event ${eventId}`);
    } else {
      console.log(`User ${userId} has not completed all stories for event ${eventId}`);
    }
  }


  async checkAndCreateTicketsForEvent(eventId: string): Promise<User[]> {
    const users = await this.instagramStoryService.getUsersForEvent(eventId);
    const usersWithTickets = [];

    for (const user of users) {
      const existingTicket = await this.ticketRepository.findOne({
        where: {
          event: { id: eventId },
          user: { id: user.id },
        }
      });

      if (existingTicket) {
        usersWithTickets.push(user);
        continue;
      }

      const totalExpectedStories = await this.instagramStoryService.getTotalExpectedStoriesForEvent(eventId);
      const stories = await this.instagramStoryService.getStoriesForUserAndEvent(user.id, eventId);
      const allStoriesCompleted = stories.length === totalExpectedStories;

      if (allStoriesCompleted) {
        const ticket = this.ticketRepository.create({
          user: { id: user.id },
          event: { id: eventId },
        });

        await this.ticketRepository.save(ticket);
        usersWithTickets.push(user);
      }
    }

    return usersWithTickets;
  }

}
