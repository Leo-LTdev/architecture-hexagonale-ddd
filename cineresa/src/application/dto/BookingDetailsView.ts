/*
{ ...booking, "movie": "Dune: Part Three", "startsAt": "2026-10-20T10:28:03.002Z" }
*/

import { Booking } from "@domain/models/Entity/Booking";

class BookingDetailsView {
    public booking: Booking;
    public movie: string;
    public startsAt: string | null;

    public constructor(booking: Booking, movie: string, startsAt: string | null) {
        this.booking = booking;
        this.movie = movie;
        this.startsAt = startsAt;
    }

    public toJSON(): object {
        return {
            ...this.booking.toJSON(),
            movie: this.movie,
            startsAt: this.startsAt
        };
    }
}

export default BookingDetailsView;
