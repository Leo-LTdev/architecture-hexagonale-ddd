import { Email } from "@domain/shared/Email";
import { Money } from "@domain/shared/Money";

export interface PaymentGateway {
  // true si le paiement est accepté par le prestataire
  charge(email: Email, amount: Money): Promise<boolean>;
}
