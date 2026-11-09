import { Booking } from "../models/types/types";

class Mailer {
  public sendBookingConfirmation(booking: Booking, movie: string): void {
    console.log(
      `[SMTP] To: ${booking.email} — Votre réservation ${booking.id} pour "${movie}" ` +
        `(${booking.seats} place(s), ${(booking.total / 100).toFixed(2)} €) est confirmée.`,
    );
  }

  public sendCancellation(booking: Booking): void {
    console.log(
      `[SMTP] To: ${booking.email} — Votre réservation ${booking.id} a été annulée. Remboursement : ${(booking.total / 100).toFixed(2)} €`,
    );
  }
}

export default Mailer;
