import { BaseError } from "./BaseError";

export class InvalidUUIDError extends BaseError {
  constructor(value: string) {
    super({
      code: "INVALID_UUID",
      message: `Invalid UUID: ${value}`,
      isExpected: true,
      httpCode: 400,
      internalReason: "The provided UUID does not match the expected format (RFC 4122 v4)."
    });
  }
}
