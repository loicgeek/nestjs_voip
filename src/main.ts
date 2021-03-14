import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppLogger } from '@/common/applogger.service';
import { ExpressPeerServer } from 'peer';
import { Logger } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors();
  const port = process.env.PORT || 3000;
  await app.listen(port).then(() => {
    AppLogger.log('Project started on port : ' + port);
  });
}

bootstrap();
