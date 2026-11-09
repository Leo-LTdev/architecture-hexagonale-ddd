import { BookingView, toBookingView } from "@application/dto/BookingView";
import { CancelBooking } from "@application/ports/in/CancelBooking";
import { Clock } from "@application/ports/out/Clock";
import { EventPublisher } from "@application/ports/out/EventPublisher";
import { ScreeningRepository } from "@application/ports/out/ScreeningRepository";
import { DomainError } from "@domain/shared/DomainError";

export class CancelBookingService implements CancelBooking {
  constructor(
    private readonly screenings: ScreeningRepository,
    private readonly events: EventPublisher,
    private readonly clock: Clock,
  ) {}

  async execute(bookingId: string): Promise<BookingView> {
    const screening = await this.screenings.findByBookingId(bookingId);
    if (!screening) throw new DomainError("NOT_FOUND", "Réservation introuvable");

    const booking = screening.cancel(bookingId, this.clock.now());

    await this.screenings.save(screening);
    await this.events.publish(screening.pullEvents());
    return toBookingView(booking);
  }
}
