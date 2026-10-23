export class ScreeningType {
    public id: string;
    public movie: string;
    public room: string;
    public seats: number;
    public capacity: number;
    public startsAt: Date;
    public price: number;
    public remaining: number;

    public constructor(
        id: string,
        movie: string,
        room: string,
        seats: number,
        capacity: number,
        startsAt: Date, 
        price: number, 
        remaining: number
    ) {
        this.id = id;
        this.movie = movie;
        this.room = room;
        this.capacity = capacity,
        this.seats = seats,
        this.startsAt = startsAt;
        this.price = price;
        this.remaining = remaining;
    }

    public toJSON(): object{
        return {
            id: this.id,
            movie: this.movie,
            room: this.room,
            seats: this.seats,
            capacity: this.capacity,
            startsAt: this.startsAt,
            price: this.price,
            remaining: this.remaining
        };
    }

    public static fromJSON(json: string): ScreeningType{
        const data = JSON.parse(json);
        return new ScreeningType(
        data.id,
            data.movie,
            data.room,
            data.seats, 
            data.capacity,
            data.startsAt,
            data.price,
            data.remaining
        );
    }
}