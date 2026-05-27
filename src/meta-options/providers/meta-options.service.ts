import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MetaOption } from '../meta-option.entity';
import { Repository } from 'typeorm';
import { CreatePostMetaOptionsDTO } from '../dtos/create-post-meta-options.dto';

/** MetaOptions service - Handles meta options related operations */
@Injectable()
export class MetaOptionsService {
  constructor(
    @InjectRepository(MetaOption)
    private readonly metaOptionsRepository: Repository<MetaOption>,
  ) {}

  public async createMetaOptions(
    createPostMetaOptionsDto: CreatePostMetaOptionsDTO,
  ) {
    let metaOption = this.metaOptionsRepository.create(
      createPostMetaOptionsDto,
    );
    metaOption = await this.metaOptionsRepository.save(metaOption);
    return metaOption;
  }
}
