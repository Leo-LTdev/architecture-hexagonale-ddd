import { Booking } from "@domain/models/Entity/Booking";
import BookSeatsCommand from "@application/dto/BookSeatsCommand";

interface BookSeatsInterface {
  execute(command: BookSeatsCommand): Booking;
}

export default BookSeatsInterface;
