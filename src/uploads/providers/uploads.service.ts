import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Upload } from '../upload.entity';
import { Repository } from 'typeorm';
import { UploadToAwsProvider } from './upload-to-aws.provider';
import { ConfigService } from '@nestjs/config';
import { UploadFile } from '../interfaces/upload-file.interface';
import { UploadedFile } from '../interfaces/uploaded-file.interface';
import { FileType } from '../enums/file-type.enum';

@Injectable()
export class UploadsService {
  constructor(
    @InjectRepository(Upload)
    private readonly uploadRepository: Repository<Upload>,
    private readonly configService: ConfigService,
    private readonly uploadToAwsProvider: UploadToAwsProvider,
  ) {}
  public async uploadFile(file: UploadedFile) {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    if (
      !['image/jpeg', 'image/jpg', 'image/png', 'image/gif'].includes(
        file.mimetype,
      )
    ) {
      throw new BadRequestException('Invalid file type');
    }

    const name: string = await this.uploadToAwsProvider.fileUpload(file);

    const uploadFile: UploadFile = {
      name,
      path: `https://${this.configService.getOrThrow('appConfig.awsCloudFrontUrl')}/${name}`,
      type: FileType.IMAGE,
      mime: file.mimetype,
      size: file.size,
    };

    try {
      const upload = this.uploadRepository.create(uploadFile);
      return await this.uploadRepository.save(upload);
    } catch (error) {
      throw new ConflictException(error, {
        description: 'Could not save upload information to the database',
      });
    }
  }
}
