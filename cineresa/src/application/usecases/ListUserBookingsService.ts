import ListUserBookingsUseCase from "../ports/in/ListUserBookingsUseCase";
import BookingRepository from "../ports/out/BookingRepository";
import ScreeningRepository from "../ports/out/ScreeningRepository";
import BookingDetailsView from "../dto/BookingDetailsView";

class ListUserBookingsService implements ListUserBookingsUseCase {
  private bookingRepository: BookingRepository;
  private screeningRepository: ScreeningRepository;

  public constructor(bookingRepository: BookingRepository, screeningRepository: ScreeningRepository) {
    this.bookingRepository = bookingRepository;
    this.screeningRepository = screeningRepository;
  }

  public execute(email: string): BookingDetailsView[] {
    // ---------------------------------------------------------------------------
    // GET /bookings?email=... : mes réservations
    // ---------------------------------------------------------------------------
    const screenings = this.screeningRepository.ReadDb();

    //Get bookings of this user
    const bookings = this.bookingRepository
      .ReadDb()
      .filter((b) => b.email == email);

    return bookings.map((b) => {
      const screening = screenings.find((s) => s.id == b.screeningId);
      return new BookingDetailsView(
        b,
        screening ? screening.movie : "?",
        screening ? screening.startsAt : null,
      );
    });
  }
}

export default ListUserBookingsService;
