import express, { type Express } from "express";
import { InMemoryEventBus } from "@adapters/out/events/InMemoryEventBus";
import { ConsoleNotifier } from "@adapters/out/notification/ConsoleNotifier";
import { FakePaymentGateway } from "@adapters/out/payment/FakePaymentGateway";
import { InMemoryScreeningRepository } from "@adapters/out/persistence/InMemoryScreeningRepository";
import { SystemClock } from "@adapters/out/system/SystemClock";
import { UuidGenerator } from "@adapters/out/system/UuidGenerator";
import { createRouter, domainErrorHandler } from "@adapters/in/http/routes";
import { NotifyCustomer } from "@application/handlers/NotifyCustomer";
import { Clock } from "@application/ports/out/Clock";
import { IdGenerator } from "@application/ports/out/IdGenerator";
import { Notifier } from "@application/ports/out/Notifier";
import { PaymentGateway } from "@application/ports/out/PaymentGateway";
import { ScreeningRepository } from "@application/ports/out/ScreeningRepository";
import { BookSeatsService } from "@application/usecases/BookSeatsService";
import { CancelBookingService } from "@application/usecases/CancelBookingService";
import { ListMyBookingsService } from "@application/usecases/ListMyBookingsService";
import { ListUpcomingScreeningsService } from "@application/usecases/ListUpcomingScreeningsService";
import { Screening } from "@domain/booking/Screening";
import { SeatCount } from "@domain/booking/SeatCount";
import { Email } from "@domain/shared/Email";
import { Money } from "@domain/shared/Money";

export interface Adapters {
  screenings: ScreeningRepository;
  payment: PaymentGateway;
  notifier: Notifier;
  clock: Clock;
  ids?: IdGenerator;
}

export function buildApp(adapters: Adapters): Express {
  const { screenings, payment, notifier, clock, ids = new UuidGenerator() } = adapters;

  const eventBus = new InMemoryEventBus();
  const notifyCustomer = new NotifyCustomer(notifier);
  eventBus.subscribe("BookingConfirmed", (event) => notifyCustomer.onBookingConfirmed(event));
  eventBus.subscribe("BookingCancelled", (event) => notifyCustomer.onBookingCancelled(event));

  const app = express();
  app.use(express.json());
  app.use(
    createRouter({
      bookSeats: new BookSeatsService(screenings, payment, eventBus, clock, ids),
      cancelBooking: new CancelBookingService(screenings, eventBus, clock),
      listUpcomingScreenings: new ListUpcomingScreeningsService(screenings, clock),
      listMyBookings: new ListMyBookingsService(screenings),
    }),
  );
  app.use(domainErrorHandler);
  return app;
}

// Mêmes données de départ que scripts/seed.ts.
function initialScreenings(now: Date): Screening[] {
  const inHours = (hours: number) => new Date(now.getTime() + hours * 3_600_000);

  const preview = Screening.schedule({ id: "s3", movie: "Avant-première surprise", room: "Salle 3", startsAt: inHours(1), capacity: 10, unitPrice: Money.cents(900) });
  preview.book({ bookingId: "b1", email: new Email("alice@example.com"), seats: new SeatCount(6), tariff: "NORMAL", now });

  return [
    Screening.schedule({ id: "s1", movie: "Dune: Part Three", room: "Salle 1", startsAt: inHours(26), capacity: 120, unitPrice: Money.cents(1150) }),
    Screening.schedule({ id: "s2", movie: "Le Comte de Monte-Cristo", room: "Salle 2", startsAt: inHours(50), capacity: 80, unitPrice: Money.cents(1050) }),
    preview,
  ];
}

export function defaultAdapters(): Adapters {
  const clock = new SystemClock();
  return {
    screenings: new InMemoryScreeningRepository(initialScreenings(clock.now())),
    payment: new FakePaymentGateway(),
    notifier: new ConsoleNotifier(),
    clock,
  };
}
