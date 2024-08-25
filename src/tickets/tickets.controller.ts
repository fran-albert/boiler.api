import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { CreateTicketsDto } from './dto/create-tickets.dto';
import { UpdateTicketsDto } from './dto/update-tickets.dto';

@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) { }

  @Post()
  create(@Body() createTicketsDto: CreateTicketsDto) {
    return this.ticketsService.create(createTicketsDto);
  }

  @Get('/event/:idEvent/completed-users')
  async getUsersWithCompletedStories(@Param('idEvent') idEvent: string) {
    return this.ticketsService.checkAndCreateTicketsForEvent(idEvent);
  }

  @Post('/finalize/:id')
  async finalizeEvent(@Param('id') eventId: string) {
    return this.ticketsService.finalizeEventAndGenerateTickets(eventId);
  }


}
