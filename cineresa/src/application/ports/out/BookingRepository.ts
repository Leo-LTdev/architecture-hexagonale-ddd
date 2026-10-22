import { Booking } from "../../../domain/models/types/types";

interface BookingRepository {
  ReadDb(): Booking[];

  WriteDb(data: Booking[]): void;
}

export default BookingRepository;
