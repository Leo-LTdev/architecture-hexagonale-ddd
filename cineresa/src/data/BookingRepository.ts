import Utils from '../utils/Utils';
import {Booking} from '../models/types/types'
import { RepositoryInterface } from '../interfaces/Interfaces';

class BookingRepository implements RepositoryInterface {
    private utils: Utils;

    public constructor(utils: Utils) {
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
