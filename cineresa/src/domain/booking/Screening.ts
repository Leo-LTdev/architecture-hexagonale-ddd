import { Booking, BookingSnapshot } from "@domain/booking/Booking";
import { BookingCancelled, BookingConfirmed } from "@domain/booking/events";
import { PricingPolicy } from "@domain/booking/PricingPolicy";
import { SeatCount } from "@domain/booking/SeatCount";
import { Tariff } from "@domain/booking/Tariff";
import { DomainError } from "@domain/shared/DomainError";
import { DomainEvent } from "@domain/shared/DomainEvent";
import { Email } from "@domain/shared/Email";
import { Money } from "@domain/shared/Money";

const CANCELLATION_DEADLINE_MS = 2 * 60 * 60 * 1000;

// Forme "plate" de l'agrégat, utilisée pour la persistance.
export interface ScreeningSnapshot {
  id: string;
  movie: string;
  room: string;
  startsAt: Date;
  capacity: number;
  unitPriceCents: number;
  bookings: BookingSnapshot[];
}

// Racine d'agrégat : seule porte d'entrée pour réserver et annuler.
export class Screening {
  private events: DomainEvent[] = [];

  private constructor(
    public readonly id: string,
    public readonly movie: string,
    public readonly room: string,
    public readonly startsAt: Date,
    public readonly capacity: number,
    public readonly unitPrice: Money,
    private readonly bookings: Booking[],
  ) {}

  static schedule(props: { id: string; movie: string; room: string; startsAt: Date; capacity: number; unitPrice: Money }): Screening {
    return new Screening(props.id, props.movie, props.room, props.startsAt, props.capacity, props.unitPrice, []);
  }

  static fromSnapshot(snapshot: ScreeningSnapshot): Screening {
    return new Screening(
      snapshot.id,
      snapshot.movie,
      snapshot.room,
      snapshot.startsAt,
      snapshot.capacity,
      Money.cents(snapshot.unitPriceCents),
      snapshot.bookings.map((b) => Booking.fromSnapshot(b)),
    );
  }

  remainingSeats(): number {
    const taken = this.bookings
      .filter((b) => b.isConfirmed())
      .reduce((sum, b) => sum + b.seats.value, 0);
    return this.capacity - taken;
  }

  findBooking(bookingId: string): Booking | undefined {
    return this.bookings.find((b) => b.id === bookingId);
  }

  bookingsOf(email: Email): Booking[] {
    return this.bookings.filter((b) => b.email.equals(email));
  }

  book(request: { bookingId: string; email: Email; seats: SeatCount; tariff: Tariff; now: Date }): Booking {
    if (this.startsAt <= request.now) throw new DomainError("CONFLICT", "La séance a déjà commencé");
    if (request.seats.value > this.remainingSeats()) throw new DomainError("CONFLICT", "Plus assez de places");

    const booking = Booking.confirm({
      id: request.bookingId,
      screeningId: this.id,
      email: request.email,
      seats: request.seats,
      tariff: request.tariff,
      total: PricingPolicy.total(this.unitPrice, request.seats, request.tariff),
      now: request.now,
    });
    this.bookings.push(booking);
    this.events.push(new BookingConfirmed(request.now, booking.id, this.movie, booking.email, booking.seats.value, booking.total));
    return booking;
  }

  cancel(bookingId: string, now: Date): Booking {
    const booking = this.findBooking(bookingId);
    if (!booking) throw new DomainError("NOT_FOUND", "Réservation introuvable");

    // Une réservation déjà annulée est refusée par Booking.cancel, avant la limite des 2h.
    if (booking.isConfirmed() && this.startsAt.getTime() - now.getTime() < CANCELLATION_DEADLINE_MS) {
      throw new DomainError("CONFLICT", "Annulation impossible moins de 2h avant la séance");
    }
    booking.cancel(now);
    this.events.push(new BookingCancelled(now, booking.id, booking.email, booking.total));
    return booking;
  }

  pullEvents(): DomainEvent[] {
    const pulled = this.events;
    this.events = [];
    return pulled;
  }

  toSnapshot(): ScreeningSnapshot {
    return {
      id: this.id,
      movie: this.movie,
      room: this.room,
      startsAt: this.startsAt,
      capacity: this.capacity,
      unitPriceCents: this.unitPrice.cents,
      bookings: this.bookings.map((b) => b.toSnapshot()),
    };
  }
}
