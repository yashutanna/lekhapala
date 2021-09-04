import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = 3001;
  app.enableCors({
    origin: "http://raspberrypi.local:3000/"
  });
  await app.listen(port);
}
bootstrap();
