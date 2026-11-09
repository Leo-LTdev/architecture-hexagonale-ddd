import { Notifier } from "@application/ports/out/Notifier";
import { BookingCancelled, BookingConfirmed } from "@domain/booking/events";

// Envoie les e-mails en réaction aux domain events.
export class NotifyCustomer {
  constructor(private readonly notifier: Notifier) {}

  onBookingConfirmed(event: BookingConfirmed): Promise<void> {
    return this.notifier.bookingConfirmed(event);
  }

  onBookingCancelled(event: BookingCancelled): Promise<void> {
    return this.notifier.bookingCancelled(event);
  }
}
