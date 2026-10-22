import { DomainError } from "../../domain/errors/errors";
import { Booking, BookingStatus, PriceCalculator } from "../../domain/models/types/types";
import calculate from "../../domain/utils/PriceCalculator";
import BookSeatsUseCase from "../ports/in/BookSeatsUseCase";
import BookingRepository from "../ports/out/BookingRepository";
import ScreeningRepository from "../ports/out/ScreeningRepository";
import PaymentGateway from "../ports/out/PaymentGateway";
import Notifier from "../ports/out/Notifier";
import Clock from "../ports/out/Clock";
import IdGenerator from "../ports/out/IdGenerator";
import BookSeatsCommand from "../dto/BookSeatsCommand";
import { ErrorStatus } from "../../domain/models/ErrorStatus";

class BookSeatsService implements BookSeatsUseCase {
  private bookingRepository: BookingRepository;
  private screeningRepository: ScreeningRepository;
  private paymentGateway: PaymentGateway;
  private notifier: Notifier;
  private clock: Clock;
  private idGenerator: IdGenerator;

  public constructor(
    bookingRepository: BookingRepository,
    screeningRepository: ScreeningRepository,
    paymentGateway: PaymentGateway,
    notifier: Notifier,
    clock: Clock,
    idGenerator: IdGenerator,
  ) {
    this.bookingRepository = bookingRepository;
    this.screeningRepository = screeningRepository;
    this.paymentGateway = paymentGateway;
    this.notifier = notifier;
    this.clock = clock;
    this.idGenerator = idGenerator;
  }

  public execute(command: BookSeatsCommand): Booking {
    // ---------------------------------------------------------------------------
    // POST /screenings/:id/bookings : réserver des places
    // body : { email, seats, tariff: "NORMAL" | "STUDENT" | "SENIOR" | "CHILD" }
    // ---------------------------------------------------------------------------
    //Get screening by id
    const screening = this.screeningRepository
      .ReadDb()
      .find((s) => s.id == command.screeningId);

    if (!screening)
      throw new DomainError(ErrorStatus.NOT_FOUND);

    const email = command.email;
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      throw new DomainError(ErrorStatus.INVALID);
    }

    const seats = Number(command.seats);
    if (!Number.isInteger(seats) || seats < 1 || seats > 6) {
      throw new DomainError(ErrorStatus.INVALID);
    }

    if (new Date(screening.startsAt) <= this.clock.now()) {
      throw new DomainError(ErrorStatus.INVALID);
    }

    const bookings = this.bookingRepository.ReadDb();

    //Get bookings for this screening and status confirmed
    const taken = bookings
      .filter(
        (b) =>
          b.screeningId == screening.id && b.status == BookingStatus.CONFIRMED,
      )
      .reduce((sum, b) => sum + b.seats, 0);

    if (taken + seats > screening.capacity)
      throw new DomainError(ErrorStatus.INVALID);

    // calcul du prix (en centimes)
    const { tariff, total } = calculate(screening.price, seats, command.tariff);

    // paiement : appel au prestataire
    const paid = this.paymentGateway.charge(email, total);
    if (!paid) throw new DomainError(ErrorStatus.PAYEMENT_REFUSED);

    const booking = new Booking(
      this.idGenerator.generate(),
      screening.id,
      email,
      seats,
      tariff,
      total,
      BookingStatus.CONFIRMED,
      this.clock.now().toISOString(),
    );

    bookings.push(booking);
    this.bookingRepository.WriteDb(bookings);

    // envoi du mail de confirmation
    this.notifier.notify(
      email,
      `Votre réservation ${booking.id} pour "${screening.movie}" ` +
        `(${seats} place(s), ${(total / 100).toFixed(2)} €) est confirmée.`,
    );

    return booking;
  }
}

export default BookSeatsService;
