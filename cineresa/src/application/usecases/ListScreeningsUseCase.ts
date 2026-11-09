import { DateTime } from "@domain/models/ValueObject/DateTime";
import ListScreeningsInterface from "@application/ports/in/ListScreeningsInterface";
import BookingRepositoryInterface from "@application/ports/out/BookingRepositoryInterface";
import ScreeningRepositoryInterface from "@application/ports/out/ScreeningRepositoryInterface";
import ClockInterface from "@application/ports/out/ClockInterface";
import ScreeningView from "@application/dto/ScreeningView";

class ListScreeningsUseCase implements ListScreeningsInterface {
  public constructor(
    private readonly bookingRepository: BookingRepositoryInterface,
    private readonly screeningRepository: ScreeningRepositoryInterface,
    private readonly clock: ClockInterface,
  ) {}

  // GET /screenings : séances à venir avec le nombre de places restantes
  public execute(): ScreeningView[] {
    const now = DateTime.create(this.clock.now());
    const bookings = this.bookingRepository.ReadDb();

    return this.screeningRepository
      .ReadDb()
      .filter((s) => !s.startsAt.isBefore(now))
      .map((s) => {
        const bookedSeats = bookings
          .filter((b) => b.screeningId === s.id && b.isConfirmed())
          .reduce((sum, b) => sum + b.seats.value, 0);
        return new ScreeningView(s, s.remainingSeats(bookedSeats));
      });
  }
}

export default ListScreeningsUseCase;
