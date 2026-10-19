class HTTPException extends Error {
  override cause: number;

  constructor(message: string, options: { cause: number }) {
    super(message, options);
    this.cause = options.cause;
  }
}

export default HTTPException