import { describe, expect, it } from "vitest";
import { MissingRequiredPropertyError } from "../errors";
import { Customer } from "./Customer";

describe("Customer", () => {
  it("should throw MissingRequiredPropertyError for missing name", () => {
    expect(() => new Customer({ name: "", email: "john@example.com" })).toThrow(MissingRequiredPropertyError);
  });

  it("should throw MissingRequiredPropertyError for missing email", () => {
    expect(() => new Customer({ name: "John Doe", email: "" })).toThrow(MissingRequiredPropertyError);
  });

  it("should create a Customer instance with valid data", () => {
    const customer = new Customer({ name: "John Doe", email: "john@example.com" });
    expect(customer.name).toBe("John Doe");
    expect(customer.email).toBe("john@example.com");
  });
});
