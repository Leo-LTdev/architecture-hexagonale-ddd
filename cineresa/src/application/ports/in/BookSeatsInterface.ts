import { Booking } from "../../../domain/models/types/types";
import BookSeatsCommand from "../../dto/BookSeatsCommand";

interface BookSeatsInterface {
  execute(command: BookSeatsCommand): Booking;
}

export default BookSeatsInterface;
