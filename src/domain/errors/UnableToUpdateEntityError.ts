import { BaseError } from "./BaseError";

export class UnableToUpdateEntityError extends BaseError {
  constructor(message: string, entity?: string) {
    super({
      code: "UNABLE_TO_UPDATE_ENTITY",
      message,
      isExpected: true,
      httpCode: 500,
      internalReason: entity ? `Unable to update entity "${entity}".` : "Unable to update entity."
    });
  }
}
