// Import Node.js crypto module for randomUUID functionality
import * as nodeCrypto from 'crypto';

// Add only the randomUUID method if it's missing
if (!global.crypto) {
  global.crypto = global.crypto;
}

// Add the randomUUID method that NestJS TypeORM is trying to use
if (!global.crypto.randomUUID) {
  global.crypto.randomUUID = function randomUUID() {
    return nodeCrypto.randomUUID();
  };
}

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();
