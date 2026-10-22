import { Booking } from "../../../domain/models/types/types";
import BookSeatsCommand from "../../dto/BookSeatsCommand";

interface BookSeatsUseCase {
  execute(command: BookSeatsCommand): Booking;
}

export default BookSeatsUseCase;
