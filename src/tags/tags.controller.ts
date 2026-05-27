import {
  Body,
  Controller,
  Delete,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { TagsService } from './providers/tags.service';
import { CreateTagDTO } from './dtos/create-tag.dto';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsSerivce: TagsService) {}

  @ApiOperation({
    summary: 'Create a new tag',
    description: 'Create a new tag with the provided name and description',
  })
  @Post()
  public createTag(@Body() createTagDto: CreateTagDTO) {
    return this.tagsSerivce.create(createTagDto);
  }

  @ApiOperation({
    summary: 'Delete a tag',
    description: 'Delete a tag by its ID',
  })
  @ApiQuery({
    name: 'tagId',
    description: 'ID of the tag to delete',
    required: true,
    type: 'number',
  })
  @ApiResponse({
    status: 200,
    description: 'Tag deleted successfully',
  })
  @Delete()
  public deleteTag(@Query('tagId', ParseIntPipe) tagId: number) {
    return this.tagsSerivce.delete(tagId);
  }

  @ApiOperation({
    summary: 'Soft delete a tag',
    description: 'Soft delete a tag by its ID',
  })
  @ApiQuery({
    name: 'tagId',
    description: 'ID of the tag to soft delete',
    required: true,
    type: 'number',
  })
  @ApiResponse({
    status: 200,
    description: 'Tag soft-deleted successfully',
  })
  @Delete('/soft-delete')
  public softDeleteTag(@Query('tagId', ParseIntPipe) tagId: number) {
    return this.tagsSerivce.softDelete(tagId);
  }
}
