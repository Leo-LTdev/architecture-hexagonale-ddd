import express, { type Response } from "express";
import {
  BusinessRuleError,
  NotFoundError,
  PaymentRefusedError,
  ValidationError,
} from "@domain/errors/errors";
import { User } from "@domain/utils/models";
import BookSeatsInterface from "@application/ports/in/BookSeatsInterface";
import CancelBookingInterface from "@application/ports/in/CancelBookingInterface";
import ListScreeningsInterface from "@application/ports/in/ListScreeningsInterface";
import ListUserBookingsInterface from "@application/ports/in/ListUserBookingsInterface";
import BookSeatsCommand from "@application/dto/BookSeatsCommand";

export class RoutesController {
  public router = express.Router();

  constructor(
    private readonly bookSeatsInterface: BookSeatsInterface,
    private readonly cancelBookingInterface: CancelBookingInterface,
    private readonly listScreeningsInterface: ListScreeningsInterface,
    private readonly listUserBookingsInterface: ListUserBookingsInterface,
  ) {
    this.initializeRoutes();
  }

  // Traduction des erreurs du domaine en codes HTTP (mêmes codes que le legacy).
  private handleError = (e: unknown, res: Response) => {
    if (e instanceof ValidationError) return res.status(400).json({ error: e.message });
    if (e instanceof NotFoundError) return res.status(404).json({ error: e.message });
    if (e instanceof BusinessRuleError) return res.status(409).json({ error: e.message });
    if (e instanceof PaymentRefusedError) return res.status(402).json({ error: e.message });
    console.error(e);
    return res.status(500).json({ error: "INTERNAL_ERROR" });
  };

  private initializeRoutes() {
    this.router.get("/screenings", (req, res) => {
      try {
        res.status(200).json(this.listScreeningsInterface.execute());
      } catch (e) {
        this.handleError(e, res);
      }
    });

    this.router.post("/screenings/:id/bookings", (req, res) => {
      try {
        const command = new BookSeatsCommand(
          req.params.id,
          req.body?.email,
          req.body?.seats,
          req.body?.tariff,
        );
        res.status(201).json(this.bookSeatsInterface.execute(command));
      } catch (e) {
        this.handleError(e, res);
      }
    });

    this.router.delete("/bookings/:id", (req, res) => {
      try {
        this.cancelBookingInterface.execute(req.params.id);
        res.status(204).send();
      } catch (e) {
        this.handleError(e, res);
      }
    });

    this.router.get("/bookings", (req, res) => {
      try {
        const user = new User(0, String(req.query.email ?? ""));
        res.json(this.listUserBookingsInterface.execute(user.email));
      } catch (e) {
        this.handleError(e, res);
      }
    });
  }
}
