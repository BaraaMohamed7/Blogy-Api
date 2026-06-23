import { S3Client } from '@aws-sdk/client-s3';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export const S3_CLIENT = Symbol('S3_CLIENT');

@Module({
  providers: [
    {
      provide: S3_CLIENT,
      useFactory: (configService: ConfigService) => {
        return new S3Client({
          region: configService.getOrThrow<string>('appConfig.awsRegion'),
          credentials: {
            accessKeyId: configService.getOrThrow<string>(
              'appConfig.awsAccessKeyId',
            ),
            secretAccessKey: configService.getOrThrow<string>(
              'appConfig.awsSecretAccessKey',
            ),
          },
        });
      },
      inject: [ConfigService],
    },
  ],
  exports: [S3_CLIENT],
})
export class AwsModule {}
