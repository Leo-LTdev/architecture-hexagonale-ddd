import {Booking} from '../models/types/types'
import { BookingRepositoryInterface, UtilsInterface } from '../interfaces/Interfaces';

class BookingRepository implements BookingRepositoryInterface {
    private utils: UtilsInterface;

    public constructor(utils: UtilsInterface) {
        this.utils = utils;
    }

    public ReadDb(): Booking[] {
        const data = this.utils.readDb();
        const result = data.bookings.map((b: any) => Booking.fromJSON(JSON.stringify(b)));
        return result;
    }

    public WriteDb(data: Booking[]): void{
        const db = this.utils.readDb();
        db.bookings = data;
        this.utils.writeDb(db);
    }
}

export default BookingRepository;
