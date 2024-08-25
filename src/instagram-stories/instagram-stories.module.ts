import { forwardRef, Module } from '@nestjs/common';
import { InstagramStoriesService } from './instagram-stories.service';
import { InstagramStoriesController } from './instagram-stories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InstagramStory } from './entities/instagram-story.entity';
import { UsersModule } from 'src/users/users.module';
import { EventModule } from 'src/event/event.module';
import { TicketsModule } from 'src/tickets/tickets.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([InstagramStory]),
    forwardRef(() => TicketsModule),
    UsersModule,
    EventModule
  ],
  controllers: [InstagramStoriesController],
  providers: [InstagramStoriesService],
  exports: [InstagramStoriesService]
})
export class InstagramStoriesModule { }
