import { BookingStatus } from "../../domain/models/types/types";
import ListScreeningsUseCase from "../ports/in/ListScreeningsUseCase";
import BookingRepository from "../ports/out/BookingRepository";
import ScreeningRepository from "../ports/out/ScreeningRepository";
import Clock from "../ports/out/Clock";
import ScreeningView from "../dto/ScreeningView";

class ListScreeningsService implements ListScreeningsUseCase {
  private bookingRepository: BookingRepository;
  private screeningRepository: ScreeningRepository;
  private clock: Clock;

  public constructor(bookingRepository: BookingRepository, screeningRepository: ScreeningRepository, clock: Clock) {
    this.bookingRepository = bookingRepository;
    this.screeningRepository = screeningRepository;
    this.clock = clock;
  }

  public execute(): ScreeningView[] {
    // ---------------------------------------------------------------------------
    // GET /screenings : liste des séances à venir avec le nombre de places restantes
    // ---------------------------------------------------------------------------
    const now = this.clock.now();
    const bookings = this.bookingRepository.ReadDb();

    //Get upcoming screenings
    const screenings = this.screeningRepository.ReadDb().filter((s) => new Date(s.startsAt) >= now);

    return screenings.map((s) => {
      //Get bookings for this screening and status confirmed
      const taken = bookings
        .filter((b) => b.screeningId == s.id && b.status == BookingStatus.CONFIRMED)
        .reduce((sum, b) => sum + b.seats, 0);

      return new ScreeningView(s, s.capacity - taken);
    });
  }
}

export default ListScreeningsService;
