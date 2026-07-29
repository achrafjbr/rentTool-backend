import { Module } from '@nestjs/common';
import { RentalController } from './rental.controller';
import { RentalService } from './rental.service';
import { AuthenticationJwtService } from '../authentication/authentication.jwt.service';
import { ToolModule } from '../tool/tool.module';
import { RealtimeModule } from '../realtime/realtime.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Rental, RentalSchema } from './schemas/rental.schema';
import { NotificationModule } from '../notification/notification.module';

@Module({
  controllers: [RentalController],
  providers: [RentalService, AuthenticationJwtService],
  imports: [
    MongooseModule.forFeature([
      {
        name: Rental.name,
        schema: RentalSchema,
      },
    ]),
    ToolModule,
    RealtimeModule,
    NotificationModule,
  ],
})
export class RentalModule {}
