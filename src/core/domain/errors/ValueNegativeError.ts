import { BaseError } from "./BaseError";

export class ValueNegativeError extends BaseError {
  constructor() {
    super(
      "VALUE_NEGATIVE",
      "Value cannot be negative.",
      true,
      400,
      "A negative value was provided where only positive values are allowed."
    );
  }
}
