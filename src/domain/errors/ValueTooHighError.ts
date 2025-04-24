import { BaseError } from "./BaseError";

export class ValueTooHighError extends BaseError {
  constructor(provided: number, max: number = 500000) {
    super({
      code: "VALUE_TOO_HIGH",
      message: `Value ${provided} cannot be higher than ${max}.`,
      isExpected: true,
      httpCode: 400,
      internalReason: `Provided value (${provided}) exceeds the maximum allowed (${max}).`
    });
  }
}
