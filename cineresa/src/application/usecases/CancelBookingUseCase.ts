import { NotFoundError } from "@domain/errors/errors";
import { ErrorStatusEnum } from "@domain/models/Enums/ErrorStatusEnum";
import { Booking } from "@domain/models/Entity/Booking";
import { DateTime } from "@domain/models/ValueObject/DateTime";
import CancelBookingInterface from "@application/ports/in/CancelBookingInterface";
import BookingRepositoryInterface from "@application/ports/out/BookingRepositoryInterface";
import ScreeningRepositoryInterface from "@application/ports/out/ScreeningRepositoryInterface";
import NotifierInterface from "@application/ports/out/NotifierInterface";
import ClockInterface from "@application/ports/out/ClockInterface";

class CancelBookingUseCase implements CancelBookingInterface {
  public constructor(
    private readonly bookingRepository: BookingRepositoryInterface,
    private readonly screeningRepository: ScreeningRepositoryInterface,
    private readonly notifier: NotifierInterface,
    private readonly clock: ClockInterface,
  ) {}

  // DELETE /bookings/:id : annulation possible jusqu'à 2h avant la séance
  public execute(bookingId: string): Booking {
    const bookings = this.bookingRepository.ReadDb();
    const booking = bookings.find((b) => b.id === bookingId);
    if (!booking) throw new NotFoundError(ErrorStatusEnum.NOT_FOUND);

    const screening = this.screeningRepository
      .ReadDb()
      .find((s) => s.id === booking.screeningId);
    if (!screening) throw new NotFoundError(ErrorStatusEnum.NOT_FOUND);

    // L'entité vérifie "déjà annulée" et "moins de 2h".
    booking.cancel(screening, DateTime.create(this.clock.now()));
    this.bookingRepository.WriteDb(bookings);

    this.notifier.notify(
      booking.email.value,
      `Votre réservation ${booking.id} a été annulée. Remboursement : ${booking.total.toEuros()} €`,
    );

    return booking;
  }
}

export default CancelBookingUseCase;
