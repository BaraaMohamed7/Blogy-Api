import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { PostsService } from './providers/posts.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreatePostDTO } from './dtos/create-post.dto';
import { PatchPostDTO } from './dtos/patch-post.dto';

@Controller('posts')
@ApiTags('Posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  /** Retrieves all posts for a given user ID */
  @ApiOperation({
    summary: 'Get all posts for a user',
  })
  @ApiResponse({
    status: 200,
    description: 'List of posts retrieved successfully.',
  })
  @Get('{/:userId}')
  public getPosts(@Param('userId') userId: string) {
    return this.postsService.findAllPosts(userId);
  }

  /** Creates a new post */
  @ApiOperation({
    summary: 'Create a new post',
  })
  @ApiResponse({
    status: 201,
    description: 'The post has been successfully created.',
  })
  @Post()
  public createPost(@Body() createPostDto: CreatePostDTO) {
    return this.postsService.createPost(createPostDto);
  }

  /** Updates an existing post */
  @ApiOperation({
    summary: 'Update an existing post',
  })
  @ApiResponse({
    status: 200,
    description: 'The post has been successfully updated.',
  })
  @Patch()
  public updatePost(@Body() patchPostDto: PatchPostDTO) {
    return this.postsService.update(patchPostDto);
  }

  /** Deletes a post by ID */
  @ApiOperation({
    summary: 'Delete a post by ID',
  })
  @ApiResponse({
    status: 200,
    description: 'The post has been successfully deleted.',
  })
  @Delete()
  public deletePost(@Query('postId', ParseIntPipe) postId: number) {
    return this.postsService.delete(postId);
  }
}
