import { BaseError } from "./BaseError";

export class UnableToCreateEntityError extends BaseError {
  constructor(message: string, entity?: string) {
    super({
      code: "UNABLE_TO_CREATE_ENTITY",
      message,
      isExpected: true,
      httpCode: 500,
      internalReason: entity ? `Unable to create entity "${entity}".` : "Unable to create entity."
    });
  }
}
