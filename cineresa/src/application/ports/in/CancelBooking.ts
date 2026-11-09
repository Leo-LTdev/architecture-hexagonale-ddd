import { BookingView } from "@application/dto/BookingView";

export interface CancelBooking {
  execute(bookingId: string): Promise<BookingView>;
}
