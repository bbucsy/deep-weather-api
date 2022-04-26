import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import * as session from 'express-session';
import {
  DocumentBuilder,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors({
    origin: (process.env.CORS_ORIGIN ?? '').split(','),
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  console.log((process.env.CORS_ORIGIN ?? '*').split(','));

  app.use(
    session({
      secret: process.env.SESSION_SECRET || 'secret',
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Deep-Weather api')
    .setDescription('API description for the deep-weather project')
    .setVersion('1.0')
    .addTag('city')
    .addTag('predictions')
    .addTag('neural-model')
    .addTag('auth')
    .addBearerAuth()
    .build();

  const options: SwaggerDocumentOptions = {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  };

  const document = SwaggerModule.createDocument(app, config, options);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
