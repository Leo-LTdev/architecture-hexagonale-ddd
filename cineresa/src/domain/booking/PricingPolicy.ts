import { SeatCount } from "@domain/booking/SeatCount";
import { Tariff } from "@domain/booking/Tariff";
import { Money } from "@domain/shared/Money";

const STUDENT_DISCOUNT = 0.3;
const GROUP_DISCOUNT = 0.1;

// Domain service : calcule le prix total d'une réservation.
export class PricingPolicy {
  static total(unitPrice: Money, seats: SeatCount, tariff: Tariff): Money {
    const unit = tariff === "STUDENT" ? unitPrice.discount(STUDENT_DISCOUNT) : unitPrice;
    const total = unit.times(seats.value);
    return seats.isGroup() ? total.discount(GROUP_DISCOUNT) : total;
  }
}
