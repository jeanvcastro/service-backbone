import { BaseError } from "./BaseError";

export class ValueNegativeError extends BaseError {
  constructor() {
    super({
      code: "VALUE_NEGATIVE",
      message: "Value cannot be negative.",
      isExpected: true,
      httpCode: 400,
      internalReason: "A negative value was provided where only positive values are allowed."
    });
  }
}
