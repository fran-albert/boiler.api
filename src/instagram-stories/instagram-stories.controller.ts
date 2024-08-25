import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { InstagramStoriesService } from './instagram-stories.service';
import { CreateInstagramStoryDto } from './dto/create-instagram-story.dto';
import { UpdateInstagramStoryDto } from './dto/update-instagram-story.dto';

@Controller('instagram-stories')
export class InstagramStoriesController {
  constructor(private readonly instagramStoriesService: InstagramStoriesService) { }

  @Post()
  create(@Body() createInstagramStoryDto: CreateInstagramStoryDto) {
    return this.instagramStoriesService.createStory(createInstagramStoryDto);
  }

  @Get()
  findAll() {
    return this.instagramStoriesService.findAll();
  }

  @Get('totalStories/:eventId/boss/:bossId')
  getRrrpForEventByBoss(@Param('eventId') eventId: string, @Param('bossId') bossId: string) {
    return this.instagramStoriesService.getRrrpForEventByBoss(bossId, eventId);
  }

  @Get('user/:userId/event/:eventId')
  async getStoriesForUserAndEvent(
    @Param('userId') userId: string,
    @Param('eventId') eventId: string
  ) {
    return await this.instagramStoriesService.getStoriesByRRPPForEvent(userId, eventId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.instagramStoriesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateInstagramStoryDto: UpdateInstagramStoryDto) {
    return this.instagramStoriesService.update(+id, updateInstagramStoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.instagramStoriesService.remove(+id);
  }
}
