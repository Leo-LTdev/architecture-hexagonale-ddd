import { BusinessErrorInterface } from "../interfaces/Interfaces";

export type BusinessErrorKind = "NOT_FOUND" | "INVALID" | "CONFLICT" | "PAYMENT_REFUSED";

class BusinessError extends Error implements BusinessErrorInterface {
  public kind: BusinessErrorKind;

  constructor(message: string, kind: BusinessErrorKind) {
    super(message);
    this.kind = kind;
  }
}

export default BusinessError;
