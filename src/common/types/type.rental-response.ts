import { RentalStatus } from 'src/modules/rental/schemas/rental.schema';

export type UserType = {
  fullName: string;
  picture?: string;
};
export type ToolType = {
  name: string;
  pricePerDay: number;
};

export interface IRental {
  _id: string;
  renter: UserType;
  owner: UserType;
  tool: ToolType;
  rentalStatus: RentalStatus;
  totalPrice: number;
  startDate: string;
  endDate: string;
  rentalDays?: number;
}
