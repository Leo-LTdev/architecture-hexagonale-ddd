import ValidationError from "@domain/errors/ValidationError";
import { ErrorStatusEnum } from "@domain/models/Enums/ErrorStatusEnum";

// Prix de base d'une place, en centimes.
export class Price {
    private constructor(public readonly value: number) {}

    static create(amount: number): Price {
        if (!Number.isInteger(amount) || amount < 0) {
            throw new ValidationError(ErrorStatusEnum.INVALID);
        }
        return new Price(amount);
    }

    equals(other: Price): boolean {
        return this.value === other.value;
    }
}
