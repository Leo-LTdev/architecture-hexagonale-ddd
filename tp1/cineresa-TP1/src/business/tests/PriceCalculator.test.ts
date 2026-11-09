import { describe, test, expect } from "vitest";
import { TarifPolicy } from "../../models/types/types";
import calculatePrice from "../PriceCalculator";

// Test unitaire
describe("calculatePrice", () => {
  test("Tarif normal : prix de base multiplié par le nombre de places.", () => {
    expect(calculatePrice(1150, 2, TarifPolicy.NORMAL)).toEqual({ tariff: TarifPolicy.NORMAL, total: 2300 });
  });

  test("Tarif étudiant : -30 % sur le prix unitaire.", () => {
    expect(calculatePrice(1000, 1, TarifPolicy.STUDENT)).toEqual({ tariff: TarifPolicy.STUDENT, total: 700 });
  });

  test("Tarif étudiant : le prix unitaire est arrondi avant la multiplication.", () => {
    expect(calculatePrice(999, 2, TarifPolicy.STUDENT).total).toBe(1398);
  });

  test("Pas de remise groupe à 3 places.", () => {
    expect(calculatePrice(1000, 3, TarifPolicy.NORMAL).total).toBe(3000);
  });

  test("Remise groupe de 10 % dès 4 places.", () => {
    expect(calculatePrice(1000, 4, TarifPolicy.NORMAL).total).toBe(3600);
  });

  test("Calcule correctement le prix avec tarif étudiant et remise dès 4 places.", () => {
    expect(calculatePrice(1000, 4, TarifPolicy.STUDENT)).toEqual({ tariff: TarifPolicy.STUDENT, total: 2520 });
  });

  test("Le total remisé est arrondi au centime.", () => {
    expect(calculatePrice(1150, 5, TarifPolicy.STUDENT).total).toBe(3623);
  });

  test.each([undefined, "SENIOR", "CHILD", "inconnu"])("Tarif %s : traité comme NORMAL.", (tariff) => {
    expect(calculatePrice(1000, 2, tariff)).toEqual({ tariff: TarifPolicy.NORMAL, total: 2000 });
  });
});
