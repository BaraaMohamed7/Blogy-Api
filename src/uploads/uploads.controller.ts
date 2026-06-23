import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiHeaders,
  ApiOperation,
} from '@nestjs/swagger';
import type { UploadedFile as UploadedFileModel } from './interfaces/uploaded-file.interface';
import { UploadsService } from './providers/uploads.service';

@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post('file')
  @UseInterceptors(FileInterceptor('file'))
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiHeaders([
    {
      name: 'Content-Type',
      description: 'multipart/form-data.',
    },
    {
      name: 'Authorization',
      description: 'Bearer token',
    },
  ])
  @ApiOperation({
    summary: 'Upload a file',
    description:
      'This endpoint allows users to upload a file. The file should be sent as multipart/form-data.',
  })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['file'],
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  public async uploadFile(@UploadedFile() file: UploadedFileModel) {
    return this.uploadsService.uploadFile(file);
  }
}
