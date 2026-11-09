import ValidationError from "@domain/errors/ValidationError";
import { ErrorStatusEnum } from "@domain/models/Enums/ErrorStatusEnum";

// Nombre total de places d'une séance (différent de Seats = places d'une réservation).
export class Capacity {
    private constructor(public readonly value: number) {}

    static create(capacity: number): Capacity {
        if (!Number.isInteger(capacity) || capacity <= 0) {
            throw new ValidationError(ErrorStatusEnum.INVALID);
        }
        return new Capacity(capacity);
    }

    equals(other: Capacity): boolean {
        return this.value === other.value;
    }
}
