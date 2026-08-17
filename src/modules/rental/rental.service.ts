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
import {
  NOTIFICATION,
  RENTAL_CREATED,
  RENTAL_UPDATED,
} from 'src/common/constants/constants';
import { IRental } from 'src/common/types/type.rental-response';
import {
  numberRentalDays,
  ownerRentalPayload,
  renterRentalPayload,
} from 'src/common/utilities/utilitie.rental';
import { ToolStatus } from '../tool/schemas/schema.tool';

@Injectable()
export class RentalService {
  constructor(
    @InjectModel(Rental.name) private readonly rentalModel: Model<Rental>,
    private readonly toolService: ToolService,
    private readonly notificationService: NotificationService,
    private readonly realtimeService: RealtimeService,
  ) {}

  private async getRental(rentalId: string): Promise<IRental> {
    const rental = await this.rentalModel
      .findById(rentalId)
      .populate({
        path: 'owner',
        select: { fullName: 1, picture: 1 },
      })
      .populate({
        path: 'renter',
        select: { fullName: 1, picture: 1 },
      })
      .populate({ path: 'tool', select: { name: 1, pricePerDay: 1, image: 1 } })
      .lean<IRental>();
    if (!rental) {
      throw new NotFoundException('Rental not found');
    }
    return rental;
  }

  // Locataire:
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

    if (tool.toolStatus != ToolStatus.AVAILABLE) {
      throw new NotFoundException('this tool not available right now.');
    }

    const totalPrice = numberRentalDays(startDate, endDate)! * tool.pricePerDay;
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
    const createNotification =
      await this.notificationService.createNotification({
        sender: userPayload.id,
        receiver: owner._id.toString(),
        title: 'Nouvelle demande de location',
        message: `${userPayload.fullName} souhaite louer votre  "${tool.name}". Veuillez confirmer la réception.`,
        related: rental.id,
        type: NotificationType.RENT_REQUEST,
        isRead: false,
        isSeen: false,
      });

    const notification =
      await this.notificationService.populateNotification(createNotification);

