import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from '../tag.entity';
import { CreateTagDTO } from '../dtos/create-tag.dto';
import { In, Repository } from 'typeorm';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) {}

  public async create(createTagDto: CreateTagDTO) {
    const tag = this.tagRepository.create(createTagDto);
    return await this.tagRepository.save(tag);
  }

  public async findMultipleByIds(tags: number[]) {
    let result: Tag[] = [];
    try {
      result = await this.tagRepository.find({
        where: {
          id: tags.length > 0 ? In(tags) : undefined,
        },
      });
    } catch (error) {
      throw new ConflictException(error);
    }
    return result;
  }

  public async delete(tagId: number) {
    await this.tagRepository.delete(tagId);

    return { message: 'Tag deleted successfully' };
  }

  public async softDelete(tagId: number) {
    await this.tagRepository.softDelete(tagId);
    return { message: 'Tag soft-deleted successfully' };
  }
}
