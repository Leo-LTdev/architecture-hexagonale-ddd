import ValidationError from "../../errors/ValidationError";
import { ErrorStatusEnum } from "../Enums/ErrorStatusEnum";


export class Date {
    private constructor(
        public readonly value: globalThis.Date,
    ) {}

    static create(date: string | globalThis.Date): Date {
        const value = new globalThis.Date(date);
        if (Number.isNaN(value.getTime())) {
            throw new ValidationError(ErrorStatusEnum.INVALID);
        }
        return new Date(value);
    }

    isBefore(other: Date): boolean {
        return this.value.getTime() < other.value.getTime();
    }

    isAfter(other: Date): boolean {
        return this.value.getTime() > other.value.getTime();
    }

    equals(other: Date): boolean {
        return this.value.getTime() === other.value.getTime();
    }

    toISOString(): string {
        return this.value.toISOString();
    }
}
