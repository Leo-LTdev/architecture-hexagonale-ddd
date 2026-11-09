import { DomainEvent } from "@domain/shared/DomainEvent";
import { Email } from "@domain/shared/Email";
import { Money } from "@domain/shared/Money";

export class BookingConfirmed implements DomainEvent {
  readonly type = "BookingConfirmed";

  constructor(
    readonly occurredAt: Date,
    readonly bookingId: string,
    readonly movie: string,
    readonly email: Email,
    readonly seats: number,
    readonly total: Money,
  ) {}
}

export class BookingCancelled implements DomainEvent {
  readonly type = "BookingCancelled";

  constructor(
    readonly occurredAt: Date,
    readonly bookingId: string,
    readonly email: Email,
    readonly refund: Money,
  ) {}
}
