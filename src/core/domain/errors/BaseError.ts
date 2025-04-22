// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Context = Record<string, any>;

type BaseErrorProps = {
  code: string;
  message: string;
  isExpected: boolean;
  httpCode?: number;
  internalReason?: string;
  context?: Context;
};

export class BaseError extends Error {
  public code: string;
  public message: string;
  public isExpected: boolean;
  public httpCode: number;
  public internalReason?: string;
  public context?: Context;

  constructor({ code, message, isExpected, httpCode = 400, internalReason, context }: BaseErrorProps) {
    super(message);
    this.code = code;
    this.message = message;
    this.isExpected = isExpected;
    this.httpCode = httpCode;
    this.internalReason = internalReason;
    this.context = context;
  }
}
