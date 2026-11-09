import { Booking } from "@domain/models/Entity/Booking";

interface CancelBookingInterface {
  execute(bookingId: string): Booking;
}

export default CancelBookingInterface;
