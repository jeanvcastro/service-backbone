import {
  EntityNotFoundError,
  MissingRequiredPropertyError,
  UnableToCreateEntityError,
  UnableToUpdateEntityError,
  ValueNegativeError,
  ValueTooHighError,
  ValueTooLowError
} from "../errors";
import { BaseEntity, type BaseEntityProps } from "./BaseEntity";

export type ProductProps = BaseEntityProps & {
  name: string;
  price: number;
};

export class Product extends BaseEntity {
  constructor(props: ProductProps) {
    super(props);
    this.name = props.name;
    this.price = props.price;
  }

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this.assertRequired(value, "name");
    this._name = value;
  }

  get price(): number {
    return this._price;
  }

  set price(value: number) {
    this.assertPositive(value);
    this.assertMin(value, 500);
    this.assertMax(value, 500000);
    this._price = value;
  }

  private assertRequired(value: unknown, property: string): void {
    if (value === undefined || value === null || value === "") {
      throw new MissingRequiredPropertyError("Product", property);
    }
  }

  private assertPositive(value: number): void {
    if (value < 0) {
      throw new ValueNegativeError();
    }
  }

  private assertMin(value: number, min: number): void {
    if (value < min) {
      throw new ValueTooLowError(value, min);
    }
  }

  private assertMax(value: number, max: number): void {
    if (value > max) {
      throw new ValueTooHighError(value, max);
    }
  }

  public static notFoundError(): EntityNotFoundError {
    return new EntityNotFoundError("Product not found");
  }

  public static unableToCreateError(): UnableToCreateEntityError {
    return new UnableToCreateEntityError("Product not created");
  }

  public static unableToUpdateError(): UnableToUpdateEntityError {
    return new UnableToUpdateEntityError("Product not updated");
  }
}
