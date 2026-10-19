import utilsDB from "../utils/utilitaireDB";
import app from "../server";

class ScreeningService {
  private utils: utilsDB;

  public constructor(utils: utilsDB) {
    this.utils = utils;
  }

  public GetScreenings(): any {
    // ---------------------------------------------------------------------------
    // GET /screenings : liste des séances à venir avec le nombre de places restantes
    // ---------------------------------------------------------------------------
    const db = this.utils.readDb();
    const now = new Date();
    const result = [];
    for (const s of db.screenings) {
      if (new Date(s.startsAt) < now) continue;
      let taken = 0;
      for (const b of db.bookings) {
        if (b.screeningId === s.id && b.status === "CONFIRMED")
          taken += b.seats;
      }
      result.push({
        id: s.id,
        movie: s.movie,
        room: s.room,
        startsAt: s.startsAt,
        price: s.price,
        remaining: s.capacity - taken,
      });
    }
    return result
  }
}

export default ScreeningService;
