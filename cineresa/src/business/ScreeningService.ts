import BookingRepository from "../adapters/data/BookingRepository";
import ScreeningRepository from "../adapters/data/ScreeningRepository";
import Utils from "../adapters/data/JsonDatabase";
import { BookingStatus, Screening } from "../models/types/types";
import { BookingRepositoryInterface, ScreeningRepositoryInterface, ScreeningServiceInterface, JsonDatabaseInterface } from "../interfaces/Interfaces";

class ScreeningService implements ScreeningServiceInterface {
  private jsonDatabase: JsonDatabaseInterface;
  private bookingRepository: BookingRepositoryInterface;
  private screeningRepository: ScreeningRepositoryInterface;

  public constructor(jsonDatabase: JsonDatabaseInterface, bookingRepository: BookingRepositoryInterface, screeningRepository: ScreeningRepositoryInterface) {
    this.jsonDatabase = jsonDatabase;
    this.bookingRepository = bookingRepository;
    this.screeningRepository = screeningRepository;
  }

  public GetScreenings(): Screening[] {
    // ---------------------------------------------------------------------------
    // GET /screenings : liste des séances à venir avec le nombre de places restantes
    // ---------------------------------------------------------------------------
    const now = new Date();
    const bookings = this.bookingRepository.ReadDb();

    //Get upcoming screenings
    const screenings = this.screeningRepository.ReadDb().filter((s) => new Date(s.startsAt) >= now);

    return screenings.map((s) => {
      //Get bookings for this screening and status confirmed
      const taken = bookings
        .filter((b) => b.screeningId == s.id && b.status == BookingStatus.CONFIRMED)
        .reduce((sum, b) => sum + b.seats, 0);

      s.remaining = s.capacity - taken;
      return s;
    });
  }
}

export default ScreeningService;
