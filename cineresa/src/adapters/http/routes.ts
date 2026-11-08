import express, { type Response } from "express";
import HTTPException from "../../domain/utils/HTTPException";
import { ScreeningType as Screening, BookingType as Booking, User } from "../../domain/utils/models";
import BookingDto from "../../domain/models/objects/BookingDto";
import BookSeatsInterface from "../../application/ports/in/BookSeatsInterface";
import CancelBookingInterface from "../../application/ports/in/CancelBookingInterface";
import ListScreeningsInterface from "../../application/ports/in/ListScreeningsInterface";
import ListUserBookingsInterface from "../../application/ports/in/ListUserBookingsInterface";
import BookSeatsCommand from "../../application/dto/BookSeatsCommand";

export class RoutesController {
  public router = express.Router();
  private bookSeatsInterface: BookSeatsInterface;
  private cancelBookingInterface: CancelBookingInterface;
  private listScreeningsInterface: ListScreeningsInterface;
  private listUserBookingsInterface: ListUserBookingsInterface;

  constructor(
    bookSeatsInterface: BookSeatsInterface,
    cancelBookingInterface: CancelBookingInterface,
    listScreeningsInterface: ListScreeningsInterface,
    listUserBookingsInterface: ListUserBookingsInterface,
  ) {
    this.initializeRoutes();
    this.bookSeatsInterface = bookSeatsInterface;
    this.cancelBookingInterface = cancelBookingInterface;
    this.listScreeningsInterface = listScreeningsInterface;
    this.listUserBookingsInterface = listUserBookingsInterface;
  }

  private handleError = (e: unknown, res: Response) => {
    if (e instanceof HTTPException) {
      res.status(e.cause).json({ error: e.message });
    }
  };

  private initializeRoutes() {
    this.router.get("/screenings", (req, res) => {
      const result = this.listScreeningsInterface.execute()
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
        const result = this.bookSeatsInterface.execute(new BookSeatsCommand(screening.id, data.email, data.seats, data.tariff));
        res.status(201).json(result);
      } catch (e) {
        this.handleError(e, res);
      }
    });

    this.router.delete("/bookings/:id", async (req, res) => {
      try {
        const booking = Booking.fromJSON(JSON.stringify({ id: req.params.id }));
        this.cancelBookingInterface.execute(booking.id ?? null);
        res.status(204).send();
      } catch (e) {
        this.handleError(e, res);
      }
    });

    this.router.get("/bookings", async (req, res) => {
      const user = new User(0, String(req.query.email ?? ""));
      res.json(this.listUserBookingsInterface.execute(user.email));
    });
  }
}
