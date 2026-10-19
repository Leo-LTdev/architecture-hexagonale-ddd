import { test, expect } from "vitest";
import { TarifPolicy, TarifRules } from "../../models/types/types";
import Utils from "../../utils/Utils";
import BookingRepository from "../../data/BookingRepository";
import {
  BookingServiceInterface,
  UtilsInterface,
  BookingRepositoryInterface,
  ScreeningRepositoryInterface,
} from "../../interfaces/Interfaces";
import ScreeningRepository from "../../data/ScreeningRepository";
import BookingService from "../BookingService";

// Test unitaire
test("Calcule correctement le prix avec tarif étudiant et remise dès 4 places.", () => {
  const utils: UtilsInterface = new Utils();
  const bookingRepository: BookingRepositoryInterface = new BookingRepository(utils);
  const screeningRepository: ScreeningRepositoryInterface = new ScreeningRepository(utils);

  const bookingService: BookingServiceInterface = new BookingService(
    utils,
    bookingRepository,
    screeningRepository,
  );

  const basePrice = 1000;
  const seats = 4;

  const result = bookingService.calculatePrice(
    basePrice,
    seats,
    TarifPolicy.STUDENT,
  );

  const expectedUnit = Math.round(basePrice * TarifRules.STUDENT);
  const expectedTotal = Math.round(expectedUnit * seats * TarifRules.UPFOR);

  expect(result.tariff).toBe(TarifPolicy.STUDENT);
  expect(result.total).toBe(expectedTotal);
});