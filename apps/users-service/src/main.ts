import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT ?? 4001;
  await app.listen(port);
  console.log(`users-service running on http://localhost:${port}/graphql`);
}

bootstrap();
