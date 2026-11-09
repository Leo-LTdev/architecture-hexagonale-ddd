import express, { type NextFunction, type Response } from 'express';
import ScreeningService from "../business/ScreeningService";
import BookingService from "../business/BookingService";
import BusinessError, { type BusinessErrorKind } from "../business/BusinessError";
import { Booking, Screening, User } from "../models/types/types";
import BookingDto from "../models/objects/BookingDto";

const HTTP_STATUS_BY_ERROR: Record<BusinessErrorKind, number> = {
  NOT_FOUND: 404,
  INVALID: 400,
  CONFLICT: 409,
  PAYMENT_REFUSED: 402,
};

export class RoutesController {
  public router = express.Router();
  private screeningService: ScreeningService;
  private bookingService: BookingService;

  constructor(screeningService: ScreeningService, bookingService: BookingService) {
    this.screeningService = screeningService;
    this.bookingService = bookingService;
    this.initializeRoutes();
  }

  private handleError = (e: unknown, res: Response, next: NextFunction) => {
    if (e instanceof BusinessError) {
      res.status(HTTP_STATUS_BY_ERROR[e.kind]).json({ error: e.message });
      return;
    }
    next(e);
  };

  private initializeRoutes() {
    this.router.get("/screenings", (req, res) => {
      const result = this.screeningService.GetScreenings().map((s) => ({
        id: s.id,
        movie: s.movie,
        room: s.room,
        startsAt: s.startsAt,
        price: s.price,
        remaining: s.remaining,
      }));
      res.status(200).json(result);
    });

    this.router.post("/screenings/:id/bookings", async (req, res, next) => {
      try {
        const screening = Screening.fromJSON(JSON.stringify({ id: req.params.id }));
        const data = new BookingDto(req.body?.email, req.body?.seats, req.body?.tariff);
        const result = this.bookingService.BookByIdUser(screening, data);
        res.status(201).json(result);
      } catch (e) {
        this.handleError(e, res, next);
      }
    });

    this.router.delete("/bookings/:id", (req, res, next) => {
      try {
        const booking = Booking.fromJSON(JSON.stringify({ id: req.params.id }));
        res.json(this.bookingService.DeleteBooking(booking));
      } catch (e) {
        this.handleError(e, res, next);
      }
    });

    this.router.get("/bookings", (req, res) => {
      const user = new User(0, req.query.email as string);
      res.json(this.bookingService.BookingsByIdUser(user));
    });
  }
}
