import { PaymentGateway } from "@application/ports/out/PaymentGateway";
import { Email } from "@domain/shared/Email";
import { Money } from "@domain/shared/Money";

const PAYMENT_FAILURE_RATE = 0.05;

export class FakePaymentGateway implements PaymentGateway {
  // Par défaut, simule un prestataire qui refuse 5 % des paiements.
  constructor(private readonly accepts: () => boolean = () => Math.random() > PAYMENT_FAILURE_RATE) {}

  async charge(_email: Email, _amount: Money): Promise<boolean> {
    return this.accepts();
  }
}
