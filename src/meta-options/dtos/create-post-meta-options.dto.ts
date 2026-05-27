import { IsJSON, IsNotEmpty } from 'class-validator';

export class CreatePostMetaOptionsDTO {
  @IsJSON()
  @IsNotEmpty()
  metaValue: string;
}
