import BusinessRuleError from "@domain/errors/BusinessRuleError";
import { BookingStatusEnum } from "@domain/models/Enums/BookingStatusEnum";
import { ErrorStatusEnum } from "@domain/models/Enums/ErrorStatusEnum";
import { TariffPolicyEnum } from "@domain/models/Enums/TariffPolicyEnum";
import { DateTime } from "@domain/models/ValueObject/DateTime";
import { Email } from "@domain/models/ValueObject/Email";
import { Seats } from "@domain/models/ValueObject/Seats";
import { Tariff } from "@domain/models/ValueObject/Tariff";
import { Total } from "@domain/models/ValueObject/Total";
import { Screening } from "./Screening";

// Forme "plate" d'une réservation, telle qu'elle est stockée / exposée.
export interface BookingPrimitives {
  id: string;
  screeningId: string;
  email: string;
  seats: number;
  tariff: TariffPolicyEnum;
  total: number;
  status: BookingStatusEnum;
  createdAt: string;
  cancelledAt?: string;
}

export class Booking {
  private constructor(
    private readonly _id: string,
    // Référence à l'autre agrégat par son id, pas par l'objet.
    private readonly _screeningId: string,
    private readonly _email: Email,
    private readonly _seats: Seats,
    private readonly _tariff: Tariff,
    private readonly _total: Total,
    private _status: BookingStatusEnum,
    private readonly _createdAt: DateTime,
    private _cancelledAt?: DateTime,
  ) {}

  // Nouvelle réservation : vérifie les règles de la séance et calcule le prix.
  static book(props: {
    id: string;
    screening: Screening;
    email: Email;
    seats: Seats;
    tariff: Tariff;
    now: DateTime;
    bookedSeats: number;
  }): Booking {
    props.screening.ensureCanBeBooked(props.now, props.bookedSeats, props.seats);

    return new Booking(
      props.id,
      props.screening.id,
      props.email,
      props.seats,
      props.tariff,
      Total.calculate(props.screening.price.value, props.seats, props.tariff),
      BookingStatusEnum.CONFIRMED,
      props.now,
    );
  }

  // Reconstitution depuis la persistance.
  static restore(props: BookingPrimitives): Booking {
    return new Booking(
      props.id,
      props.screeningId,
      Email.create(props.email),
      Seats.create(props.seats),
      Tariff.create(props.tariff),
      Total.create(props.total),
      props.status,
      DateTime.create(props.createdAt),
      props.cancelledAt ? DateTime.create(props.cancelledAt) : undefined,
    );
  }

  get id(): string { return this._id; }
  get screeningId(): string { return this._screeningId; }
  get email(): Email { return this._email; }
  get seats(): Seats { return this._seats; }
  get tariff(): Tariff { return this._tariff; }
  get total(): Total { return this._total; }
  get status(): BookingStatusEnum { return this._status; }
  get createdAt(): DateTime { return this._createdAt; }
  get cancelledAt(): DateTime | undefined { return this._cancelledAt; }

  isConfirmed(): boolean {
    return this._status === BookingStatusEnum.CONFIRMED;
  }

  cancel(screening: Screening, now: DateTime): void {
    if (this._status === BookingStatusEnum.CANCELLED) {
      throw new BusinessRuleError(ErrorStatusEnum.ALREADY_CANCELLED);
    }
    if (!screening.allowsCancellationAt(now)) {
      throw new BusinessRuleError(ErrorStatusEnum.CANCELLATION_TOO_LATE);
    }
    this._status = BookingStatusEnum.CANCELLED;
    this._cancelledAt = now;
  }

  toJSON(): BookingPrimitives {
    return {
      id: this._id,
      screeningId: this._screeningId,
      email: this._email.value,
      seats: this._seats.value,
      tariff: this._tariff.value,
      total: this._total.value,
      status: this._status,
      createdAt: this._createdAt.toISOString(),
      ...(this._cancelledAt && { cancelledAt: this._cancelledAt.toISOString() }),
    };
  }
}
