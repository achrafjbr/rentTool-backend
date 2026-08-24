import { ConfigModule, ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
export const CloudinaryProvider = {
  provide: 'CLOUDINARY',
  imports: [ConfigModule],
  inject: [ConfigService],
  global: true,
  useFactory: (configService: ConfigService) => {
    return cloudinary.config({
      cloud_name: configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: configService.get<string>('CLOUDINARY_CLOUD_API_KEY'),
      api_secret: configService.get<string>('CLOUDINARY_CLOUD_SECRET_KEY'),
    });
  },
};
