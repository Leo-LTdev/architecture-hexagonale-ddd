import { BookingCancelled, BookingConfirmed } from "@domain/booking/events";

export interface Notifier {
  bookingConfirmed(event: BookingConfirmed): Promise<void>;
  bookingCancelled(event: BookingCancelled): Promise<void>;
}
