import { BaseError } from "./BaseError";

export class MissingRequiredPropertyError extends BaseError {
  constructor(entity: string, property: string) {
    super(
      "MISSING_REQUIRED_PROPERTY",
      `Property "${property}" is required for entity "${entity}".`,
      true,
      400,
      `Missing value for required property "${property}" on "${entity}".`
    );
  }
}
