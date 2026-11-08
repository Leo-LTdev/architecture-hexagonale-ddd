import { TariffPolicyEnum } from "../Enums/TariffPolicyEnum";
import { TariffRulesEnum } from "../Enums/TariffRulesEnum";

export class Tariff {
    private constructor(
        public readonly value: TariffPolicyEnum,
    ) {}

    static create(tariff?: TariffPolicyEnum | string): Tariff {
        const isKnown = Object.values(TariffPolicyEnum).includes(tariff as TariffPolicyEnum);
        return new Tariff(isKnown ? (tariff as TariffPolicyEnum) : TariffPolicyEnum.NORMAL);
    }

    get rate(): number {
        return TariffRulesEnum[this.value];
    }

    unitPrice(basePrice: number): number {
        return Math.round(basePrice * this.rate);
    }

    equals(other: Tariff): boolean {
        return this.value === other.value;
    }
}
