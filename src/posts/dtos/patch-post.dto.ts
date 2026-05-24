import { CreatePostDTO } from './create-post.dto';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

export class PatchPostDTO extends PartialType(CreatePostDTO) {
  @ApiProperty({
    description: 'The ID of the post to update',
    example: 1234,
  })
  @IsInt()
  @IsNotEmpty()
  id: number;
}
