import ListUserBookingsInterface from "../ports/in/ListUserBookingsInterface";
import BookingRepositoryInterface from "../ports/out/BookingRepositoryInterface";
import ScreeningRepositoryInterface from "../ports/out/ScreeningRepositoryInterface";
import BookingDetailsView from "../dto/BookingDetailsView";

export class ListUserBookingsUseCase implements ListUserBookingsInterface{
  private bookingRepository: BookingRepositoryInterface;
  private screeningRepository: ScreeningRepositoryInterface;

  public constructor(bookingRepository: BookingRepositoryInterface, 
    screeningRepository: ScreeningRepositoryInterface) {
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
