import { BaseError } from "./BaseError";

export class InvalidUUIDError extends BaseError {
  constructor(value: string) {
    super(
      "INVALID_UUID",
      `Invalid UUID: ${value}`,
      true,
      400,
      "The provided UUID does not match the expected format (RFC 4122 v4)."
    );
  }
}
