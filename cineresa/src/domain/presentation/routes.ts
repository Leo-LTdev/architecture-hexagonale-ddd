import express, { type Response } from 'express';
import ScreeningService from "../../business/ScreeningService";
import BookingService from "../../business/BookingService";
import HTTPException from "../utils/HTTPException";
import { Booking, Screening, User } from "../models/types/types";
import BookingDto from "../models/objects/BookingDto";

export class RoutesController {
  public router = express.Router();
  private screeningService: ScreeningService;
  private bookingService: BookingService;

  constructor(screeningService: ScreeningService, bookingService: BookingService) {
    this.screeningService = screeningService;
    this.bookingService = bookingService;
    this.initializeRoutes();
  }

  private handleError = (e: unknown, res: Response) => {
    if (e instanceof HTTPException) {
      res.status(e.cause).json({ error: e.message });
    }
  };

  private initializeRoutes() {
    this.router.get("/screenings", (req, res) => {
      const result = this.screeningService.GetScreenings();
      res.status(200).json(result);
    });

    this.router.post("/screenings/:id/bookings", async (req, res) => {
      try {
        const screening = Screening.fromJSON(JSON.stringify({ id: req.params.id }));
        const data = new BookingDto(req.body?.email, req.body?.seats, req.body?.tariff);
        const result = this.bookingService.BookByIdUser(screening, data);
        res.status(201).json(result);
      } catch (e) {
        this.handleError(e, res);
      }
    });

    this.router.delete("/bookings/:id", async (req, res) => {
      try {
        const booking = Booking.fromJSON(JSON.stringify({ id: req.params.id }));
        this.bookingService.DeleteBooking(booking);
        res.status(204).send();
      } catch (e) {
        this.handleError(e, res);
      }
    });

    this.router.get("/bookings", async (req, res) => {
      const user = new User(0, String(req.query.email ?? ""));
      res.json(this.bookingService.BookingsByIdUser(user));
    });
  }
}