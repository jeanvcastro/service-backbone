import { describe, expect, it } from "vitest";
import { MissingRequiredPropertyError, ValueNegativeError, ValueTooHighError, ValueTooLowError } from "../errors";
import { Product } from "./Product";

describe("Product", () => {
  it("should throw MissingRequiredPropertyError for missing name", () => {
    expect(() => new Product({ name: "", price: 1000 })).toThrow(MissingRequiredPropertyError);
  });

  it("should throw ValueNegativeError for negative price", () => {
    expect(() => new Product({ name: "any_name", price: -100 })).toThrow(ValueNegativeError);
  });

  it("should throw ValueTooLowError for price lower than 500", () => {
    expect(() => new Product({ name: "any_name", price: 100 })).toThrow(ValueTooLowError);
  });

  it("should throw ValueTooHighError for price higher than 500000", () => {
    expect(() => new Product({ name: "any_name", price: 500001 })).toThrow(ValueTooHighError);
  });

  it("should create a Product instance with valid data", () => {
    const product = new Product({ name: "any_name", price: 1000 });
    expect(product.name).toBe("any_name");
    expect(product.price).toBe(1000);
  });
});
