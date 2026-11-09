import ValidationError from "@domain/errors/ValidationError";
import { ErrorStatusEnum } from "@domain/models/Enums/ErrorStatusEnum";

const MS_PER_HOUR = 60 * 60 * 1000;

// Nommé DateTime (et pas Date) pour ne pas masquer le Date global de JavaScript.
export class DateTime {
    private constructor(
        public readonly value: Date,
    ) {}

    static create(date: string | number | Date): DateTime {
        const value = new Date(date);
        if (Number.isNaN(value.getTime())) {
            throw new ValidationError(ErrorStatusEnum.INVALID);
        }
        return new DateTime(value);
    }

    isBefore(other: DateTime): boolean {
        return this.value.getTime() < other.value.getTime();
    }

    isAfter(other: DateTime): boolean {
        return this.value.getTime() > other.value.getTime();
    }

    // Nombre d'heures entre this et other (négatif si other est avant this).
    hoursUntil(other: DateTime): number {
        return (other.value.getTime() - this.value.getTime()) / MS_PER_HOUR;
    }

    equals(other: DateTime): boolean {
        return this.value.getTime() === other.value.getTime();
    }

    toISOString(): string {
        return this.value.toISOString();
    }
}
