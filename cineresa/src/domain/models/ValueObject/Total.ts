import ValidationError from "@domain/errors/ValidationError";
import { ErrorStatusEnum } from "@domain/models/Enums/ErrorStatusEnum";
import { TariffRulesEnum } from "@domain/models/Enums/TariffRulesEnum";
import { Seats } from "./Seats";
import { Tariff } from "./Tariff";

// Montant en centimes.
export class Total {
    private constructor(
        public readonly value: number,
    ) {}

    static create(amount: number): Total {
        if (!Number.isInteger(amount) || amount < 0) {
            throw new ValidationError(ErrorStatusEnum.INVALID);
        }
        return new Total(amount);
    }

    static calculate(basePrice: number, seats: Seats, tariff: Tariff): Total {
        let amount = tariff.unitPrice(basePrice) * seats.value;
        if (seats.isGroup()) amount = Math.round(amount * TariffRulesEnum.UPFOR);
        return Total.create(amount);
    }

    toEuros(): string {
        return (this.value / 100).toFixed(2);
    }

    equals(other: Total): boolean {
        return this.value === other.value;
    }
}
