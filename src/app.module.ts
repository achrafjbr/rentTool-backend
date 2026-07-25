import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ResponseInterceptor } from './core/interceptors/interceptos.responseInterceptor';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ErrorExceptionFilter } from './core/filters/filters.errorExceptionFilter';
import { AuthenticationModule } from './modules/authentication/authentication.module';
import { UserModule } from './modules/user/user.module';
import { ToolModule } from './modules/tool/tool.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      // imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          appName: configService.get<string>('APP_NAME'),
          dbName: configService.get<string>('RENT_TOOL'),
          uri: configService.get<string>('DB_URL'),
        };
      },
    }),
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          global: true,
          secret: configService.get<string>('JWT_KEY'),
        };
      },
    }),
    AuthenticationModule,
    UserModule,
    ToolModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: ErrorExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
})
export class AppModule {}
