import express from 'express';
import JsonDatabase from "./adapters/data/JsonDatabase";
import ScreeningRepository from "./adapters/data/ScreeningRepository";
import BookingRepository from "./adapters/data/BookingRepository";
import SystemClock from './adapters/clock/SystemClock';
import TimestampIdGenerator from './adapters/id/TimestampIdGenerator';
import ConsoleNotifier from './adapters/notification/ConsoleNotifier';
import FakePaymentGateway from './adapters/payment/FakePaymentGateway';
import { RoutesController } from './adapters/http/routes';
import BookSeatsService from './application/usecases/BookSeatsService';
import CancelBookingService from './application/usecases/CancelBookingService';
import ListScreeningsService from './application/usecases/ListScreeningsService';
import ListUserBookingsService from './application/usecases/ListUserBookingsService';

const app = express();
app.use(express.json());

// Adapters (ports out)
const jsonDatabase = new JsonDatabase();
const screeningRepository = new ScreeningRepository(jsonDatabase);
const bookingRepository = new BookingRepository(jsonDatabase);
const clock = new SystemClock();
const idGenerator = new TimestampIdGenerator();
const notifier = new ConsoleNotifier();
const paymentGateway = new FakePaymentGateway();

// Use cases (ports in)
const bookSeatsService = new BookSeatsService(
  bookingRepository,
  screeningRepository,
  paymentGateway,
  notifier,
  clock,
  idGenerator,
);
const cancelBookingService = new CancelBookingService(bookingRepository, screeningRepository, notifier, clock);
const listScreeningsService = new ListScreeningsService(bookingRepository, screeningRepository, clock);
const listUserBookingsService = new ListUserBookingsService(bookingRepository, screeningRepository);

const routesController = new RoutesController(
  bookSeatsService,
  cancelBookingService,
  listScreeningsService,
  listUserBookingsService,
);

app.use(routesController.router);

const PORT = process.env.PORT || 3000;
if (require.main === module) {
  app.listen(PORT, () => console.log(`CinéResa legacy sur http://localhost:${PORT}`));
}

export default app;
