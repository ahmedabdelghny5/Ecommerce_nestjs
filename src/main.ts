
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { requestQueryParsed } from './common/utils/parsing';

async function bootstrap() {
  const port = process.env.PORT
  const app = await NestFactory.create(AppModule);
  app.use(requestQueryParsed);
  await app.listen(port ?? 5000, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}
bootstrap();
