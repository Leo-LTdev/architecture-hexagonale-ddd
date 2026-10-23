import { Booking } from "../../../domain/models/types/types";

interface CancelBookingInterface {
  execute(bookingId: string): Booking;
}

export default CancelBookingInterface;
