import HTTPException from "../utils/HTTPException";
import BookingRepository from "../data/BookingRepository";
import ScreeningRepository from "../data/ScreeningRepository";
import { BookingRepositoryInterface, BookingServiceInterface, ScreeningRepositoryInterface, UtilsInterface } from "../interfaces/Interfaces";
import {
  Booking,
  TarifPolicy,
  TarifRules,
  BookingStatus,
  Screening,
  User,
} from "../models/types/types";
import BookingDto from "../models/objects/BookingDto";
import BookingDetailsDto from "../models/objects/BookingDetailsDto";

class BookingService implements BookingServiceInterface {
  private utils: UtilsInterface;
  private bookingRepository: BookingRepositoryInterface;
  private screeningRepository: ScreeningRepositoryInterface;

  public constructor(utils: UtilsInterface, bookingRepository: BookingRepositoryInterface, screeningRepository: ScreeningRepositoryInterface) {
    this.utils = utils;
    this.bookingRepository = bookingRepository;
    this.screeningRepository = screeningRepository;
  }

  public BookByIdUser(screeningData: Screening, data: BookingDto): Booking {
    // ---------------------------------------------------------------------------
    // POST /screenings/:id/bookings : réserver des places
    // body : { email, seats, tariff: "NORMAL" | "STUDENT" | "SENIOR" | "CHILD" }
    // ---------------------------------------------------------------------------
    //Get screening by id
    const screening = this.screeningRepository
      .ReadDb()
      .find((s) => s.id == screeningData.id);

    if (!screening)
      throw new HTTPException("Séance introuvable", { cause: 404 });

    const email = data.email;
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      throw new HTTPException("Email invalide", { cause: 400 });
    }

    const seats = Number(data.seats);
    if (!Number.isInteger(seats) || seats < 1 || seats > 6) {
      throw new HTTPException("Entre 1 et 6 places par réservation", {
        cause: 400,
      });
    }

    if (new Date(screening.startsAt) <= new Date()) {
      throw new HTTPException("La séance a déjà commencé", { cause: 409 });
    }

    const bookings = this.bookingRepository.ReadDb();

    //Get bookings for this screening and status confirmed
    const taken = bookings
      .filter(
        (b) =>
          b.screeningId == screening.id && b.status == BookingStatus.CONFIRMED,
      )
      .reduce((sum, b) => sum + b.seats, 0);

    if (taken + seats > screening.capacity)
      throw new HTTPException("Plus assez de places", { cause: 409 });

    // calcul du prix (en centimes)
    const tariff = Object.values(TarifPolicy).includes(data.tariff)
      ? data.tariff
      : TarifPolicy.NORMAL;
    let unit = screening.price;

    switch (tariff) {
      case TarifPolicy.CHILD:
        unit = Math.round(unit * TarifRules.CHILD);
        break;
      case TarifPolicy.STUDENT:
        unit = Math.round(unit * TarifRules.STUDENT);
        break;
      case TarifPolicy.SENIOR:
        unit = Math.round(unit * TarifRules.SENIOR);
        break;
      default:
        unit = Math.round(unit * TarifRules.NORMAL);
    }

    let total = unit * seats;
    if (seats >= 4) total = Math.round(total * TarifRules.UPFOR);

    // paiement : appel au prestataire (simulé)
    const paid = Math.random() > 0.05;
    if (!paid) throw new HTTPException("Paiement refusé", { cause: 402 });

    const booking = new Booking(
      "b" + Date.now(),
      screening.id,
      email,
      seats,
      tariff,
      total,
      BookingStatus.CONFIRMED,
      new Date().toISOString(),
    );

    bookings.push(booking);
    this.bookingRepository.WriteDb(bookings);

    // envoi du mail de confirmation
    console.log(
      `[SMTP] To: ${email} — Votre réservation ${booking.id} pour "${screening.movie}" ` +
        `(${seats} place(s), ${(total / 100).toFixed(2)} €) est confirmée.`,
    );

    return booking;
  }

  public DeleteBooking(bookingData: Booking): Booking {
    // ---------------------------------------------------------------------------
    // DELETE /bookings/:id : annuler (possible jusqu'à 2h avant la séance)
    // ---------------------------------------------------------------------------
    const bookings = this.bookingRepository.ReadDb();

    //Get booking by id
    const booking = bookings.find((b) => b.id == bookingData.id);

    if (!booking)
      throw new HTTPException("Réservation introuvable", { cause: 404 });
    if (booking.status == BookingStatus.CANCELLED)
      throw new HTTPException("Déjà annulée", { cause: 409 });

    //Get screening of this booking
    const screening = this.screeningRepository
      .ReadDb()
      .find((s) => s.id == booking.screeningId);

    if (!screening)
      throw new HTTPException("Séance introuvable", { cause: 404 });

    const diff = new Date(screening.startsAt).getTime() - new Date().getTime();
    if (diff < 2 * 60 * 60 * 1000) {
      throw new HTTPException(
        "Annulation impossible moins de 2h avant la séance",
        { cause: 409 },
      );
    }

    booking.status = BookingStatus.CANCELLED;
    booking.cancelledAt = new Date().toISOString();
    this.bookingRepository.WriteDb(bookings);

    console.log(
      `[SMTP] To: ${booking.email} — Votre réservation ${booking.id} a été annulée. Remboursement : ${(booking.total / 100).toFixed(2)} €`,
    );

    return booking;
  }

  public BookingsByIdUser(userData: User): BookingDetailsDto[] {
    // ---------------------------------------------------------------------------
    // GET /bookings?email=... : mes réservations
    // ---------------------------------------------------------------------------

    const screenings = this.screeningRepository.ReadDb();

    //Get bookings of this user
    const bookings = this.bookingRepository
      .ReadDb()
      .filter((b) => b.email == userData.email);

    return bookings.map((b) => {
      const screening = screenings.find((s) => s.id == b.screeningId);
      return new BookingDetailsDto(
        b,
        screening ? screening.movie : "?",
        screening ? screening.startsAt : null,
      );
    });
  }

  public calculatePrice( // (surtout utilisé pour le test, sinon inutile..)
    basePrice: number,
    seats: number,
    requestedTariff?: TarifPolicy | string,
  ): { tariff: TarifPolicy; total: number } {
    const tariff = Object.values(TarifPolicy).includes(
      requestedTariff as TarifPolicy,
    )
      ? (requestedTariff as TarifPolicy)
      : TarifPolicy.NORMAL;

    let unit = basePrice;

    switch (tariff) {
      case TarifPolicy.CHILD:
        unit = Math.round(unit * TarifRules.CHILD);
        break;
      case TarifPolicy.STUDENT:
        unit = Math.round(unit * TarifRules.STUDENT);
        break;
      case TarifPolicy.SENIOR:
        unit = Math.round(unit * TarifRules.SENIOR);
        break;
      default:
        unit = Math.round(unit * TarifRules.NORMAL);
    }

    let total = unit * seats;
    if (seats >= 4) total = Math.round(total * TarifRules.UPFOR);

    return { tariff, total };
  }
}

export default BookingService;
