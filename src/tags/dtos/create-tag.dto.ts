import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsJSON,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateTagDTO {
  @IsString()
  @MinLength(3)
  @MaxLength(256)
  @IsNotEmpty()
  @ApiProperty({
    description: 'The name of the tag',
    example: 'JavaScript',
  })
  name: string;

  @IsString()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message:
      'Slug must be lowercase, alphanumeric, and can contain hyphens (no spaces or special characters)',
  })
  @MaxLength(256)
  @IsNotEmpty()
  @ApiProperty({
    description: 'The slug of the tag',
    example: 'javascript',
  })
  slug: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'The description of the tag',
    example: 'A tag for JavaScript-related posts',
  })
  description?: string;

  @IsJSON()
  @IsOptional()
  @ApiPropertyOptional({
    description:
      'The schema for the tag content, it should be a valid serialized JSON string that defines the structure of the content',
    example:
      '{"type": "object", "properties": {"description": {"type": "string"}}}',
  })
  schema?: string;

  @IsUrl()
  @MaxLength(1024)
  @IsOptional()
  @ApiPropertyOptional({
    description: 'The URL of the featured image for the tag',
    example: 'https://example.com/featured-image.jpg',
  })
  featuredImageUrl?: string;
}
