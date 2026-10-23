import { Booking } from "../../../domain/models/types/types";

interface BookingRepositoryInterface {
  ReadDb(): Booking[];

  WriteDb(data: Booking[]): void;
}

export default BookingRepositoryInterface;
