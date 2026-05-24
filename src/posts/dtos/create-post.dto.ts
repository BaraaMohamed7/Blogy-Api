import {
  IsArray,
  IsEnum,
  IsISO8601,
  IsJSON,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { PostType } from '../enums/postType.enum';
import { PostStatus } from '../enums/postStatus.enum';
import { CreatePostMetaOptionsDTO } from './create-post-meta-options.dto';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePostDTO {
  @IsString()
  @MinLength(4)
  @IsNotEmpty()
  @ApiProperty({
    description: 'The title of the post',
    example: 'My First Blog Post',
  })
  title: string;

  @IsEnum(PostType)
  @IsNotEmpty()
  @ApiProperty({
    description: 'The type of the post: post, page, seiries, story',
    enum: PostType,
  })
  postType: PostType;

  @IsString()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message:
      'Slug must be lowercase, alphanumeric, and can contain hyphens (no spaces or special characters)',
  })
  @IsNotEmpty()
  @ApiProperty({
    description: 'The slug of the post',
    example: 'my-first-blog-post',
  })
  slug: string;

  @IsEnum(PostStatus)
  @IsNotEmpty()
  @ApiProperty({
    description: 'The status of the post : draft, scheduled, published, review',
    enum: PostStatus,
  })
  status: PostStatus;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'The content of the post',
    example: 'This is the content of my first blog post.',
  })
  content?: string;

  @IsJSON()
  @IsOptional()
  @ApiPropertyOptional({
    description:
      'The schema for the post content, it should be a valid serialized JSON string that defines the structure of the content',
    example:
      '{"type": "object", "properties": {"content": {"type": "string"}}}',
  })
  schema?: string;

  @IsUrl()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'The URL of the featured image for the post',
    example: 'https://example.com/featured-image.jpg',
  })
  featuredImageUrl?: string;

  @IsISO8601()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The date and time when the post should be published',
    example: '2023-10-01T00:00:00.000Z',
  })
  publishOn: Date;

  @IsArray()
  @IsString({ each: true })
  @MinLength(3, { each: true })
  @IsOptional()
  @ApiPropertyOptional({
    description: 'The tags for the post',
    example: ['technology', 'programming'],
  })
  tags?: string[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePostMetaOptionsDTO)
  @IsOptional()
  @ApiPropertyOptional({
    description: 'The meta options for the post',
    type: 'array',
    items: {
      type: 'object',
      properties: {
        key: { type: 'string', example: 'seoTitle' },
        value: {
          type: 'string',
          example: 'My First Blog Post - A Journey into Blogging',
        },
      },
    },
    required: false,
  })
  metaOptions?: CreatePostMetaOptionsDTO[];
}
