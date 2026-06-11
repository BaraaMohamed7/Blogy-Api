import { InjectRepository } from '@nestjs/typeorm';
import { CreatePostDTO } from '../dtos/create-post.dto';
import { UsersService } from './../../users/providers/users.service';
import {
  BadRequestException,
  Body,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { Post } from '../post.entity';
import { Repository } from 'typeorm';
import { MetaOption } from '../../meta-options/meta-option.entity';
import { TagsService } from '../../tags/providers/tags.service';
import { PatchPostDTO } from '../dtos/patch-post.dto';
import { Tag } from '../../tags/tag.entity';
import { GetPostsDto } from '../dtos/get-posts.dto';
import { PaginationProvider } from '../../common/pagination/providers/pagination.provider';
import { Paginated } from '../../common/pagination/interfaces/paginated.interface';

/** Posts service - Handles post-related operations */
@Injectable()
export class PostsService {
  /** Constructor to inject dependencies : UsersService, Posts Repository */
  constructor(
    @InjectRepository(MetaOption)
    private readonly metaOptionsRepository: Repository<MetaOption>,
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,
    private readonly usersService: UsersService,
    private readonly tagsService: TagsService,
    private readonly paginationProvider: PaginationProvider,
  ) {}

  /** Retrieves all posts for a given user ID */
  public async findAll(
    authorId: string,
    postQuery: GetPostsDto,
  ): Promise<Paginated<Post>> {
    // const author = this.usersService.findUserById(Number(authorId));

    const posts = await this.paginationProvider.paginateQuery(
      postQuery,
      this.postsRepository,
    );
    return posts;
  }

  /** Creates a new post */
  public async createPost(createPostDto: CreatePostDTO) {
    const author = await this.usersService.findOneById(createPostDto.authorId);
    if (!author) {
      throw new BadRequestException('Author not found');
    }

    const tags = await this.tagsService.findMultipleByIds(createPostDto.tags!);

    const existingPost = await this.postsRepository.findOne({
      where: { slug: createPostDto.slug },
    });

    if (existingPost) {
      throw new BadRequestException('Post with this slug already exists');
    }

    let post = this.postsRepository.create({
      author,
      ...createPostDto,
      tags,
    });
    post = await this.postsRepository.save(post);
    return post;
  }

  public async update(patchPostDto: PatchPostDTO) {
    let tags: Tag[] = [];
    let post: Post | null = null;
    try {
      tags = await this.tagsService.findMultipleByIds(patchPostDto.tags!);
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process the request at this time. Please try again later.',
        { description: 'Error connecting to the database' },
      );
    }
    if (!tags || tags.length !== patchPostDto.tags!.length) {
      throw new BadRequestException('One or more tags not found');
    }

    try {
      post = await this.postsRepository.findOne({
        where: { id: patchPostDto.id },
      });
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process the request at this time. Please try again later.',
        { description: 'Error connecting to the database' },
      );
    }

    if (!post) {
      throw new BadRequestException(
        'Post not found, please check the ID and try again',
      );
    }

    post.title = patchPostDto.title ?? post.title;
    post.content = patchPostDto.content ?? post.content;
    post.status = patchPostDto.status ?? post.status;
    post.postType = patchPostDto.postType ?? post.postType;
    post.slug = patchPostDto.slug ?? post.slug;
    post.featuredImageUrl =
      patchPostDto.featuredImageUrl ?? post.featuredImageUrl;
    post.publishOn = patchPostDto.publishOn ?? post.publishOn;
    post.tags = tags;
    try {
      return await this.postsRepository.save(post);
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to update the post at this time. Please try again later.',
        { description: 'Error connecting to the database' },
      );
    }
  }

  public async delete(postId: number) {
    const post = await this.postsRepository.delete(postId);
    if (!post.affected) {
      throw new BadRequestException('Post not found');
    }
    return { message: 'Post and associated meta options deleted successfully' };
  }
}
