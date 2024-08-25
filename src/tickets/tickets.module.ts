import { forwardRef, Module } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { TicketsController } from './tickets.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tickets } from './entities/tickets.entity';
import { InstagramStoriesModule } from 'src/instagram-stories/instagram-stories.module';
import { EventModule } from 'src/event/event.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Tickets]), 
    forwardRef(() => InstagramStoriesModule),
    EventModule
  ],
  controllers: [TicketsController],
  providers: [TicketsService],
  exports: [TicketsService],
})
export class TicketsModule { }
