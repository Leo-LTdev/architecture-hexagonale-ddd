import { NotFoundError, PaymentRefusedError } from "@domain/errors/errors";
import { ErrorStatusEnum } from "@domain/models/Enums/ErrorStatusEnum";
import { Booking } from "@domain/models/Entity/Booking";
import { DateTime } from "@domain/models/ValueObject/DateTime";
import { Email } from "@domain/models/ValueObject/Email";
import { Seats } from "@domain/models/ValueObject/Seats";
import { Tariff } from "@domain/models/ValueObject/Tariff";
import BookSeatsInterface from "@application/ports/in/BookSeatsInterface";
import BookingRepositoryInterface from "@application/ports/out/BookingRepositoryInterface";
import ScreeningRepositoryInterface from "@application/ports/out/ScreeningRepositoryInterface";
import PaymentGatewayInterface from "@application/ports/out/PaymentGatewayInterface";
import NotifierInterface from "@application/ports/out/NotifierInterface";
import ClockInterface from "@application/ports/out/ClockInterface";
import IdGeneratorInterface from "@application/ports/out/IdGeneratorInterface";
import BookSeatsCommand from "@application/dto/BookSeatsCommand";

class BookSeatsUseCase implements BookSeatsInterface {
  public constructor(
    private readonly bookingRepository: BookingRepositoryInterface,
    private readonly screeningRepository: ScreeningRepositoryInterface,
    private readonly paymentGateway: PaymentGatewayInterface,
    private readonly notifier: NotifierInterface,
    private readonly clock: ClockInterface,
    private readonly idGenerator: IdGeneratorInterface,
  ) {}

  // POST /screenings/:id/bookings
  public execute(command: BookSeatsCommand): Booking {
    const screening = this.screeningRepository
      .ReadDb()
      .find((s) => s.id === command.screeningId);
    if (!screening) throw new NotFoundError(ErrorStatusEnum.NOT_FOUND);

    // Les VOs valident les entrées (ValidationError si invalides).
    const email = Email.create(command.email);
    const seats = Seats.create(command.seats);
    const tariff = Tariff.create(command.tariff);
    const now = DateTime.create(this.clock.now());

    const bookings = this.bookingRepository.ReadDb();
    const bookedSeats = bookings
      .filter((b) => b.screeningId === screening.id && b.isConfirmed())
      .reduce((sum, b) => sum + b.seats.value, 0);

    // L'entité applique les règles métier et calcule le total.
    const booking = Booking.book({
      id: this.idGenerator.generate(),
      screening,
      email,
      seats,
      tariff,
      now,
      bookedSeats,
    });

    if (!this.paymentGateway.charge(email.value, booking.total.value)) {
      throw new PaymentRefusedError(ErrorStatusEnum.PAYEMENT_REFUSED);
    }

    bookings.push(booking);
    this.bookingRepository.WriteDb(bookings);

    this.notifier.notify(
      email.value,
      `Votre réservation ${booking.id} pour "${screening.movie.value}" ` +
        `(${seats.value} place(s), ${booking.total.toEuros()} €) est confirmée.`,
    );

    return booking;
  }
}

export default BookSeatsUseCase;
