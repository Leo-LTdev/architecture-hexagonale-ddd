import HTTPExceptionInterface from "../../application/ports/out/HTTPExceptionInterface";
class HTTPException extends Error implements HTTPExceptionInterface {
  override cause: number;

  constructor(message: string, options: { cause: number }) {
    super(message, options);
    this.cause = options.cause;
  }
}

export default HTTPException