import { Booking } from "../../models/types/types";

interface BookingRepositoryInterface {
  ReadDb(): Booking[];

  WriteDb(data: Booking[]): void;
}

export default BookingRepositoryInterface;
