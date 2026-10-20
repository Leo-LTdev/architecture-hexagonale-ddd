import { test, expect } from "vitest";
import { TarifPolicy, TarifRules } from "../../domain/models/types/types";
import JsonDatabase from "../../adapters/data/JsonDatabase";
import BookingRepository from "../../adapters/data/BookingRepository";
import {
  BookingServiceInterface,
  JsonDatabaseInterface,
  BookingRepositoryInterface,
  ScreeningRepositoryInterface,
} from "../../interfaces/Interfaces";
import ScreeningRepository from "../../adapters/data/ScreeningRepository";
import BookingService from "../BookingService";

// Test unitaire
test("Calcule correctement le prix avec tarif étudiant et remise dès 4 places.", () => {
  const jsonDatabase: JsonDatabaseInterface = new JsonDatabase();
  const bookingRepository: BookingRepositoryInterface = new BookingRepository(jsonDatabase);
  const screeningRepository: ScreeningRepositoryInterface = new ScreeningRepository(jsonDatabase);

  const bookingService: BookingServiceInterface = new BookingService(
    jsonDatabase,
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