import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { Inject, Injectable, RequestTimeoutException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';
import { v4 as uuid4 } from 'uuid';
import { S3_CLIENT } from '../../aws/aws.module';
import { UploadedFile } from '../interfaces/uploaded-file.interface';

@Injectable()
export class UploadToAwsProvider {
  constructor(
    private readonly configService: ConfigService,
    @Inject(S3_CLIENT) private readonly s3Client: S3Client,
  ) {}

  public async fileUpload(file: UploadedFile) {
    try {
      const key = this.generateFileName(file);
      await this.s3Client.send(
        new PutObjectCommand({
          Bucket: this.configService.getOrThrow<string>(
            'appConfig.awsBucketName',
          ),
          Key: key,
          Body: file.buffer,
          ContentType: file.mimetype,
        }),
      );
      return key;
    } catch (error) {
      throw new RequestTimeoutException(error, {
        description: 'Could not upload file to AWS S3',
      });
    }
  }

  private generateFileName(file: UploadedFile): string {
    const originalName = file.originalname
      .split('.')[0]
      .replace(/\s+/g, '')
      .trim();
    const fileExtension = path.extname(file.originalname);
    const timestamp = new Date().getTime().toString().trim();
    return `${originalName}-${timestamp}-${uuid4()}${fileExtension}`;
  }
}