    //--- send notification after transfrom it.
    this.realtimeService.notifyUser(
      owner.toString(),
      NOTIFICATION,
      notification,
    );
    // --- send rental after transfrom it for the OWNER & RENTER.
    const Irental: IRental = await this.getRental(rental.id);
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
    // this.realtimeService.notifyUser(
    //   userPayload.id,
    //   RENTAL_CREATED,
    //   ownerRentalPayload(rentalData),
    // );
    return rentalData;
  }

  // -- demandes envoyée:
  public async getRequestsSentByRenter(renter: JwtPayloadType) {
    return await this.rentalModel
      .find({ renter: renter.id })
      .populate({
        path: 'owner',
        select: { fullName: 1, picture: 1 },
      })
      .populate({ path: 'tool', select: { name: 1, image: 1, pricePerDay: 1 } })
      .exec();
  }

  // Renter could click on return which means this tool has been returned to his owner.
  public async returnRentRequest(rentalId: string, renter: JwtPayloadType) {
    // update RentalStatus to [RETURN_REQUESTED].
    const rental = await this.rentalModel.findById(rentalId);
    if (!rental) {
      throw new NotFoundException('not rent found!');
    }
    if (rental.rentalStatus != RentalStatus.APPROVED) {
      throw new NotFoundException('this tool already token');
    }
    rental.rentalStatus = RentalStatus.RETURN_REQUESTED;
    const savedRental = await rental.save();

    const tool = await this.toolService.getTool(rental.tool.toString());
    if (!tool) {
      throw new NotFoundException('not tool found to approve!');
    }

    // Create notification.
    const createNotification =
      await this.notificationService.createNotification({
        title: "Retour d'outil déclaré 🔄",
        message: `${renter.fullName} a indiqué avoir restitué votre "${tool.name}". Veuillez confirmer la réception.`,
        related: rental.id,
        type: NotificationType.RENT_RETURN,
        sender: renter.id,
        receiver: rental.owner.id.toString(),
      });

    const notification =
      await this.notificationService.populateNotification(createNotification);

    // send updatedRental in realtime to owner.
    this.realtimeService.notifyUser(
      rental.owner._id.toString(),
      NOTIFICATION,
      notification,
    );

    const updatedRental = await this.getRental(savedRental.id);
    const rentalDays = numberRentalDays(
      new Date(updatedRental.startDate),
      new Date(updatedRental.endDate),
    );
    // send updatedRental in realtime to owner.
    this.realtimeService.notifyUser(
      savedRental.owner.toString(),
      RENTAL_UPDATED,
      renterRentalPayload({ ...updatedRental, rentalDays: rentalDays }),
    );
    return updatedRental;
  }

  // Propéitaire :
  // -- demendes reçues:
  public async getRequestsReceivedByOwner(owner: JwtPayloadType) {
    return await this.rentalModel
      .find({
        $and: [
          { owner: owner.id },
          {
            $or: [
              { rentalStatus: RentalStatus.PENDING },
              { rentalStatus: RentalStatus.RETURN_REQUESTED },
            ],
          },
        ],
      })
      .populate({
        path: 'renter',
        select: { fullName: 1, picture: 1 },
      })
      .populate({ path: 'tool', select: { name: 1, pricePerDay: 1, image: 1 } })
      .exec();
  }

  public async approveRentRequest(rentalId: string, owner: JwtPayloadType) {
    console.log('rental id', rentalId);
    // update RentalStatus to [APPROVED].
    const rental = await this.rentalModel.findOne({ _id: rentalId });
    if (!rental) {
      throw new NotFoundException('not rent found!');
    }
    console.log('rental', rental);
    if (rental.rentalStatus != RentalStatus.PENDING) {
      throw new NotFoundException('this tool already token');
    }

    const tool = await this.toolService.getTool(rental.tool.toString());
    if (!tool) {
      throw new NotFoundException('not tool found to approve!');
    }
    console.log('tool', tool);

    rental.rentalStatus = RentalStatus.APPROVED;
    const savedRental = await rental.save();

    // change the ToolStatus to [RENTED]
    tool.toolStatus = ToolStatus.RENTED;
    await tool.save();
    // Create notification.
    const createNotification =
      await this.notificationService.createNotification({
        title: 'Demande acceptée ! 🎉',
        message: `${owner.fullName} a approuvé votre demande de location pour "${tool.name}". Prenez contact pour la remise de loutil.`,
        related: rental.id,
        type: NotificationType.RENT_APPROVED,
        receiver: rental.renter.toString(),
        sender: owner.id,
      });

    const notification =
      await this.notificationService.populateNotification(createNotification);

    // Send notification to renter.
    this.realtimeService.notifyUser(
      rental.renter.toString(),
      NOTIFICATION,
      notification,
    );
    const updatedRental = await this.getRental(savedRental.id);
    console.log('updatedRental', updatedRental);

    const rentalDays = numberRentalDays(
      new Date(updatedRental.startDate),
      new Date(updatedRental.endDate),
    );
    // send updatedRental in realtime to renter.
    this.realtimeService.notifyUser(
      savedRental.renter.toString(),
      RENTAL_UPDATED,
      renterRentalPayload({ ...updatedRental, rentalDays: rentalDays }),
    );
    return updatedRental;
  }

  public async rejectRentRequest(rentalId: string, owner: JwtPayloadType) {
    // update RentalStatus to [REJECTED].
    const rental = await this.rentalModel.findById(rentalId);
    if (!rental) {
      throw new NotFoundException('not rent found!');
    }
    if (rental.rentalStatus != RentalStatus.PENDING) {
      throw new NotFoundException('this tool already token');
    }
    rental.rentalStatus = RentalStatus.REJECTED;
    const savedRental = await rental.save();

    const tool = await this.toolService.getTool(rental.tool.toString());
    if (!tool) {
      throw new BadRequestException('something went wrong please try again.');
      return;
    }
    // Create notification.
    const createNotification =
      await this.notificationService.createNotification({
        title: 'Demande refusée',
        message: `${owner.fullName} ne peut pas donner suite à votre demande pour "${tool.name}".`,
        related: rental.id,
        type: NotificationType.RENT_APPROVED,
        receiver: rental.renter.toString(),
        sender: owner.id,
      });

    const notification =
      await this.notificationService.populateNotification(createNotification);

    // Send notification to renter.
    this.realtimeService.notifyUser(
      rental.renter.toString(),
      NOTIFICATION,
      notification,
    );
    const updatedRental = await this.getRental(savedRental.id);
    const rentalDays = numberRentalDays(
      new Date(updatedRental.startDate),
      new Date(updatedRental.endDate),
    );
    // send updatedRental in realtime to renter.
    this.realtimeService.notifyUser(
      savedRental.renter.toString(),
      RENTAL_UPDATED,
      renterRentalPayload({ ...updatedRental, rentalDays: rentalDays }),
    );
    return updatedRental;
  }

  public async confirmReturnRentRequest(
    rentalId: string,
    owner: JwtPayloadType,
  ) {
    // update RentalStatus to [COMPLETED].
    const rental = await this.rentalModel.findById(rentalId);
    if (!rental) {
      throw new NotFoundException('not rent found!');
    }
    if (rental.rentalStatus != RentalStatus.RETURN_REQUESTED) {
      throw new NotFoundException('this tool already token');
    }
    rental.rentalStatus = RentalStatus.COMPLETED;
    const savedRental = await rental.save();

    const tool = await this.toolService.getTool(rental.tool.toString());
    if (!tool) {
      throw new NotFoundException('not tool found to approve!');
    }
    // change the ToolStatus to [AVAILABLE]
    tool.toolStatus = ToolStatus.AVAILABLE;
    await tool.save();
    // Create notification.
    const createNotification =
      await this.notificationService.createNotification({
        title: 'Location terminée ! 🤝',
        message: `${owner.fullName} a confirmé le retour de l'outil "${tool.name}". Merci d'avoir utilisé ToolRent !`,
        related: rental.id,
        type: NotificationType.RENT_RETURN_CONFIRMED,
        receiver: rental.renter.toString(),
        sender: owner.id,
      });

    const notification =
      await this.notificationService.populateNotification(createNotification);

    // Send notification to renter.
    this.realtimeService.notifyUser(
      rental.renter.toString(),
      NOTIFICATION,
      notification,
    );
    const updatedRental = await this.getRental(savedRental.id);
    const rentalDays = numberRentalDays(
      new Date(updatedRental.startDate),
      new Date(updatedRental.endDate),
    );
    // send updatedRental in realtime to renter.
    this.realtimeService.notifyUser(
      savedRental.renter.toString(),
      RENTAL_UPDATED,
      renterRentalPayload({ ...updatedRental, rentalDays: rentalDays }),
    );
    return updatedRental;
  }

  async ownerGains(owner: JwtPayloadType) {
    const gains = await this.rentalModel.aggregate([
      {
        $match: { owner: owner.id, rentalStatus: RentalStatus.COMPLETED },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalPrice' },
        },
      },
    ]);
    const totalRevenue = gains[0]?.totalRevenue ?? 0;
    return { totalRevenue };
  }
}
