import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RequestMethod, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('v1/api', {
    exclude: [
      {
        path: 'uploads/(.*)',
        method: RequestMethod.ALL,
      },
    ],
  });
  (app.enableCors({}),
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    ));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
