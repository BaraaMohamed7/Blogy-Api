import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePostMetaOptionsDTO {
  @IsString()
  @IsNotEmpty()
  key: string;

  @IsNotEmpty()
  value: any;
}
