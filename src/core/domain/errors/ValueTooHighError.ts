import { BaseError } from "./BaseError";

export class ValueTooHighError extends BaseError {
  constructor(provided: number, max: number = 500000) {
    super(
      "VALUE_TOO_HIGH",
      `Value ${provided} cannot be higher than ${max}.`,
      true,
      400,
      `Provided value (${provided}) exceeds allowed limit of ${max}.`
    );
  }
}
