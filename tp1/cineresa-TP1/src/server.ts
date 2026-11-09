import express from 'express';
import Utils from "./data/Utils";
import ScreeningRepository from "./data/ScreeningRepository";
import BookingRepository from "./data/BookingRepository";
import Mailer from "./data/Mailer";
import PaymentGateway from "./data/PaymentGateway";
import ScreeningService from "./business/ScreeningService";
import BookingService from "./business/BookingService";
import { RoutesController } from "./presentation/routes";

const app = express();
app.use(express.json());

const utils = new Utils();

const screeningRepository = new ScreeningRepository(utils);
const bookingRepository = new BookingRepository(utils);
const mailer = new Mailer();
const paymentGateway = new PaymentGateway();

const screeningService = new ScreeningService(utils, bookingRepository, screeningRepository);
const bookingService = new BookingService(utils, bookingRepository, screeningRepository, mailer, paymentGateway);

const routesController = new RoutesController(screeningService, bookingService);

app.use(routesController.router);

const PORT = process.env.PORT || 3000;
if (require.main === module) {
  app.listen(PORT, () => console.log(`CinéResa legacy sur http://localhost:${PORT}`));
}

export default app;
