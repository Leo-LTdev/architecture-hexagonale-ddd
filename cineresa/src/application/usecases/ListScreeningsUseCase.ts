import { BookingStatus } from "../../domain/models/types/types";
import ListScreeningsInterface from "../ports/in/ListScreeningsInterface";
import BookingRepositoryInterface from "../ports/out/BookingRepositoryInterface";
import ScreeningRepositoryInterface from "../ports/out/ScreeningRepositoryInterface";
import ClockInterface from "../ports/out/ClockInterface";
import ScreeningView from "../dto/ScreeningView";

class ListScreeningsUseCase implements ListScreeningsUseCase {
  private bookingRepository: BookingRepositoryInterface;
  private screeningRepository: ScreeningRepositoryInterface;
  private clock: ClockInterface;

  public constructor(bookingRepository: BookingRepositoryInterface, 
    screeningRepository: ScreeningRepositoryInterface, 
    clock: ClockInterface) {
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

export default ListScreeningsUseCase;
