import { Booking } from "../../../domain/models/types/types";

interface CancelBookingUseCase {
  execute(bookingId: string): Booking;
}

export default CancelBookingUseCase;
