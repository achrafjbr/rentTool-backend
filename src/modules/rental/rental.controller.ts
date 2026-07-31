import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/common/decorators/decorator.authGuard';
import { CurrentUser } from 'src/common/decorators/decorators.currentUser';
import type { JwtPayloadType } from 'src/common/types/types.auth';
import { RentalService } from './rental.service';
import { CreateRentalDto } from './dtos/create-rental.dto';

@Controller('rental')
@UseGuards(AuthGuard)
export class RentalController {
  constructor(private readonly rentalService: RentalService) {}
  // Locataire:
  @Post()
  public async renteTool(
    @CurrentUser() userPayload: JwtPayloadType,
    @Body() dto: CreateRentalDto,
  ) {
    return await this.rentalService.renteTool(userPayload, dto);
  }

  @Get('my-requests')
  public async getRequestsSentByRenter(@CurrentUser() renter: JwtPayloadType) {
    return await this.rentalService.getRequestsSentByRenter(renter);
  }

  @Patch(':id/return')
  public async returnRentRequest(
    @Param('id') rentalId: string,
    @CurrentUser() renter: JwtPayloadType,
  ) {
    return await this.rentalService.returnRentRequest(rentalId, renter);
  }

  // Propiétaire:
  @Get('received-requests')
  public async getRequestsReceivedByOwner(
    @CurrentUser() owner: JwtPayloadType,
  ) {
    return await this.rentalService.getRequestsReceivedByOwner(owner);
  }

  @Patch(':id/approve')
  public async approveRentRequest(
    @Param('id') rentalId: string,
    @CurrentUser() owner: JwtPayloadType,
  ) {
    return await this.rentalService.approveRentRequest(rentalId, owner);
  }

  @Patch(':id/reject')
  public async rejectRentRequest(
    @Param('id') rentalId: string,
    @CurrentUser() owner: JwtPayloadType,
  ) {
    return await this.rentalService.rejectRentRequest(rentalId, owner);
  }

  @Patch(':id/confirm-return')
  public async confirmReturnRentRequest(
    @Param('id') rentalId: string,
    @CurrentUser() owner: JwtPayloadType,
  ) {
    return await this.rentalService.confirmReturnRentRequest(rentalId, owner);
  }

  @Get('gains')
  async ownerGains(@CurrentUser() owner: JwtPayloadType) {
    return await this.rentalService.ownerGains(owner);
  }
}
