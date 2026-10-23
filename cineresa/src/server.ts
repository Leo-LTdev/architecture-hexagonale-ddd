import express from 'express';
import JsonDatabase from "./adapters/data/JsonDatabase";
import ScreeningRepository from "./adapters/data/ScreeningRepository";
import BookingRepository from "./adapters/data/BookingRepository";
import SystemClock from './adapters/clock/SystemClock';
import TimestampIdGenerator from './adapters/id/TimestampIdGenerator';
import ConsoleNotifier from './adapters/notification/ConsoleNotifier';
import FakePaymentGateway from './adapters/payment/FakePaymentGateway';
import { RoutesController } from './adapters/http/routes';
import BookSeatsUseCase from './application/usecases/BookSeatsUseCase';
import { ListUserBookingsUseCase } from './application/usecases/ListUserBookingsUseCase';
import CancelBookingUseCase from './application/usecases/CancelBookingUseCase';
import ListScreeningsUseCase from './application/usecases/ListScreeningsUseCase';

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
const bookSeatsUsecase = new BookSeatsUseCase(
  bookingRepository,
  screeningRepository,
  paymentGateway,
  notifier,
  clock,
  idGenerator,
);
const cancelBookingService = new CancelBookingUseCase(bookingRepository, screeningRepository, notifier, clock);
const listScreeningsService = new ListScreeningsUseCase(bookingRepository, screeningRepository, clock);
const listUserBookingsService = new ListUserBookingsUseCase(bookingRepository, screeningRepository);

const routesController = new RoutesController(
  bookSeatsUsecase,
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
