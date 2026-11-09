import BusinessRuleError from "@domain/errors/BusinessRuleError";
import { ErrorStatusEnum } from "@domain/models/Enums/ErrorStatusEnum";
import { Capacity } from "@domain/models/ValueObject/Capacity";
import { DateTime } from "@domain/models/ValueObject/DateTime";
import { Movie } from "@domain/models/ValueObject/Movie";
import { Price } from "@domain/models/ValueObject/Price";
import { Room } from "@domain/models/ValueObject/Room";
import { Seats } from "@domain/models/ValueObject/Seats";

// Forme "plate" d'une séance, telle qu'elle est stockée / exposée.
export interface ScreeningPrimitives {
  id: string;
  movie: string;
  room: string;
  startsAt: string;
  capacity: number;
  price: number;
}

export class Screening {
  static readonly CANCELLATION_DELAY_HOURS = 2;

  private constructor(
    private readonly _id: string,
    private readonly _movie: Movie,
    private readonly _room: Room,
    private readonly _startsAt: DateTime,
    private readonly _capacity: Capacity,
    private readonly _price: Price,
  ) {}

  // Création d'une séance : chaque VO valide son champ.
  static create(props: ScreeningPrimitives): Screening {
    return new Screening(
      props.id,
      Movie.create(props.movie),
      Room.create(props.room),
      DateTime.create(props.startsAt),
      Capacity.create(props.capacity),
      Price.create(props.price),
    );
  }

  // Reconstitution depuis la persistance.
  static restore(props: ScreeningPrimitives): Screening {
    return Screening.create(props);
  }

  get id(): string { return this._id; }
  get movie(): Movie { return this._movie; }
  get room(): Room { return this._room; }
  get startsAt(): DateTime { return this._startsAt; }
  get capacity(): Capacity { return this._capacity; }
  get price(): Price { return this._price; }

  hasStartedAt(now: DateTime): boolean {
    return !now.isBefore(this._startsAt);
  }

  remainingSeats(bookedSeats: number): number {
    return Math.max(this._capacity.value - bookedSeats, 0);
  }

  // Règles : séance pas commencée + assez de places restantes.
  ensureCanBeBooked(now: DateTime, bookedSeats: number, requested: Seats): void {
    if (this.hasStartedAt(now)) {
      throw new BusinessRuleError(ErrorStatusEnum.SCREENING_STARTED);
    }
    if (requested.value > this.remainingSeats(bookedSeats)) {
      throw new BusinessRuleError(ErrorStatusEnum.NOT_ENOUGH_SEATS);
    }
  }

  // Annulation possible jusqu'à 2h avant le début.
  allowsCancellationAt(now: DateTime): boolean {
    return now.hoursUntil(this._startsAt) >= Screening.CANCELLATION_DELAY_HOURS;
  }

  toJSON(): ScreeningPrimitives {
    return {
      id: this._id,
      movie: this._movie.value,
      room: this._room.value,
      startsAt: this._startsAt.toISOString(),
      capacity: this._capacity.value,
      price: this._price.value,
    };
  }
}
