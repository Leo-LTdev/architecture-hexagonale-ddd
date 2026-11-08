import { Date } from "../ValueObject/Date";
import { Tariff } from "../ValueObject/Tariff";
import { Seats } from "../ValueObject/Seats";
import { Movie } from "../ValueObject/Movie";
import { Room } from "../ValueObject/Room";

interface ScreeningProps {
  id: string;
  movieName: Movie;
  room: Room;
  startsAt: Date;
  capacity: Seats;
  price: Tariff;
}

export class Screening {
  private constructor(private props: ScreeningProps) {}

  static create(
    id: string,
    movieName: Movie,
    room: Room,
    startsAt: Date,
    capacity: Seats,
    price: Tariff,
  ) {
    return new Screening({ id, movieName, room, startsAt, capacity, price });
  }

  get id(): string {
    return this.props.id;
  }
  get movieName(): Movie {
    return this.props.movieName;
  }

  addBooking(booking: any): void {}
}
