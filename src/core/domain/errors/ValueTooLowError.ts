import { BaseError } from "./BaseError";

export class ValueTooLowError extends BaseError {
  constructor(provided: number, min: number = 500) {
    super({
      code: "VALUE_TOO_LOW",
      message: `Value ${provided} cannot be lower than ${min}.`,
      isExpected: true,
      httpCode: 400,
      internalReason: `Provided value (${provided}) is below the minimum allowed (${min}).`
    });
  }
}
