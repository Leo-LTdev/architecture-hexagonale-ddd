import ValidationError from "@domain/errors/ValidationError";
import { ErrorStatusEnum } from "@domain/models/Enums/ErrorStatusEnum";

export class Movie {
    static readonly MAX_LENGTH = 100;

    private constructor(public readonly value: string) {}

    static create(title: string): Movie {
        const value = title?.trim() ?? "";
        if (!value || value.length > Movie.MAX_LENGTH) {
            throw new ValidationError(ErrorStatusEnum.INVALID);
        }
        return new Movie(value);
    }

    equals(other: Movie): boolean {
        return this.value === other.value;
    }

    toString(): string {
        return this.value;
    }
}
