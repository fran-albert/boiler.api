import { PartialType } from '@nestjs/mapped-types';
import { CreateInstagramStoryDto } from './create-instagram-story.dto';

export class UpdateInstagramStoryDto extends PartialType(CreateInstagramStoryDto) {}
