import BusinessError from "./BusinessError";
import calculatePrice from "./PriceCalculator";
import { remainingSeats } from "./ScreeningService";
import BookingRepository from "../data/BookingRepository";
import ScreeningRepository from "../data/ScreeningRepository";
import Mailer from "../data/Mailer";
import PaymentGateway from "../data/PaymentGateway";
import { BookingRepositoryInterface, BookingServiceInterface, ScreeningRepositoryInterface, UtilsInterface } from "../interfaces/Interfaces";
import {
  Booking,
  BookingStatus,
  Screening,
  User,
} from "../models/types/types";
import BookingDto from "../models/objects/BookingDto";
import BookingDetailsDto from "../models/objects/BookingDetailsDto";

const MIN_SEATS_PER_BOOKING = 1;
const MAX_SEATS_PER_BOOKING = 6;
const CANCELLATION_DEADLINE_MS = 2 * 60 * 60 * 1000;

class BookingService implements BookingServiceInterface {
  private utils: UtilsInterface;
  private bookingRepository: BookingRepositoryInterface;
  private screeningRepository: ScreeningRepositoryInterface;
  private mailer: Mailer;
  private paymentGateway: PaymentGateway;

  public constructor(
    utils: UtilsInterface,
    bookingRepository: BookingRepositoryInterface,
    screeningRepository: ScreeningRepositoryInterface,
    mailer: Mailer,
    paymentGateway: PaymentGateway,
  ) {
    this.utils = utils;
    this.bookingRepository = bookingRepository;
    this.screeningRepository = screeningRepository;
    this.mailer = mailer;
    this.paymentGateway = paymentGateway;
  }

  public BookByIdUser(screeningData: Screening, data: BookingDto): Booking {
    // ---------------------------------------------------------------------------
    // POST /screenings/:id/bookings : réserver des places
    // body : { email, seats, tariff: "NORMAL" | "STUDENT" }
    // ---------------------------------------------------------------------------
    //Get screening by id
    const screening = this.screeningRepository
      .ReadDb()
      .find((s) => s.id == screeningData.id);

    if (!screening)
      throw new BusinessError("Séance introuvable", "NOT_FOUND");

    const email = data.email;
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      throw new BusinessError("Email invalide", "INVALID");
    }

    const seats = Number(data.seats);
    if (!Number.isInteger(seats) || seats < MIN_SEATS_PER_BOOKING || seats > MAX_SEATS_PER_BOOKING) {
      throw new BusinessError(`Entre ${MIN_SEATS_PER_BOOKING} et ${MAX_SEATS_PER_BOOKING} places par réservation`, "INVALID");
    }

    if (new Date(screening.startsAt) <= new Date()) {
      throw new BusinessError("La séance a déjà commencé", "CONFLICT");
    }

    const bookings = this.bookingRepository.ReadDb();

    if (seats > remainingSeats(screening, bookings))
      throw new BusinessError("Plus assez de places", "CONFLICT");

    const { tariff, total } = calculatePrice(screening.price, seats, data.tariff);

    if (!this.paymentGateway.pay()) throw new BusinessError("Paiement refusé", "PAYMENT_REFUSED");

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

    this.mailer.sendBookingConfirmation(booking, screening.movie);

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
      throw new BusinessError("Réservation introuvable", "NOT_FOUND");
    if (booking.status == BookingStatus.CANCELLED)
      throw new BusinessError("Déjà annulée", "CONFLICT");

    //Get screening of this booking
    const screening = this.screeningRepository
      .ReadDb()
      .find((s) => s.id == booking.screeningId);

    // Comme le legacy : une séance absente provoque une erreur 500
    const diff = new Date(screening!.startsAt).getTime() - new Date().getTime();
    if (diff < CANCELLATION_DEADLINE_MS) {
      throw new BusinessError("Annulation impossible moins de 2h avant la séance", "CONFLICT");
    }

    booking.status = BookingStatus.CANCELLED;
    booking.cancelledAt = new Date().toISOString();
    this.bookingRepository.WriteDb(bookings);

    this.mailer.sendCancellation(booking);

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
      .filter((b) => b.email === userData.email);

    return bookings.map((b) => {
      const screening = screenings.find((s) => s.id == b.screeningId);
      return new BookingDetailsDto(
        b,
        screening ? screening.movie : "?",
        screening ? screening.startsAt : null,
      );
    });
  }
}

export default BookingService;
