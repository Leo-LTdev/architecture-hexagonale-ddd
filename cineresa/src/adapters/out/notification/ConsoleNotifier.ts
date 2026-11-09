import { Notifier } from "@application/ports/out/Notifier";
import { BookingCancelled, BookingConfirmed } from "@domain/booking/events";

export class ConsoleNotifier implements Notifier {
  async bookingConfirmed(event: BookingConfirmed): Promise<void> {
    console.log(
      `[SMTP] To: ${event.email} — Votre réservation ${event.bookingId} pour "${event.movie}" ` +
        `(${event.seats} place(s), ${event.total}) est confirmée.`,
    );
  }

  async bookingCancelled(event: BookingCancelled): Promise<void> {
    console.log(`[SMTP] To: ${event.email} — Votre réservation ${event.bookingId} a été annulée. Remboursement : ${event.refund}`);
  }
}
