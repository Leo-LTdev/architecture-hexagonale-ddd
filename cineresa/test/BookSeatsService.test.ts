import { describe, expect, it } from "vitest";
import { InMemoryEventBus } from "../src/adapters/out/events/InMemoryEventBus";
import { FakePaymentGateway } from "../src/adapters/out/payment/FakePaymentGateway";
import { InMemoryScreeningRepository } from "../src/adapters/out/persistence/InMemoryScreeningRepository";
import { NotifyCustomer } from "../src/application/handlers/NotifyCustomer";
import { BookSeatsService } from "../src/application/usecases/BookSeatsService";
import { BookingConfirmed } from "../src/domain/booking/events";
import { Screening } from "../src/domain/booking/Screening";
import { Money } from "../src/domain/shared/Money";

const NOW = new Date("2026-10-20T10:00:00Z");
const command = (over = {}) => ({ screeningId: "s1", email: "a@b.fr", seats: 2, tariff: "NORMAL", ...over });

function setup({ paid = true, capacity = 10, startsAt = new Date("2026-10-20T20:00:00Z") } = {}) {
  const screenings = new InMemoryScreeningRepository([
    Screening.schedule({ id: "s1", movie: "Dune", room: "1", startsAt, capacity, unitPrice: Money.euros(10) }),
  ]);
  const mails: BookingConfirmed[] = [];
  const notifyCustomer = new NotifyCustomer({
    bookingConfirmed: async (event) => void mails.push(event),
    bookingCancelled: async () => {},
  });
  const bus = new InMemoryEventBus();
  bus.subscribe("BookingConfirmed", (event) => notifyCustomer.onBookingConfirmed(event));
  const service = new BookSeatsService(screenings, new FakePaymentGateway(() => paid), bus, { now: () => NOW }, { next: () => "b1" });
  return { service, screenings, bus, mails };
}

describe("BookSeatsService", () => {
  it("réserve des places, calcule le prix (4 places étudiant = 2 520 centimes pour 10 €) et notifie le client", async () => {
    const { service, screenings, bus, mails } = setup();

    const booking = await service.execute(command({ seats: 4, tariff: "STUDENT" }));

    expect(booking).toEqual({
      id: "b1", screeningId: "s1", email: "a@b.fr", seats: 4, tariff: "STUDENT", total: 2520,
      status: "CONFIRMED", createdAt: NOW.toISOString(),
    });
    expect((await screenings.findById("s1"))?.remainingSeats()).toBe(6);
    expect(bus.published[0]).toBeInstanceOf(BookingConfirmed);
    expect(mails).toHaveLength(1);
    expect(mails[0].email.value).toBe("a@b.fr");
  });

  it("refuse si la capacité de la salle est dépassée", async () => {
    const { service } = setup({ capacity: 3 });
    await expect(service.execute(command({ seats: 4 }))).rejects.toMatchObject({ code: "CONFLICT", message: "Plus assez de places" });
  });

  it("refuse une séance déjà commencée (code CONFLICT)", async () => {
    const { service } = setup({ startsAt: NOW });
    await expect(service.execute(command())).rejects.toMatchObject({ code: "CONFLICT", message: "La séance a déjà commencé" });
  });

  it("refuse plus de 6 places (code INVALID)", async () => {
    const { service } = setup();
    await expect(service.execute(command({ seats: 7 }))).rejects.toMatchObject({ code: "INVALID" });
  });

  it("refuse un email invalide (code INVALID)", async () => {
    const { service } = setup();
    await expect(service.execute(command({ email: "pas-un-mail" }))).rejects.toMatchObject({ code: "INVALID", message: "Email invalide" });
  });

  it("refuse une séance inconnue (code NOT_FOUND)", async () => {
    const { service } = setup();
    await expect(service.execute(command({ screeningId: "zz" }))).rejects.toMatchObject({ code: "NOT_FOUND", message: "Séance introuvable" });
  });

  it("n'enregistre rien et ne notifie pas si le paiement est refusé (code PAYMENT_REFUSED)", async () => {
    const { service, screenings, bus, mails } = setup({ paid: false });

    await expect(service.execute(command())).rejects.toMatchObject({ code: "PAYMENT_REFUSED", message: "Paiement refusé" });

    expect((await screenings.findById("s1"))?.remainingSeats()).toBe(10);
    expect(bus.published).toHaveLength(0);
    expect(mails).toHaveLength(0);
  });
});
