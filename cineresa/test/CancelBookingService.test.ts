import { describe, expect, it } from "vitest";
import { InMemoryEventBus } from "../src/adapters/out/events/InMemoryEventBus";
import { InMemoryScreeningRepository } from "../src/adapters/out/persistence/InMemoryScreeningRepository";
import { NotifyCustomer } from "../src/application/handlers/NotifyCustomer";
import { CancelBookingService } from "../src/application/usecases/CancelBookingService";
import { BookingCancelled } from "../src/domain/booking/events";
import { Screening } from "../src/domain/booking/Screening";
import { SeatCount } from "../src/domain/booking/SeatCount";
import { Email } from "../src/domain/shared/Email";
import { Money } from "../src/domain/shared/Money";

const STARTS_AT = new Date("2026-10-20T20:00:00Z");
const TWO_HOURS_BEFORE = new Date("2026-10-20T18:00:00Z");

function setup(now: Date) {
  const screening = Screening.schedule({ id: "s1", movie: "Dune", room: "1", startsAt: STARTS_AT, capacity: 10, unitPrice: Money.euros(10) });
  screening.book({ bookingId: "b1", email: new Email("a@b.fr"), seats: new SeatCount(2), tariff: "NORMAL", now: new Date("2026-10-19T10:00:00Z") });
  const screenings = new InMemoryScreeningRepository([screening]);

  const mails: BookingCancelled[] = [];
  const notifyCustomer = new NotifyCustomer({
    bookingConfirmed: async () => {},
    bookingCancelled: async (event) => void mails.push(event),
  });
  const bus = new InMemoryEventBus();
  bus.subscribe("BookingCancelled", (event) => notifyCustomer.onBookingCancelled(event));

  return { service: new CancelBookingService(screenings, bus, { now: () => now }), screenings, bus, mails };
}

describe("CancelBookingService", () => {
  it("annule exactement 2h avant la séance, libère les places et envoie le mail de remboursement", async () => {
    const { service, screenings, mails } = setup(TWO_HOURS_BEFORE);

    const booking = await service.execute("b1");

    expect(booking.status).toBe("CANCELLED");
    expect(booking.cancelledAt).toBe(TWO_HOURS_BEFORE.toISOString());
    expect((await screenings.findById("s1"))?.remainingSeats()).toBe(10);
    expect(mails).toHaveLength(1);
    expect(mails[0].refund.cents).toBe(2000);
  });

  it("refuse une milliseconde après la limite des 2h, sans rien enregistrer ni notifier", async () => {
    const { service, screenings, bus, mails } = setup(new Date(TWO_HOURS_BEFORE.getTime() + 1));

    await expect(service.execute("b1")).rejects.toMatchObject({ code: "CONFLICT", message: "Annulation impossible moins de 2h avant la séance" });

    expect((await screenings.findById("s1"))?.remainingSeats()).toBe(8);
    expect(bus.published).toHaveLength(0);
    expect(mails).toHaveLength(0);
  });

  it("refuse une double annulation", async () => {
    const { service } = setup(TWO_HOURS_BEFORE);
    await service.execute("b1");
    await expect(service.execute("b1")).rejects.toMatchObject({ code: "CONFLICT", message: "Déjà annulée" });
  });

  it("refuse une réservation inconnue (code NOT_FOUND)", async () => {
    const { service } = setup(TWO_HOURS_BEFORE);
    await expect(service.execute("zz")).rejects.toMatchObject({ code: "NOT_FOUND", message: "Réservation introuvable" });
  });
});
