import {
  EntityNotFoundError,
  MissingRequiredPropertyError,
  UnableToCreateEntityError,
  UnableToUpdateEntityError
} from "../errors";
import { BaseEntity, type BaseEntityProps } from "./BaseEntity";

export type CustomerProps = BaseEntityProps & {
  name: string;
  email: string;
};

export class Customer extends BaseEntity {
  constructor(props: CustomerProps) {
    super(props);
    this.name = props.name;
    this.email = props.email;
  }

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this.assertRequired(value, "name");
    this._name = value;
  }

  get email(): string {
    return this._email;
  }

  set email(value: string) {
    this.assertRequired(value, "email");
    this._email = value;
  }

  private assertRequired(value: unknown, property: string): void {
    if (value === undefined || value === null || value === "") {
      throw new MissingRequiredPropertyError("Customer", property);
    }
  }

  public static notFoundError(): EntityNotFoundError {
    return new EntityNotFoundError("Customer not found");
  }

  public static unableToCreateError(): UnableToCreateEntityError {
    return new UnableToCreateEntityError("Customer not created");
  }

  public static unableToUpdateError(): UnableToUpdateEntityError {
    return new UnableToUpdateEntityError("Customer not updated");
  }
}
