import { test, expect } from "vitest";
import { PriceCalculator, TarifPolicy, TarifRules } from "../models/types/types";
import calculate from "../utils/PriceCalculator";
// Test unitaire
test("Calcule correctement le prix avec tarif étudiant et remise dès 4 places.", () => {
  const basePrice = 1000;
  const seats = 4;

  const result = calculate(
    basePrice,
    seats,
    TarifPolicy.STUDENT,
  );

  const expectedUnit = Math.round(basePrice * TarifRules.STUDENT);
  const expectedTotal = Math.round(expectedUnit * seats * TarifRules.UPFOR);

  expect(result.tariff).toBe(TarifPolicy.STUDENT);
  expect(result.total).toBe(expectedTotal);
});
