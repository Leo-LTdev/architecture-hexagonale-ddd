import { Booking } from "@domain/models/Entity/Booking";

interface BookingRepositoryInterface {
  ReadDb(): Booking[];

  WriteDb(data: Booking[]): void;
}

export default BookingRepositoryInterface;
