import { Booking, BookingPrimitives } from "@domain/models/Entity/Booking";
import BookingRepositoryPort from "@application/ports/out/BookingRepositoryInterface";
import JsonDatabaseInterface from "@application/ports/in/JsonDatabaseInterface";

// Traduit JSON <-> Entity Booking.
class BookingRepository implements BookingRepositoryPort {
    public constructor(private readonly jsonDatabase: JsonDatabaseInterface) {}

    public ReadDb(): Booking[] {
        const data = this.jsonDatabase.readDb();
        return data.bookings.map((b: BookingPrimitives) => Booking.restore(b));
    }

    public WriteDb(data: Booking[]): void {
        const db = this.jsonDatabase.readDb();
        db.bookings = data.map((b) => b.toJSON());
        this.jsonDatabase.writeDb(db);
    }
}

export default BookingRepository;
