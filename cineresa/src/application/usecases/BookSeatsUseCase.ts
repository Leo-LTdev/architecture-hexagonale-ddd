import { DomainError } from "../../domain/errors/errors";
import { BookingType as Booking} from "../../domain/utils/models";
import calculate from "../../domain/utils/PriceCalculator";
import BookSeatsInterface from "../ports/in/BookSeatsInterface";
import BookingRepositoryInterface from "../ports/out/BookingRepositoryInterface";
import ScreeningRepositoryInterface from "../ports/out/ScreeningRepositoryInterface";
import PaymentGatewayInterface from "../ports/out/PaymentGatewayInterface";
import NotifierInterface from "../ports/out/NotifierInterface";
import ClockInterface from "../ports/out/ClockInterface";
import IdGeneratorInterface from "../ports/out/IdGeneratorInterface";
import BookSeatsCommand from "../dto/BookSeatsCommand";
import { ErrorStatusEnum as ErrorStatus } from "../../domain/models/Enums/ErrorStatusEnum";
import { BookingStatusEnum as BookingStatus } from "../../domain/utils/enums";

class BookSeatsUseCase implements BookSeatsInterface {
  private bookingRepository: BookingRepositoryInterface;
  private screeningRepository: ScreeningRepositoryInterface;
  private paymentGateway: PaymentGatewayInterface;
  private notifier: NotifierInterface;
  private clock: ClockInterface;
  private idGenerator: IdGeneratorInterface;

  public constructor(
    bookingRepository: BookingRepositoryInterface,
    screeningRepository: ScreeningRepositoryInterface,
    paymentGateway: PaymentGatewayInterface,
    notifier: NotifierInterface,
    clock: ClockInterface,
    idGenerator: IdGeneratorInterface,
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

export default BookSeatsUseCase;
