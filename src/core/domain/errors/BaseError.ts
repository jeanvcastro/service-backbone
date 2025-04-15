export class BaseError extends Error {
  public readonly code: string;
  public readonly message: string;
  public readonly isExpected: boolean;
  public readonly httpCode: number;
  public readonly internalReason?: string;

  constructor(code: string, message: string, isExpected: boolean, httpCode: number = 400, internalReason?: string) {
    super(message);
    this.code = code;
    this.message = message;
    this.isExpected = isExpected;
    this.httpCode = httpCode;
    this.internalReason = internalReason;
  }
}
