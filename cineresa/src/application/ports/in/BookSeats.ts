import BookSeatsCommand from "@application/dto/BookSeatsCommand";
import { BookingView } from "@application/dto/BookingView";

export interface BookSeats {
  execute(command: BookSeatsCommand): Promise<BookingView>;
}
