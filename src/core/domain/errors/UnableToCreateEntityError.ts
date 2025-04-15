import { BaseError } from "./BaseError";

export class UnableToCreateEntityError extends BaseError {
  public readonly entity: string;

  constructor(entity: string, message: string) {
    super("UNABLE_TO_CREATE_ENTITY", message, true, 500);
    this.entity = entity;
  }
}
