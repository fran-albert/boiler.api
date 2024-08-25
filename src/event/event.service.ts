import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './entities/event.entity';
import { UpdateCountDto } from './dto/update-count.dto';
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
dayjs.extend(utc);
dayjs.extend(timezone);

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
  ) { }

  async create(createEventDto: CreateEventDto) {
    const dateEvent = dayjs.tz(createEventDto.date, 'America/Argentina/Buenos_Aires').toDate();
    const newEvent = this.eventRepository.create({
      ...createEventDto,
      date: dateEvent,
      expectedStoryCountPerUser: 1,
    });
    return this.eventRepository.save(newEvent);
  }

  findAll() {
    return this.eventRepository.find();
  }

  async findOne(id: string) {
    const event = await this.eventRepository.findOneBy({ id })
    if (!event) {
      throw new BadRequestException('Event not found');
    }
    return event;
  }

  async addHistory(eventId: string): Promise<Event> {
    const event = await this.findOne(eventId);
    event.expectedStoryCountPerUser += 1;
    return this.eventRepository.save(event);
  }


  async updateEvent(eventId: string, updateEventDto: UpdateEventDto): Promise<Event> {
    await this.eventRepository.update(eventId, updateEventDto);
    return this.eventRepository.findOne({ where: { id: eventId } });
  }

  async remove(id: string): Promise<string> {
    await this.eventRepository.delete({ id });
    return "Evento eliminado correctamente"
  }
}
