import { TariffPolicyEnum } from "@domain/models/Enums/TariffPolicyEnum";
import { TariffRulesEnum } from "@domain/models/Enums/TariffRulesEnum";
import { Seats } from "@domain/models/ValueObject/Seats";
import { Tariff } from "@domain/models/ValueObject/Tariff";

// Fonction pure de calcul du prix (centimes). Le nombre de places n'est pas
// validé ici : c'est le rôle du VO Seats lors d'une réservation.
function calculate(
  basePrice: number,
  seats: number,
  requestedTariff?: TariffPolicyEnum | string,
): { tariff: TariffPolicyEnum; total: number } {
  const tariff = Tariff.create(requestedTariff);

  let total = tariff.unitPrice(basePrice) * seats;
  if (seats >= Seats.GROUP_THRESHOLD) total = Math.round(total * TariffRulesEnum.UPFOR);

  return { tariff: tariff.value, total };
}

export default calculate;
