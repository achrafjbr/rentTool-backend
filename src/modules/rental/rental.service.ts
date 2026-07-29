import {
  BadRequestException,
  HttpException,
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
    const millisecondsPerDay = 1000 * 60 * 60 * 24;

    const rentalDays = Math.ceil(
      (endDate.getTime() - endDate.getTime()) / millisecondsPerDay,
    );
    const totalPrice = rentalDays * tool.pricePerDay;
    // create rentale
    const rental = await this.rentalModel.create({
      ...dto,
      renter: userPayload.id,
      owner: tool.owner,
      totalPrice: totalPrice,
      rentalStatus: RentalStatus.PENDING,
    });
    // send notification to owner
    const notification = await this.notificationService.createNotification({
      sender: userPayload.id,
      receiver: tool.owner,
      title: 'Nouvelle demande de location',
      message: `${userPayload.fullName} souhaite louer votre  "${tool.name}". Veuillez confirmer la réception.`,
      related: rental._id,
      type: NotificationType.RENT_REQUEST,
      isRead: false,
      isSeen: false,
    });
    //--- send notification after transfrom it.

    // --- send rental after transfrom it for the OWNER & RENTER.
    // notify renter
    // notify owner
  }

  // locataire:
  // -- demandes envoyée:
  async RequestsSentByRenter(renter: string) {
    this.rentalModel
      .find({ renter: renter })
      .populate({ path: 'owner', select: { fullName: 1 } })
      .populate({ path: 'tool', select: { name: 1 } })
      .exec();
  }

  // propéitaire :
  // -- demendes reçues:
  async RequestsReceivedByOwner(owner: string) {
    this.rentalModel
      .find({ owner: owner })
      .populate({ path: 'owner', select: { fullName: 1, picture: 1 } })
      .populate({ path: 'tool', select: { name: 1 } })
      .exec();
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
