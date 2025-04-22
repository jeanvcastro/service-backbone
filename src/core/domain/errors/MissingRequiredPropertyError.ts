import { BaseError } from "./BaseError";

export class MissingRequiredPropertyError extends BaseError {
  constructor(property: string, entity?: string) {
    const message = entity
      ? `Missing required property "${property}" for entity "${entity}".`
      : `Missing required property "${property}".`;

    const internalReason = entity
      ? `Missing value for required property "${property}" on "${entity}".`
      : `Missing value for required property "${property}".`;

    super({
      code: "MISSING_REQUIRED_PROPERTY",
      message,
      isExpected: true,
      httpCode: 400,
      internalReason
    });
  }
}
