import { BaseError } from "./BaseError";

export class EntityNotFoundError extends BaseError {
  constructor(message: string, entity?: string) {
    super({
      code: "ENTITY_NOT_FOUND",
      message,
      isExpected: true,
      httpCode: 404,
      internalReason: entity ? `Entity "${entity}" not found.` : "Entity not found."
    });
  }
}
