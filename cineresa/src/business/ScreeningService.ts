import BookingRepository from "../data/BookingRepository";
import ScreeningRepository from "../data/ScreeningRepository";
import Utils from "../utils/Utils";
import { BookingStatus, Screening } from "../models/types/types";
import { BookingRepositoryInterface, ScreeningRepositoryInterface, ScreeningServiceInterface, UtilsInterface } from "../interfaces/Interfaces";

class ScreeningService implements ScreeningServiceInterface {
  private utils: UtilsInterface;
  private bookingRepository: BookingRepositoryInterface;
  private screeningRepository: ScreeningRepositoryInterface;

  public constructor(utils: UtilsInterface, bookingRepository: BookingRepositoryInterface, screeningRepository: ScreeningRepositoryInterface) {
    this.utils = utils;
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
