import { TarifPolicy, TarifRules } from "../models/types/types";

const GROUP_DISCOUNT_MIN_SEATS = 4;

// Fonction pure de calcul du prix (en centimes).
function calculatePrice(
  basePrice: number,
  seats: number,
  requestedTariff?: TarifPolicy | string,
): { tariff: TarifPolicy; total: number } {
  const tariff = requestedTariff === TarifPolicy.STUDENT ? TarifPolicy.STUDENT : TarifPolicy.NORMAL;
  const unit = tariff === TarifPolicy.STUDENT ? Math.round(basePrice * TarifRules.STUDENT) : basePrice;

  let total = unit * seats;
  if (seats >= GROUP_DISCOUNT_MIN_SEATS) total = Math.round(total * TarifRules.UPFOR);

  return { tariff, total };
}

export default calculatePrice;
