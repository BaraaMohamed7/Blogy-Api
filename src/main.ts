import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { DataResponseInterceptor } from './common/interceptors/data-response/data-response.interceptor';
import { ConfigService } from '@nestjs/config';
import { config } from 'aws-sdk';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // Swagger Config
  const swaggerConfig = new DocumentBuilder()
    .setVersion('1.0')
    .setTitle('Blog App API')
    .setDescription(
      'API documentation for the Blog App, Base URL: localhost:3000',
    )
    .addServer('http://localhost:3000', 'Local Development Server')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  const configService = app.get(ConfigService);

  config.update({
    credentials: {
      accessKeyId: configService.get('appConfig.awsAccessKeyId')!,
      secretAccessKey: configService.get('appConfig.awsSecretAccessKey')!,
    },
    region: configService.get('appConfig.awsRegion')!,
  });

  app.enableCors();
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
