import express, { type Request, type Response, type NextFunction } from 'express';
import Utils from "../utils/Utils";
import ScreeningService from "../business/ScreeningService";
import BookingService from "../business/BookingService";
import HTTPException from "../utils/HTTPException";
import { Booking, Screening, User } from "../models/types/types";
import BookingDto from "../models/objects/BookingDto";

const utils = new Utils();
const screeningService = new ScreeningService(utils);
const bookingService = new BookingService(utils);

const router = express.Router();

const handleError = (e: unknown, res: Response) => {
  if (e instanceof HTTPException) {
    res.status(e.cause).json({ error: e.message });
  } else {
    res.status(500).json({ error: "Erreur interne" });
  }
};

router.get("/screenings", (req, res) => {
  const result = screeningService.GetScreenings();
  res.status(200).json(result);
});

router.post("/screenings/:id/bookings", async (req, res) => {
  try {
    const screening = Screening.fromJSON(JSON.stringify({ id: req.params.id }));
    const data = new BookingDto(req.body?.email, req.body?.seats, req.body?.tariff);
    const result = bookingService.BookByIdUser(screening, data);
    res.status(201).json(result);
  } catch (e) {
    handleError(e, res);
  }
});

router.delete("/bookings/:id", async (req, res) => {
  try {
    const booking = Booking.fromJSON(JSON.stringify({ id: req.params.id }));
    bookingService.DeleteBooking(booking);
    res.status(204).send();
  } catch (e) {
    handleError(e, res);
  }
});

router.get("/bookings", async (req, res) => {
  const user = new User(0, String(req.query.email ?? ""));
  res.json(bookingService.BookingsByIdUser(user));
});

export default router;
