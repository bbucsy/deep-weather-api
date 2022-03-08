import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import * as expressLayouts from 'express-ejs-layouts';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useStaticAssets(join(__dirname, 'public'));
  app.setBaseViewsDir(join(__dirname, 'views'));

  app.setViewEngine('ejs');
  app.use(expressLayouts);
  app.set('layout', 'app-layout');
  app.set('layout extractScripts', true);

  await app.listen(3000);
}
bootstrap();
