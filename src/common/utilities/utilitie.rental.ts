import { IRental } from '../types/type.rental-response';

export function renterRentalPayload(rental: IRental) {
  return {
    _id: rental._id,
    owner: rental.owner,
    tool: rental.tool,
    startDate: rental.startDate,
    endDate: rental.endDate,
    totalPrice: rental.totalPrice,
    rentalStatus: rental.rentalStatus,
    rentalDays: rental.rentalDays,
  };
}

export function ownerRentalPayload(rental: IRental) {
  return {
    _id: rental._id,
    renter: rental.renter,
    tool: rental.tool,
    startDate: rental.startDate,
    endDate: rental.endDate,
    totalPrice: rental.totalPrice,
    rentalStatus: rental.rentalStatus,
    rentalDays: rental.rentalDays,
  };
}

export function numberRentalDays(startDate: Date, endDate: Date) {
  const millisecondsPerDay = 1000 * 60 * 60 * 24;

  const rentDays = Math.ceil(
    (endDate.getTime() - startDate.getTime()) / millisecondsPerDay,
  );

  return rentDays;
}
