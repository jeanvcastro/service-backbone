import { BaseError } from "./BaseError";

export class TooManyPaymentAttemptsError extends BaseError {
  constructor() {
    super({
      code: "TOO_MANY_PAYMENT_ATTEMPTS",
      message: "Number of payment attempts exceeded the allowed limit.",
      isExpected: true,
      httpCode: 429,
      internalReason: "User tried to pay more times than the system allows."
    });
  }
}
