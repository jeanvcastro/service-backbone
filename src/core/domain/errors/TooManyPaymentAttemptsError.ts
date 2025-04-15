import { BaseError } from "./BaseError";

export class TooManyPaymentAttemptsError extends BaseError {
  constructor() {
    super(
      "TOO_MANY_PAYMENT_ATTEMPTS",
      "Number of payment attempts exceeded the allowed limit.",
      true,
      429,
      "User tried to pay more times than the system allows."
    );
  }
}
