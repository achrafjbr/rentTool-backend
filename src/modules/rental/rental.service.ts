import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtPayloadType } from 'src/common/types/types.auth';
import { CreateRentalDto } from './dtos/create-rental.dto';
import { ToolService } from '../tool/tool.service';
import { RealtimeService } from '../realtime/realtime.service';
import { InjectModel } from '@nestjs/mongoose';
import { Rental, RentalStatus } from './schemas/rental.schema';
import { Model } from 'mongoose';
import { NotificationService } from '../notification/notification.service';
import { NotificationType } from '../notification/schemas/notification.schema';
import { NOTIFICATION, RENTAL_CREATED } from 'src/common/constants/constants';
import { IRental } from 'src/common/types/type.rental-response';
import {
  numberRentalDays,
  ownerRentalPayload,
  renterRentalPayload,
} from 'src/common/utilities/utilitie.rental';

@Injectable()
export class RentalService {
  constructor(
    @InjectModel(Rental.name) private readonly rentalModel: Model<Rental>,
    private readonly toolService: ToolService,
    private readonly notificationService: NotificationService,
    private readonly realtimeService: RealtimeService,
  ) {}
  public async renteTool(userPayload: JwtPayloadType, dto: CreateRentalDto) {
    const startDate = new Date(dto.startDate);
    const endDate = new Date(dto.endDate);
    if (startDate >= endDate) {
      throw new BadRequestException('end date must be after start date.');
    }
    const tool = await this.toolService.getTool(dto.tool);
    if (!tool) {
      throw new NotFoundException('no tool found.');
    }

    if (tool.toolStatus != 'AVAILABLE') {
      throw new NotFoundException('this tool not available right now.');
    }

    const totalPrice = numberRentalDays(startDate, endDate) * tool.pricePerDay;
    const owner = tool.owner;

    // create rentale
    const rental = await this.rentalModel.create({
      ...dto,
      renter: userPayload.id,
      owner: owner,
      totalPrice: totalPrice,
      rentalStatus: RentalStatus.PENDING,
    });
    // create notification
    const notification = await this.notificationService.createNotification({
      sender: userPayload.id,
      receiver: owner,
      title: 'Nouvelle demande de location',
      message: `${userPayload.fullName} souhaite louer votre  "${tool.name}". Veuillez confirmer la réception.`,
      related: rental._id,
      type: NotificationType.RENT_REQUEST,
      isRead: false,
      isSeen: false,
    });
    //--- send notification after transfrom it.
    this.realtimeService.notifyUser(
      owner.toString(),
      NOTIFICATION,
      notification,
    );
    // --- send rental after transfrom it for the OWNER & RENTER.
    const Irental: IRental = await this.getRental(rental.id);
    console.log('rental', Irental);
    const rentalDays = numberRentalDays(
      new Date(Irental.startDate),
      new Date(Irental.endDate),
    );

    const rentalData = { ...Irental, rentalDays: rentalDays };
    // notify owner
    this.realtimeService.notifyUser(
      owner.toString(),
      RENTAL_CREATED,
      renterRentalPayload(rentalData),
    );
    // notify renter
    this.realtimeService.notifyUser(
      userPayload.id,
      RENTAL_CREATED,
      ownerRentalPayload(rentalData),
    );
  }

  async getRental(rentalId: string): Promise<IRental> {
    const rental = await this.rentalModel
      .findById(rentalId)
      .populate({
        path: 'owner',
        select: { fullName: 1, picture: 1, password: 0 },
      })
      .populate({
        path: 'renter',
        select: { fullName: 1, picture: 1, password: 0 },
      })
      .populate({ path: 'tool', select: { name: 1, pricePerDay: 1 } })
      .lean();
    return rental;
  }

  // locataire:
  // -- demandes envoyée:return await
  async RequestsSentByRenter(renter: string) {
    return await this.rentalModel
      .find({ renter: renter })
      .populate({
        path: 'owner',
        select: { fullName: 1, picture: 1, password: 0 },
      })
      .populate({ path: 'tool', select: { name: 1, pricePerDay: 1 } })
      .exec();
  }

  async ReturnRentRequest() {
    // update RentalStatus to [RETURN_REQUESTED].
    // send notification to the owner.
    // send updatedRental in realtime to owner.
    // --- the owner should confirm the tool return then will update RentalStatus to [COMPLETED] status
    // & change ToolStatus yo [AVAILABLE].
  }

  // propéitaire :
  // -- demendes reçues:
  async RequestsReceivedByOwner(owner: string) {
    return await this.rentalModel
      .find({ owner: owner })
      .populate({
        path: 'owner',
        select: { fullName: 1, picture: 1, password: 0 },
      })
      .populate({ path: 'tool', select: { name: 1, pricePerDay: 1 } })
      .exec();
  }
  async approveRequest(rentalId: string) {
    // update RentalStatus to [APPROVED].
    // change the ToolStatus to [RENTED]
    // send notification to the renter.
    // send updatedRental in realtime to renter.
  }
  async rejectRequest() {
    // update RentalStatus to [REJECTED].
    // send notification to the renter.
    // send updatedRental in realtime to renter.
  }
  async confirmReturnRequest() {
    // update RentalStatus to [COMPLETED].
    // change the ToolStatus to [AVAILABLE]
    // send notification to the renter.
    // send updatedRental in realtime to renter.
  }

  async ownerGains(owner: JwtPayloadType) {
    await this.rentalModel.aggregate([
      {
        $match: { owner: owner.id, rentalStatus: RentalStatus.COMPLETED },
      },
      {
        $project: {
          totalPrice: { $sum: '$totalPrice' },
        },
      },
    ]);
  }
}
