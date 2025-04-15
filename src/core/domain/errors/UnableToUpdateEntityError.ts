import { BaseError } from "./BaseError";

export class UnableToUpdateEntityError extends BaseError {
  public readonly entity: string;

  constructor(entity: string, message: string) {
    super("UNABLE_TO_UPDATE_ENTITY", message, true, 500);
    this.entity = entity;
  }
}
