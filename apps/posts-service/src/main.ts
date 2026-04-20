import "dotenv/config";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const isDev = process.env.NODE_ENV !== "production";
  app.enableCors({
    origin: isDev ? "*" : process.env.CORS_ORIGIN?.split(","),
    methods: ["GET", "POST"],
  });
  const port = process.env.PORT ?? 4002;
  await app.listen(port);
  console.log(`posts-service running on http://localhost:${port}/graphql`);
}

bootstrap();
