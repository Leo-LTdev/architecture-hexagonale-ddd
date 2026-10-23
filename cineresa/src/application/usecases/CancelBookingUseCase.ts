import { NotFoundError, BusinessRuleError, DomainError } from "../../domain/errors/errors";
import { Booking, BookingStatus } from "../../domain/models/types/types";
import CancelBookingInterface from "../ports/in/CancelBookingInterface";
import BookingRepositoryInterface from "../ports/out/BookingRepositoryInterface";
import ScreeningRepositoryInterface from "../ports/out/ScreeningRepositoryInterface";
import NotifierInterface from "../ports/out/NotifierInterface";
import ClockInterface from "../ports/out/ClockInterface";
import { ErrorStatus } from "../../domain/models/ErrorStatusEnum";

class CancelBookingUseCase implements CancelBookingInterface {
  private bookingRepository: BookingRepositoryInterface;
  private screeningRepository: ScreeningRepositoryInterface;
  private notifier: NotifierInterface;
  private clock: ClockInterface;

  public constructor(
    bookingRepository: BookingRepositoryInterface,
    screeningRepository: ScreeningRepositoryInterface,
    notifier: NotifierInterface,
    clock: ClockInterface,
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

export default CancelBookingUseCase;
