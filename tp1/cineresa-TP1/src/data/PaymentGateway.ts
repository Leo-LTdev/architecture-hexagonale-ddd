const PAYMENT_FAILURE_RATE = 0.05;

class PaymentGateway {
  // appel au prestataire (simulé)
  public pay(): boolean {
    return Math.random() > PAYMENT_FAILURE_RATE;
  }
}

export default PaymentGateway;
