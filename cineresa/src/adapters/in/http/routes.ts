import { Router, type ErrorRequestHandler, type Request, type RequestHandler, type Response } from "express";
import BookSeatsCommand from "@application/dto/BookSeatsCommand";
import { BookSeats } from "@application/ports/in/BookSeats";
import { CancelBooking } from "@application/ports/in/CancelBooking";
import { ListMyBookings } from "@application/ports/in/ListMyBookings";
import { ListUpcomingScreenings } from "@application/ports/in/ListUpcomingScreenings";
import { DomainError, DomainErrorCode } from "@domain/shared/DomainError";

const HTTP_STATUS: Record<DomainErrorCode, number> = {
  NOT_FOUND: 404,
  INVALID: 400,
  CONFLICT: 409,
  PAYMENT_REFUSED: 402,
};

// Évite de répéter le try/catch dans chaque route.
const route =
  (handler: (req: Request, res: Response) => Promise<unknown>): RequestHandler =>
  (req, res, next) => {
    handler(req, res).catch(next);
  };

export function createRouter(useCases: {
  bookSeats: BookSeats;
  cancelBooking: CancelBooking;
  listUpcomingScreenings: ListUpcomingScreenings;
  listMyBookings: ListMyBookings;
}): Router {
  const router = Router();

  router.get("/screenings", route(async (_req, res) => {
    res.json(await useCases.listUpcomingScreenings.execute());
  }));

  router.post("/screenings/:id/bookings", route(async (req, res) => {
    const command = new BookSeatsCommand(req.params.id, req.body?.email, req.body?.seats, req.body?.tariff);
    res.status(201).json(await useCases.bookSeats.execute(command));
  }));

  router.delete("/bookings/:id", route(async (req, res) => {
    res.json(await useCases.cancelBooking.execute(req.params.id));
  }));

  router.get("/bookings", route(async (req, res) => {
    res.json(await useCases.listMyBookings.execute(req.query.email as string));
  }));

  return router;
}

export const domainErrorHandler: ErrorRequestHandler = (error, _req, res, next) => {
  if (error instanceof DomainError) {
    res.status(HTTP_STATUS[error.code]).json({ error: error.message });
    return;
  }
  next(error);
};
