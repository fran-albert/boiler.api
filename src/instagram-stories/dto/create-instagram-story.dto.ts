import { IsString } from "class-validator";

export class CreateInstagramStoryDto {

    @IsString()
    idEvent: string

    @IsString()
    name: string

    @IsString()
    idUser: string
}
