import ListUserBookingsInterface from "@application/ports/in/ListUserBookingsInterface";
import BookingRepositoryInterface from "@application/ports/out/BookingRepositoryInterface";
import ScreeningRepositoryInterface from "@application/ports/out/ScreeningRepositoryInterface";
import BookingDetailsView from "@application/dto/BookingDetailsView";

export class ListUserBookingsUseCase implements ListUserBookingsInterface {
  public constructor(
    private readonly bookingRepository: BookingRepositoryInterface,
    private readonly screeningRepository: ScreeningRepositoryInterface,
  ) {}

  // GET /bookings?email=... : mes réservations
  public execute(email: string): BookingDetailsView[] {
    const screenings = this.screeningRepository.ReadDb();
    const wanted = email.trim().toLowerCase();

    return this.bookingRepository
      .ReadDb()
      .filter((b) => b.email.value === wanted)
      .map((b) => {
        const screening = screenings.find((s) => s.id === b.screeningId);
        return new BookingDetailsView(
          b,
          screening ? screening.movie.value : "?",
          screening ? screening.startsAt.toISOString() : null,
        );
      });
  }
}
