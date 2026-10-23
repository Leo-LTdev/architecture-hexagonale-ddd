import { ErrorStatus } from "../models/ErrorStatusEnum";

class DomainError extends Error{
  constructor(message: ErrorStatus) {
    super(message);
    this.name = new.target.name;
  }
}

export default DomainError;
