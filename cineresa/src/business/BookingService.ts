import utilsDB from "../utils/utilitaireDB";
import app from "../server";
import HTTPException from "../utils/HTTPException";

class BookingService {
  private utils: utilsDB;

  public constructor(utils: utilsDB) {
    this.utils = utils;
  }

  public BookByIdUser(data: any): any {
    // ---------------------------------------------------------------------------
    // POST /screenings/:id/bookings : réserver des places
    // body : { email, seats, tariff: "NORMAL" | "STUDENT" }
    // ---------------------------------------------------------------------------

    const db = this.utils.readDb();
    const s = db.screenings.find((x: any) => x.id === data.params.id);
    if (!s) throw new HTTPException("Séance introuvable", { cause: 404 });

    const email = data.body.email;
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      throw new HTTPException("Email invalide", { cause: 400 });
    }

    const seats = Number(data.body.seats);
    if (!Number.isInteger(seats) || seats < 1 || seats > 6) {
      throw new HTTPException("Entre 1 et 6 places par réservation", {
        cause: 400,
      });
    }

    if (new Date(s.startsAt) <= new Date()) {
      throw new HTTPException("La séance a déjà commencé", { cause: 409 });
    }

    // calcul des places restantes (oui, c'est le même code que plus haut)
    let taken = 0;
    for (const b of db.bookings) {
      if (b.screeningId === s.id && b.status === "CONFIRMED") taken += b.seats;
    }
    if (taken + seats > s.capacity) {
      throw new HTTPException("Plus assez de places", { cause: 409 });
    }

    // calcul du prix (en centimes)
    let unit = s.price;
    if (data.body.tariff === "STUDENT") unit = Math.round(unit * 0.7);
    let total = unit * seats;
    if (seats >= 4) total = Math.round(total * 0.9);

    // paiement : appel au prestataire (simulé)
    const paid = Math.random() > 0.05;
    if (!paid) throw new HTTPException("Paiement refusé", { cause: 402 });

    const booking = {
      id: "b" + Date.now(),
      screeningId: s.id,
      email: email,
      seats: seats,
      tariff: data.body.tariff === "STUDENT" ? "STUDENT" : "NORMAL",
      total: total,
      status: "CONFIRMED",
      createdAt: new Date().toISOString(),
    };
    db.bookings.push(booking);
    this.utils.writeDb(db);

    // envoi du mail de confirmation
    console.log(
      `[SMTP] To: ${email} — Votre réservation ${booking.id} pour "${s.movie}" ` +
        `(${seats} place(s), ${(total / 100).toFixed(2)} €) est confirmée.`,
    );

    return booking;
  }

  public DeleteBooking(data: any): any {
    // ---------------------------------------------------------------------------
    // DELETE /bookings/:id : annuler (possible jusqu'à 2h avant la séance)
    // ---------------------------------------------------------------------------

    const db = this.utils.readDb();
    const b = db.bookings.find((x: any) => x.id === data.params.id);
    if (!b) throw new HTTPException("Réservation introuvable", { cause: 404 });
    if (b.status === "CANCELLED")
      throw new HTTPException("Déjà annulée", { cause: 409 });

    const s = db.screenings.find((x: any) => x.id === b.screeningId);
    const diff = new Date(s.startsAt).getTime() - new Date().getTime();
    if (diff < 2 * 60 * 60 * 1000) {
      throw new HTTPException(
        "Annulation impossible moins de 2h avant la séance",
        { cause: 409 },
      );
    }

    b.status = "CANCELLED";
    b.cancelledAt = new Date().toISOString();
    this.utils.writeDb(db);

    console.log(
      `[SMTP] To: ${b.email} — Votre réservation ${b.id} a été annulée. Remboursement : ${(b.total / 100).toFixed(2)} €`,
    );
    return b;
  }

  public BookingsByIdUser(data: any): any {
    // ---------------------------------------------------------------------------
    // GET /bookings?email=... : mes réservations
    // ---------------------------------------------------------------------------

    const db = this.utils.readDb();
    const list = db.bookings.filter((b: any) => b.email === data.query.email);

    return list.map((b: any) => {
      const s = db.screenings.find((x: any) => x.id === b.screeningId);
      return {
        ...b,
        movie: s ? s.movie : "?",
        startsAt: s ? s.startsAt : null,
      };
    });
  }
}

export default BookingService;
