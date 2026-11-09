import { BookingDetailsView, toBookingDetailsView } from "@application/dto/BookingDetailsView";
import { ListMyBookings } from "@application/ports/in/ListMyBookings";
import { ScreeningRepository } from "@application/ports/out/ScreeningRepository";
import { Email } from "@domain/shared/Email";

export class ListMyBookingsService implements ListMyBookings {
  constructor(private readonly screenings: ScreeningRepository) {}

  async execute(email: string): Promise<BookingDetailsView[]> {
    let customer: Email;
    try {
      customer = new Email(email);
    } catch {
      return []; // comme le legacy : un email absent ou invalide ne correspond à aucune réservation
    }

    const screenings = await this.screenings.findWithBookingsOf(customer);
    return screenings
      .flatMap((s) => s.bookingsOf(customer).map((b) => toBookingDetailsView(b, s)))
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt)); // ordre de réservation, comme le legacy
  }
}
