import ValidationError from "../../errors/ValidationError";
import { ErrorStatusEnum } from "../Enums/ErrorStatusEnum";

export class Seats {
    static readonly MIN = 1;
    static readonly MAX = 6;
    static readonly GROUP_THRESHOLD = 4;

    private constructor(
        public readonly value: number,
    ) {}

    static create(seats: number | string): Seats {
        const value = Number(seats);
        if (!Number.isInteger(value) || value < Seats.MIN || value > Seats.MAX) {
            throw new ValidationError(ErrorStatusEnum.INVALID);
        }
        return new Seats(value);
    }

    isGroup(): boolean {
        return this.value >= Seats.GROUP_THRESHOLD;
    }

    equals(other: Seats): boolean {
        return this.value === other.value;
    }
}
