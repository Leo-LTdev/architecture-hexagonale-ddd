import {Booking} from '../../domain/models/types/types'
import BookingRepositoryPort from '../../application/ports/out/BookingRepository';
import { JsonDatabaseInterface } from '../../domain/interfaces/Interfaces';


class BookingRepository implements BookingRepositoryPort{
    private jsonDatabase: JsonDatabaseInterface;

    public constructor(jsonDatabase: JsonDatabaseInterface) {
        this.jsonDatabase = jsonDatabase;
    }

    public ReadDb(): Booking[] {
        const data = this.jsonDatabase.readDb();
        const result = data.bookings.map((b: any) => Booking.fromJSON(JSON.stringify(b)));
        return result;
    }

    public WriteDb(data: Booking[]): void{
        const db = this.jsonDatabase.readDb();
        db.bookings = data;
        this.jsonDatabase.writeDb(db);
    }
}

export default BookingRepository;
