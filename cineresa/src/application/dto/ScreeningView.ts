/*
{ "id": "s1", "movie": "Dune: Part Three", "room": "Salle 1", "seats": 120, "capacity": 120,
  "startsAt": "2026-10-20T10:28:03.002Z", "price": 1150, "remaining": 118 }
*/

import { Screening } from "../../domain/models/types/types";

class ScreeningView {
    public id: string;
    public movie: string;
    public room: string;
    public seats: number;
    public capacity: number;
    public startsAt: Date;
    public price: number;
    public remaining: number;

    public constructor(screening: Screening, remaining: number) {
        this.id = screening.id;
        this.movie = screening.movie;
        this.room = screening.room;
        this.seats = screening.seats;
        this.capacity = screening.capacity;
        this.startsAt = screening.startsAt;
        this.price = screening.price;
        this.remaining = remaining;
    }
}

export default ScreeningView;
