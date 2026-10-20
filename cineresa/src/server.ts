import express from 'express';
import Utils from "./adapters/data/JsonDatabase";
import ScreeningRepository from "./adapters/data/ScreeningRepository";
import BookingRepository from "./adapters/data/BookingRepository";
import ScreeningService from "./business/ScreeningService";
import BookingService from "./business/BookingService";
import { RoutesController } from "./domain/presentation/routes";

const app = express();
app.use(express.json());

const utils = new Utils();

const screeningRepository = new ScreeningRepository(utils);
const bookingRepository = new BookingRepository(utils);

const screeningService = new ScreeningService(bookingRepository, screeningRepository);
const bookingService = new BookingService(bookingRepository, screeningRepository);

const routesController = new RoutesController(screeningService, bookingService);

app.use(routesController.router);

const PORT = process.env.PORT || 3000;
if (require.main === module) {
  app.listen(PORT, () => console.log(`CinéResa legacy sur http://localhost:${PORT}`));
}

export default app;
