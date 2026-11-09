import { SeatCount } from "@domain/booking/SeatCount";
import { Tariff } from "@domain/booking/Tariff";
import { DomainError } from "@domain/shared/DomainError";
import { Email } from "@domain/shared/Email";
import { Money } from "@domain/shared/Money";

export type BookingStatus = "CONFIRMED" | "CANCELLED";

// Forme "plate" d'une réservation, utilisée pour la persistance.
export interface BookingSnapshot {
  id: string;
  screeningId: string;
  email: string;
  seats: number;
  tariff: Tariff;
  totalCents: number;
  status: BookingStatus;
  createdAt: Date;
  cancelledAt?: Date;
}

export class Booking {
  private constructor(
    public readonly id: string,
    public readonly screeningId: string,
    public readonly email: Email,
    public readonly seats: SeatCount,
    public readonly tariff: Tariff,
    public readonly total: Money,
    private _status: BookingStatus,
    public readonly createdAt: Date,
    private _cancelledAt?: Date,
  ) {}

  static confirm(props: {
    id: string;
    screeningId: string;
    email: Email;
    seats: SeatCount;
    tariff: Tariff;
    total: Money;
    now: Date;
  }): Booking {
    return new Booking(props.id, props.screeningId, props.email, props.seats, props.tariff, props.total, "CONFIRMED", props.now);
  }

  static fromSnapshot(snapshot: BookingSnapshot): Booking {
    return new Booking(
      snapshot.id,
      snapshot.screeningId,
      new Email(snapshot.email),
      new SeatCount(snapshot.seats),
      snapshot.tariff,
      Money.cents(snapshot.totalCents),
      snapshot.status,
      snapshot.createdAt,
      snapshot.cancelledAt,
    );
  }

  get status(): BookingStatus {
    return this._status;
  }

  get cancelledAt(): Date | undefined {
    return this._cancelledAt;
  }

  isConfirmed(): boolean {
    return this._status === "CONFIRMED";
  }

  cancel(now: Date): void {
    if (!this.isConfirmed()) throw new DomainError("CONFLICT", "Déjà annulée");
    this._status = "CANCELLED";
    this._cancelledAt = now;
  }

  toSnapshot(): BookingSnapshot {
    return {
      id: this.id,
      screeningId: this.screeningId,
      email: this.email.value,
      seats: this.seats.value,
      tariff: this.tariff,
      totalCents: this.total.cents,
      status: this._status,
      createdAt: this.createdAt,
      ...(this._cancelledAt && { cancelledAt: this._cancelledAt }),
    };
  }
}
