import { DomainError } from "@domain/shared/DomainError";

// Montant en centimes : immuable, entier, jamais négatif.
export class Money {
  private constructor(public readonly cents: number) {
    if (!Number.isInteger(cents) || cents < 0) throw new DomainError("INVALID", "Montant invalide");
    Object.freeze(this);
  }

  static cents(amount: number): Money {
    return new Money(amount);
  }

  static euros(amount: number): Money {
    return new Money(Math.round(amount * 100));
  }

  times(factor: number): Money {
    return new Money(Math.round(this.cents * factor));
  }

  discount(rate: number): Money {
    return this.times(1 - rate);
  }

  equals(other: Money): boolean {
    return this.cents === other.cents;
  }

  toString(): string {
    return `${(this.cents / 100).toFixed(2)} €`;
  }
}
