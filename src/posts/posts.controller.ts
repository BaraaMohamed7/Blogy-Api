import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { PostsService } from './providers/posts.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreatePostDTO } from './dtos/create-post.dto';
import { PatchPostDTO } from './dtos/patch-post.dto';

@Controller('posts')
@ApiTags('Posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}
  @Get('{/:userId}')
  public getPosts(@Param('userId') userId: string) {
    return this.postsService.findAllPosts(userId);
  }

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

  @ApiOperation({
    summary: 'Update an existing post',
  })
  @ApiResponse({
    status: 200,
    description: 'The post has been successfully updated.',
  })
  @Patch()
  public updatePost(@Body() patchPostDto: PatchPostDTO) {
    console.log(patchPostDto);
  }
}
