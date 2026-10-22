interface PaymentGateway {
  // true si le paiement est accepté par le prestataire
  charge(email: string, amount: number): boolean;
}

export default PaymentGateway;
