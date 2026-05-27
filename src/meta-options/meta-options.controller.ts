import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { MetaOptionsService } from './providers/meta-options.service';
import { CreatePostMetaOptionsDTO } from './dtos/create-post-meta-options.dto';

/** MetaOptions controller - Handles HTTP requests related to meta options */
@Controller('meta-options')
export class MetaOptionsController {
  constructor(
    @Inject(MetaOptionsService)
    private readonly metaOptionsService: MetaOptionsService,
  ) {}

  @ApiOperation({
    summary: 'Create a new meta option',
  })
  @Post()
  public createMetaOptions(
    @Body() createPostMetaOptionsDto: CreatePostMetaOptionsDTO,
  ) {
    return this.metaOptionsService.createMetaOptions(createPostMetaOptionsDto);
  }
}
