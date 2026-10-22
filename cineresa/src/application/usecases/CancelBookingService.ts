import { NotFoundError, BusinessRuleError, DomainError } from "../../domain/errors/errors";
import { Booking, BookingStatus } from "../../domain/models/types/types";
import CancelBookingUseCase from "../ports/in/CancelBookingUseCase";
import BookingRepository from "../ports/out/BookingRepository";
import ScreeningRepository from "../ports/out/ScreeningRepository";
import Notifier from "../ports/out/Notifier";
import Clock from "../ports/out/Clock";
import { ErrorStatus } from "../../domain/models/ErrorStatus";

class CancelBookingService implements CancelBookingUseCase {
  private bookingRepository: BookingRepository;
  private screeningRepository: ScreeningRepository;
  private notifier: Notifier;
  private clock: Clock;

  public constructor(
    bookingRepository: BookingRepository,
    screeningRepository: ScreeningRepository,
    notifier: Notifier,
    clock: Clock,
  ) {
    this.bookingRepository = bookingRepository;
    this.screeningRepository = screeningRepository;
    this.notifier = notifier;
    this.clock = clock;
  }

  public execute(bookingId: string): Booking {
    // ---------------------------------------------------------------------------
    // DELETE /bookings/:id : annuler (possible jusqu'à 2h avant la séance)
    // ---------------------------------------------------------------------------
    const bookings = this.bookingRepository.ReadDb();

    //Get booking by id
    const booking = bookings.find((b) => b.id == bookingId);

    if (!booking)
      throw new DomainError(ErrorStatus.NOT_FOUND)
    if (booking.status == BookingStatus.CANCELLED)
      throw new DomainError(ErrorStatus.CONFLICT)

    //Get screening of this booking
    const screening = this.screeningRepository
      .ReadDb()
      .find((s) => s.id == booking.screeningId);

    if (!screening)
      throw new DomainError(ErrorStatus.NOT_FOUND)

    const diff = new Date(screening.startsAt).getTime() - this.clock.now().getTime();
    if (diff < 2 * 60 * 60 * 1000) {
      throw new DomainError(ErrorStatus.INVALID)
    }

    booking.status = BookingStatus.CANCELLED;
    booking.cancelledAt = this.clock.now().toISOString();
    this.bookingRepository.WriteDb(bookings);

    this.notifier.notify(
      booking.email,
      `Votre réservation ${booking.id} a été annulée. Remboursement : ${(booking.total / 100).toFixed(2)} €`,
    );

    return booking;
  }
}

export default CancelBookingService;
