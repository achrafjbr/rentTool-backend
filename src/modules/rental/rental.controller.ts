import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/common/decorators/decorator.authGuard';
import { CurrentUser } from 'src/common/decorators/decorators.currentUser';
import type { JwtPayloadType } from 'src/common/types/types.auth';
import { RentalService } from './rental.service';
import { CreateRentalDto } from './dtos/create-rental.dto';

@Controller('rental')
@UseGuards(AuthGuard)
export class RentalController {
  constructor(private readonly rentalService: RentalService) {}
  @Post()
  public async renteTool(
    @CurrentUser() userPayload: JwtPayloadType,
    @Body() dto: CreateRentalDto,
  ) {
    //     const await;
    await this.rentalService.renteTool(userPayload, dto);
  }
}
