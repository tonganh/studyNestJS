import * as dotenv from 'dotenv';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
dotenv.config();

import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
const PORT = process.env.PORT;
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Chinese app API')
    .setDescription('The chinese app API')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(PORT, () => {
    console.log('App running in PORT: ', PORT);
  });
}
bootstrap();
