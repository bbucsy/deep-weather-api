import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import * as expressLayouts from 'express-ejs-layouts';
import { WeatherLabel } from './app/open-weather/dto/open-weather.dto';
import { Request, Response, NextFunction } from 'express';
import { helpers } from './app.view-helpres';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useStaticAssets(join(__dirname, 'public'));
  app.setBaseViewsDir(join(__dirname, 'views'));

  app.setViewEngine('ejs');
  app.use(expressLayouts);
  app.set('layout', 'app-layout');
  app.set('layout extractScripts', true);

  app.use((req: Request, res: Response, next: NextFunction) => {
    res.locals.helpers = helpers;
    next();
  });

  console.log(`Output label count is ${Object.keys(WeatherLabel).length / 2}`);

  await app.listen(3000);
}
bootstrap();
