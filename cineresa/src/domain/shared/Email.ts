import { DomainError } from "@domain/shared/DomainError";

const EMAIL_REGEX = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export class Email {
  public readonly value: string;

  constructor(raw: string) {
    const value = typeof raw === "string" ? raw.trim().toLowerCase() : "";
    if (!EMAIL_REGEX.test(value)) throw new DomainError("INVALID", "Email invalide");
    this.value = value;
    Object.freeze(this);
  }

  equals(other: Email): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
