import ValidationError from "@domain/errors/ValidationError";
import { ErrorStatusEnum } from "@domain/models/Enums/ErrorStatusEnum";

// Nom de la salle, ex. "Salle 1"
export class Room {
    static readonly MAX_LENGTH = 50;

    private constructor(public readonly value: string) {}

    static create(name: string): Room {
        const value = name?.trim() ?? "";
        if (!value || value.length > Room.MAX_LENGTH) {
            throw new ValidationError(ErrorStatusEnum.INVALID);
        }
        return new Room(value);
    }

    equals(other: Room): boolean {
        return this.value === other.value;
    }

    toString(): string {
        return this.value;
    }
}
