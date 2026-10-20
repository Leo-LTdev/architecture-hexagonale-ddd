import { Booking, Screening, TarifPolicy, User } from "../../models/types/types";
import BookingDto from "../../models/objects/BookingDto";
import BookingDetailsDto from "../../models/objects/BookingDetailsDto";

interface BookingInterface {
  BookingsByIdUser(userData: User): BookingDetailsDto[];
  BookByIdUser(screeningData: Screening, data: BookingDto): Booking;
  DeleteBooking(bookingData: Booking): Booking;
  calculatePrice(
    basePrice: number,
    seats: number,
    requestedTariff?: TarifPolicy | string,
  ): { tariff: TarifPolicy; total: number };
}

export default BookingInterface;
