import BookingRepository from "../data/BookingRepository";
import ScreeningRepository from "../data/ScreeningRepository";
import Utils from "../utils/Utils";
import { ScreeningInterface } from "../interfaces/Interfaces";
import { BookingStatus, Screening } from "../models/types/types";

class ScreeningService implements ScreeningInterface {

  private utils: Utils;

  public constructor(utils: Utils) {
    this.utils = utils;
  }

  public GetScreenings(): Screening[] {
    // ---------------------------------------------------------------------------
    // GET /screenings : liste des séances à venir avec le nombre de places restantes
    // ---------------------------------------------------------------------------
    const bookingRepository = new BookingRepository(this.utils);
    const screeningRepository = new ScreeningRepository(this.utils);

    const now = new Date();
    const bookings = bookingRepository.ReadDb();

    //Get upcoming screenings
    const screenings = screeningRepository.ReadDb().filter((s) => new Date(s.startsAt) >= now);

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
