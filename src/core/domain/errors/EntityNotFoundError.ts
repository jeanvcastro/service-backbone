import { BaseError } from "./BaseError";

export class EntityNotFoundError extends BaseError {
  public readonly entity: string;

  constructor(entity: string, message: string) {
    super("ENTITY_NOT_FOUND", message, true, 404);
    this.entity = entity;
  }
}
