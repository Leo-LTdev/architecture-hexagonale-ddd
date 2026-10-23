import TarifPolicy from "../models/TariffPolicyEnum";
import TarifRules from "../models/TariffRulesEnum";

function calculate(
    basePrice: number,
    seats: number,
    requestedTariff?: TarifPolicy | string,
  ): { tariff: TarifPolicy; total: number } {
    const tariff = Object.values(TarifPolicy).includes(
      requestedTariff as TarifPolicy,
    )
      ? (requestedTariff as TarifPolicy)
      : TarifPolicy.NORMAL;

    let unit = basePrice;

    switch (tariff) {
      case TarifPolicy.CHILD:
        unit = Math.round(unit * TarifRules.CHILD);
        break;
      case TarifPolicy.STUDENT:
        unit = Math.round(unit * TarifRules.STUDENT);
        break;
      case TarifPolicy.SENIOR:
        unit = Math.round(unit * TarifRules.SENIOR);
        break;
      default:
        unit = Math.round(unit * TarifRules.NORMAL);
    }

    let total = unit * seats;
    if (seats >= 4) total = Math.round(total * TarifRules.UPFOR);

    return { tariff, total };
  }

export default calculate;
