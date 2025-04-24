import { makeOrder } from "$/factories/makeOrder";
import { makeProduct } from "$/factories/makeProduct";
import { describe, expect, it } from "vitest";
import {
  MissingRequiredPropertyError,
  TooManyPaymentAttemptsError,
  ValueTooHighError,
  ValueTooLowError
} from "../errors";
import { OrderConstants } from "./Order";

describe("Order", () => {
  it("should create a Order instance with valid data", () => {
    const order = makeOrder({
      paymentMethod: OrderConstants.PaymentMethod.PIX,
      qrcode: "any_qrcode",
      expiration: new Date()
    });

    expect(order.status).toBe(OrderConstants.Status.APPROVED);
    expect(order.paymentMethod).toBe(OrderConstants.PaymentMethod.PIX);
    expect(order.value).toBeGreaterThanOrEqual(500);
  });

  it("should throw ValueTooLowError for value below 500", () => {
    expect(() => makeOrder({ value: 499 })).toThrow(ValueTooLowError);
  });

  it("should throw ValueTooHighError for value above 500000", () => {
    expect(() => makeOrder({ value: 500001 })).toThrow(ValueTooHighError);
  });

  it("should throw MissingRequiredPropertyError for missing creditCardBrand when paymentMethod is CREDIT_CARD", () => {
    expect(() => makeOrder({ creditCardBrand: null })).toThrow(MissingRequiredPropertyError);
  });

  it("should throw MissingRequiredPropertyError for missing installments", () => {
    expect(() => makeOrder({ installments: null })).toThrow(MissingRequiredPropertyError);
  });

  it("should throw MissingRequiredPropertyError for missing installmentsValue", () => {
    expect(() => makeOrder({ installmentsValue: null })).toThrow(MissingRequiredPropertyError);
  });

  it("should throw MissingRequiredPropertyError for missing digitableLine when paymentMethod is BANK_SLIP", () => {
    expect(() =>
      makeOrder({
        paymentMethod: OrderConstants.PaymentMethod.BANK_SLIP,
        digitableLine: null,
        barcode: "1234567890",
        expiration: new Date()
      })
    ).toThrow(MissingRequiredPropertyError);
  });

  it("should throw MissingRequiredPropertyError for missing barcode when paymentMethod is BANK_SLIP", () => {
    expect(() =>
      makeOrder({
        paymentMethod: OrderConstants.PaymentMethod.BANK_SLIP,
        digitableLine: "1234567890",
        barcode: null,
        expiration: new Date()
      })
    ).toThrow(MissingRequiredPropertyError);
  });

  it("should throw MissingRequiredPropertyError for missing qrcode when paymentMethod is PIX", () => {
    expect(() =>
      makeOrder({
        paymentMethod: OrderConstants.PaymentMethod.PIX,
        qrcode: null,
        expiration: new Date()
      })
    ).toThrow(MissingRequiredPropertyError);
  });

  it("should throw MissingRequiredPropertyError for missing expiration when not credit card and not refused", () => {
    expect(() =>
      makeOrder({
        paymentMethod: OrderConstants.PaymentMethod.PIX,
        qrcode: "any_qrcode",
        expiration: null
      })
    ).toThrow(MissingRequiredPropertyError);
  });

  it("should throw TooManyPaymentAttemptsError for attempts > 5", () => {
    expect(() => makeOrder({ attempts: 6 })).toThrow(TooManyPaymentAttemptsError);
  });

  it("should map products correctly into Product entities", () => {
    const order = makeOrder({
      paymentMethod: OrderConstants.PaymentMethod.PIX,
      qrcode: "any_qrcode",
      expiration: new Date()
    });

    const product1 = makeProduct({ name: "Product 1", price: 1000 });
    const product2 = makeProduct({ name: "Product 2", price: 2000 });
    order.products = [product1, product2];

    expect(order.products).toHaveLength(2);
    expect(order.products[0].name).toBe("Product 1");
    expect(order.products[1].price).toBe(2000);
  });
});
