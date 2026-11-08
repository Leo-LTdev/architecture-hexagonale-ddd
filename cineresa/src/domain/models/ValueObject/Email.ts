import ValidationError from "../../errors/ValidationError";
import { ErrorStatusEnum } from "../Enums/ErrorStatusEnum";

const EMAIL_REGEX = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export class Email {
    private constructor(
        public readonly value: string,
    ) {}

    static create(email: string): Email {
        const value = email?.trim().toLowerCase();
        if (!value || !EMAIL_REGEX.test(value)) {
            throw new ValidationError(ErrorStatusEnum.INVALID);
        }
        return new Email(value);
    }

    equals(other: Email): boolean {
        return this.value === other.value;
    }

    toString(): string {
        return this.value;
    }
}
