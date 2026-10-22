import express, { type Response } from "express";
import HTTPException from "../../domain/utils/HTTPException";
import { Booking, Screening, User } from "../../domain/models/types/types";
import BookingDto from "../../domain/models/objects/BookingDto";
import BookSeatsUseCase from "../../application/ports/in/BookSeatsUseCase";
import CancelBookingUseCase from "../../application/ports/in/CancelBookingUseCase";
import ListScreeningsUseCase from "../../application/ports/in/ListScreeningsUseCase";
import ListUserBookingsUseCase from "../../application/ports/in/ListUserBookingsUseCase";
import BookSeatsCommand from "../../application/dto/BookSeatsCommand";

export class RoutesController {
  public router = express.Router();
  private bookSeatsUseCase: BookSeatsUseCase;
  private cancelBookingUseCase: CancelBookingUseCase;
  private listScreeningUseCase: ListScreeningsUseCase;
  private listUserBookingUseCase: ListUserBookingsUseCase;

  constructor(
    bookSeatsUseCase: BookSeatsUseCase,
    cancelBookingUseCase: CancelBookingUseCase,
    listScreeningUseCase: ListScreeningsUseCase,
    listUserBookingUseCase: ListUserBookingsUseCase,
  ) {
    this.initializeRoutes();
    this.bookSeatsUseCase = bookSeatsUseCase;
    this.cancelBookingUseCase = cancelBookingUseCase;
    this.listScreeningUseCase = listScreeningUseCase;
    this.listUserBookingUseCase = listUserBookingUseCase;
  }

  private handleError = (e: unknown, res: Response) => {
    if (e instanceof HTTPException) {
      res.status(e.cause).json({ error: e.message });
    }
  };

  private initializeRoutes() {
    this.router.get("/screenings", (req, res) => {
      const result = this.listScreeningUseCase.execute()
      res.status(200).json(result);
    });

    this.router.post("/screenings/:id/bookings", async (req, res) => {
      try {
        const screening = Screening.fromJSON(
          JSON.stringify({ id: req.params.id }),
        );
        const data = new BookingDto(
          req.body?.email,
          req.body?.seats,
          req.body?.tariff,
        );
        const result = this.bookSeatsUseCase.execute(new BookSeatsCommand(screening.id, data.email, data.seats, data.tariff));
        res.status(201).json(result);
      } catch (e) {
        this.handleError(e, res);
      }
    });

    this.router.delete("/bookings/:id", async (req, res) => {
      try {
        const booking = Booking.fromJSON(JSON.stringify({ id: req.params.id }));
        this.cancelBookingUseCase.execute(booking.id ?? null);
        res.status(204).send();
      } catch (e) {
        this.handleError(e, res);
      }
    });

    this.router.get("/bookings", async (req, res) => {
      const user = new User(0, String(req.query.email ?? ""));
      res.json(this.listUserBookingUseCase.execute(user.email));
    });
  }
}
