import BookSeatsCommand from "@application/dto/BookSeatsCommand";
import { BookingView, toBookingView } from "@application/dto/BookingView";
import { BookSeats } from "@application/ports/in/BookSeats";
import { Clock } from "@application/ports/out/Clock";
import { EventPublisher } from "@application/ports/out/EventPublisher";
import { IdGenerator } from "@application/ports/out/IdGenerator";
import { PaymentGateway } from "@application/ports/out/PaymentGateway";
import { ScreeningRepository } from "@application/ports/out/ScreeningRepository";
import { SeatCount } from "@domain/booking/SeatCount";
import { parseTariff } from "@domain/booking/Tariff";
import { DomainError } from "@domain/shared/DomainError";
import { Email } from "@domain/shared/Email";

export class BookSeatsService implements BookSeats {
  constructor(
    private readonly screenings: ScreeningRepository,
    private readonly payment: PaymentGateway,
    private readonly events: EventPublisher,
    private readonly clock: Clock,
    private readonly ids: IdGenerator,
  ) {}

  async execute(command: BookSeatsCommand): Promise<BookingView> {
    const screening = await this.screenings.findById(command.screeningId);
    if (!screening) throw new DomainError("NOT_FOUND", "Séance introuvable");

    const booking = screening.book({
      bookingId: this.ids.next(),
      email: new Email(command.email),
      seats: new SeatCount(Number(command.seats)),
      tariff: parseTariff(command.tariff),
      now: this.clock.now(),
    });

    const paid = await this.payment.charge(booking.email, booking.total);
    if (!paid) throw new DomainError("PAYMENT_REFUSED", "Paiement refusé");

    await this.screenings.save(screening);
    await this.events.publish(screening.pullEvents());
    return toBookingView(booking);
  }
}
