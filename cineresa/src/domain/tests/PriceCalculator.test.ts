import { describe, test, expect } from "vitest";
import { TarifPolicy, TarifRules } from "../models/types/types";
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

describe("PriceCalculator - tarifs pour une place", () => {
  const basePrice = 1000;

  test.each([
    [TarifPolicy.NORMAL, 1000],
    [TarifPolicy.STUDENT, 700],
    [TarifPolicy.SENIOR, 900],
    [TarifPolicy.CHILD, 1000],
  ])("tarif %s → %i centimes", (tariff, expected) => {
    const result = calculate(basePrice, 1, tariff);

    expect(result.tariff).toBe(tariff);
    expect(result.total).toBe(expected);
  });
});

describe("PriceCalculator - tarif par défaut", () => {
  test("applique le tarif NORMAL quand aucun tarif n'est fourni", () => {
    const result = calculate(1000, 2);

    expect(result.tariff).toBe(TarifPolicy.NORMAL);
    expect(result.total).toBe(2000);
  });

  test.each(["VIP", "student", ""])(
    "applique le tarif NORMAL pour un tarif inconnu (%j)",
    (tariff) => {
      const result = calculate(1000, 1, tariff);

      expect(result.tariff).toBe(TarifPolicy.NORMAL);
      expect(result.total).toBe(1000);
    },
  );
});

describe("PriceCalculator - remise de groupe", () => {
  test("pas de remise en dessous de 4 places", () => {
    expect(calculate(1000, 3, TarifPolicy.NORMAL).total).toBe(3000);
  });

  test("remise de 10 % à partir de 4 places exactement", () => {
    expect(calculate(1000, 4, TarifPolicy.NORMAL).total).toBe(3600);
  });

  test("remise de 10 % au-delà de 4 places", () => {
    expect(calculate(1000, 10, TarifPolicy.NORMAL).total).toBe(9000);
  });

  test("cumule la remise de groupe avec le tarif senior", () => {
    // 900 * 5 = 4500, puis * 0.9 = 4050
    expect(calculate(1000, 5, TarifPolicy.SENIOR).total).toBe(4050);
  });
});

describe("PriceCalculator - arrondis", () => {
  test("arrondit le prix unitaire au centime", () => {
    // 999 * 0.7 = 699.3 → 699
    expect(calculate(999, 1, TarifPolicy.STUDENT).total).toBe(699);
  });

  test("arrondit le total après la remise de groupe", () => {
    // 699 * 4 = 2796, puis * 0.9 = 2516.4 → 2516
    expect(calculate(999, 4, TarifPolicy.STUDENT).total).toBe(2516);
  });

  test("retourne toujours un nombre entier de centimes", () => {
    for (const tariff of Object.values(TarifPolicy)) {
      for (let seats = 1; seats <= 8; seats++) {
        expect(Number.isInteger(calculate(1235, seats, tariff).total)).toBe(true);
      }
    }
  });
});

describe("PriceCalculator - cas limites", () => {
  test("0 place → total à 0", () => {
    expect(calculate(1000, 0, TarifPolicy.NORMAL).total).toBe(0);
  });

  test("prix de base à 0 → total à 0", () => {
    expect(calculate(0, 5, TarifPolicy.STUDENT).total).toBe(0);
  });

  test("le total croît avec le nombre de places", () => {
    const totals = [1, 2, 3, 4, 5, 6].map(
      (seats) => calculate(1000, seats, TarifPolicy.NORMAL).total,
    );
    const sorted = [...totals].sort((a, b) => a - b);

    expect(totals).toEqual(sorted);
  });
});
