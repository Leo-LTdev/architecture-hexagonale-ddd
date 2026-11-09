/*
{ "id": "s1", "movie": "Dune: Part Three", "room": "Salle 1", "seats": 120, "capacity": 120,
  "startsAt": "2026-10-20T10:28:03.002Z", "price": 1150, "remaining": 118 }
*/

import { Screening } from "@domain/models/Entity/Screening";

class ScreeningView {
    public id: string;
    public movie: string;
    public room: string;
    public seats: number;
    public capacity: number;
    public startsAt: string;
    public price: number;
    public remaining: number;

    public constructor(screening: Screening, remaining: number) {
        this.id = screening.id;
        this.movie = screening.movie.value;
        this.room = screening.room.value;
        this.seats = screening.capacity.value;
        this.capacity = screening.capacity.value;
        this.startsAt = screening.startsAt.toISOString();
        this.price = screening.price.value;
        this.remaining = remaining;
    }
}

export default ScreeningView;
