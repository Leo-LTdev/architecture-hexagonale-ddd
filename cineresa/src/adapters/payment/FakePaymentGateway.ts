import PaymentGateway from "../../application/ports/out/PaymentGatewayInterface";

class FakePaymentGateway implements PaymentGateway {
  // simule un prestataire qui refuse ~5% des paiements
  public charge(email: string, amount: number): boolean {
    return Math.random() > 0.05;
  }
}

export default FakePaymentGateway;
