import { ErrorStatusEnum } from "@domain/models/Enums/ErrorStatusEnum";

class DomainError extends Error {
  constructor(message: ErrorStatusEnum) {
    super(message);
    this.name = new.target.name;
  }
}

export default DomainError;
