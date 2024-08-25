import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateInstagramStoryDto } from './dto/create-instagram-story.dto';
import { UpdateInstagramStoryDto } from './dto/update-instagram-story.dto';
import { InstagramStory } from './entities/instagram-story.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { EventService } from 'src/event/event.service';
import { TicketsService } from 'src/tickets/tickets.service';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class InstagramStoriesService {
  constructor(
    @InjectRepository(InstagramStory)
    private readonly instagramStoryRepository: Repository<InstagramStory>,
    private readonly usersServices: UsersService,
    private readonly eventService: EventService,
    private readonly ticketsService: TicketsService,
  ) { }

  async createStory(createInstagramStoryDto: CreateInstagramStoryDto): Promise<InstagramStory> {
    const user = await this.usersServices.findOne(createInstagramStoryDto.idUser);
    const event = await this.eventService.findOne(createInstagramStoryDto.idEvent);
    const newStory = this.instagramStoryRepository.create({
      ...createInstagramStoryDto,
      event: { id: event.id },
      user: { id: user.id },
      date: new Date(),
    });
    return await this.instagramStoryRepository.save(newStory);

  }

  findAll() {
    return `This action returns all instagramStories`;
  }


  async getTotalExpectedStoriesForEvent(eventId: string): Promise<number> {

    const totalStories = await this.instagramStoryRepository.count({
      where: { event: { id: eventId } },
    });

    return totalStories;
  }

  async getStoriesByRRPPForEvent(userId: string, eventId: string): Promise<InstagramStory[]> {

    await this.usersServices.findOne(userId);
    await this.eventService.findOne(eventId);

    // Obtener las historias del usuario para el evento especificado
    const stories = await this.instagramStoryRepository.find({
      where: {
        event: { id: eventId },
        user: { id: userId },
      },
    });

    return stories;
  }

  async getStoriesForUserAndEvent(userId: string, eventId: string): Promise<InstagramStory[]> {
    return this.instagramStoryRepository.find({
      where: {
        event: { id: eventId },
        user: { id: userId },
      }
    });
  }

  async getUsersForEvent(eventId: string): Promise<User[]> {
    const users = await this.instagramStoryRepository
      .createQueryBuilder('instagramStory')
      .innerJoinAndSelect('instagramStory.user', 'user')
      .where('instagramStory.eventId = :eventId', { eventId })
      .distinctOn(['user.id'])
      .getMany();

    return users.map(story => story.user);
  }

  async checkStoryStatus(userId: string, eventId: string): Promise<InstagramStory[]> {
    const stories = await this.instagramStoryRepository.find({
      where: {
        user: { id: userId },
        event: { id: eventId },
      },
    });

    return stories;
  }

  async getRrrpForEventByBoss(bossId: string, eventId: string): Promise<{ user: User, storiesStatus: boolean[] }[]> {
    const rrpp = await this.usersServices.findRRPPByBoss(bossId);

    if (rrpp.length === 0) {
      throw new NotFoundException('No se encontraron RRPP bajo este jefe.');
    }

    const event = await this.eventService.findOne(eventId);

    const result = [];

    for (const user of rrpp) {
      const stories = await this.instagramStoryRepository.find({
        where: {
          event: { id: eventId },
          user: { id: user.id },
        },
      });

      const storiesStatus = Array(event.expectedStoryCountPerUser).fill(false);

      for (let i = 0; i < stories.length; i++) {
        if (i < storiesStatus.length) {
          storiesStatus[i] = true;
        }
      }

      result.push({
        user,
        storiesStatus,
      });
    }

    result.sort((a, b) => {
      const aCompleted = a.storiesStatus.filter(status => status).length;
      const bCompleted = b.storiesStatus.filter(status => status).length;
      if (aCompleted === bCompleted) {
        for (let i = 0; i < a.storiesStatus.length; i++) {
          if (a.storiesStatus[i] !== b.storiesStatus[i]) {
            return b.storiesStatus[i] ? 1 : -1;
          }
        }
        return 0;
      }
      return bCompleted - aCompleted;
    });

    return result;
  }

  findOne(id: number) {
    return `This action returns a #${id} instagramStory`;
  }

  update(id: number, updateInstagramStoryDto: UpdateInstagramStoryDto) {
    return `This action updates a #${id} instagramStory`;
  }

  remove(id: number) {
    return `This action removes a #${id} instagramStory`;
  }
}
