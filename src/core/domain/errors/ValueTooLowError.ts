import { BaseError } from "./BaseError";

export class ValueTooLowError extends BaseError {
  constructor(provided: number, min: number = 500) {
    super(
      "VALUE_TOO_LOW",
      `Value ${provided} cannot be lower than ${min}.`,
      true,
      400,
      `Provided value (${provided}) is below the minimum allowed (${min}).`
    );
  }
}
