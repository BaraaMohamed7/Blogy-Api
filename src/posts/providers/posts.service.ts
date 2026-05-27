import { InjectRepository } from '@nestjs/typeorm';
import { CreatePostDTO } from '../dtos/create-post.dto';
import { UsersService } from './../../users/providers/users.service';
import { Body, Injectable } from '@nestjs/common';
import { Post } from '../post.entity';
import { Repository } from 'typeorm';
import { MetaOption } from '../../meta-options/meta-option.entity';
import { TagsService } from '../../tags/providers/tags.service';
import { PatchPostDTO } from '../dtos/patch-post.dto';

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
  ) {}

  /** Retrieves all posts for a given user ID */
  public async findAllPosts(authorId: string) {
    // const author = this.usersService.findUserById(Number(authorId));

    const posts = await this.postsRepository.find({
      relations: {
        metaOptions: true,
        author: true,
        tags: true,
      },
    });
    return posts;
  }

  /** Creates a new post */
  public async createPost(createPostDto: CreatePostDTO) {
    const author = await this.usersService.findOneById(createPostDto.authorId);
    if (!author) {
      throw new Error('Author not found');
    }

    const tags = await this.tagsService.findMultipleByIds(createPostDto.tags!);

    let post = this.postsRepository.create({
      author,
      ...createPostDto,
      tags,
    });
    post = await this.postsRepository.save(post);
    return post;
  }

  public async update(patchPostDto: PatchPostDTO) {
    const tags = await this.tagsService.findMultipleByIds(patchPostDto.tags!);
    const post = await this.postsRepository.findOne({
      where: { id: patchPostDto.id },
    });

    if (!post) {
      throw new Error('Post not found');
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
    return await this.postsRepository.save(post);
  }

  public async delete(postId: number) {
    const post = await this.postsRepository.delete(postId);
    if (!post.affected) {
      return { message: 'Post not found' };
    }
    return { message: 'Post and associated meta options deleted successfully' };
  }
}
