import utilsDB from "../utils/utilitaireDB";
import app from "../server";
import ScreeningService from "../business/ScreeningService";
import BookingService from "../business/BookingService";
import HTTPException from "../utils/HTTPException";

const utils = new utilsDB();
const screeningService = new ScreeningService(utils);
const bookingService = new BookingService(utils);

app.get("/screenings", (req, res) => {
  res.json(screeningService.GetScreenings());
});

app.post("/screenings/:id/bookings", async (req, res) => {
  try {
    res.status(201).json(bookingService.BookByIdUser(req));
  } catch (e) {
    if (e instanceof HTTPException) {
      res.status(e.cause).json({ error: e.message });
    }
  }
});

app.post("/bookings/:id", async (req, res) => {
  try {
    res.json(bookingService.DeleteBooking(req));
  } catch (e) {
    if (e instanceof HTTPException) {
      res.status(e.cause).json({ error: e.message });
    }
  }
});

app.post("/bookings", async (req, res) => {
  res.json(bookingService.BookingsByIdUser(req));
});
