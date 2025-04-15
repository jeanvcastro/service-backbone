import { makeProduct } from "tests/factories/makeProduct";
import { makeSale } from "tests/factories/makeSale";
import { describe, expect, it } from "vitest";
import {
  MissingRequiredPropertyError,
  TooManyPaymentAttemptsError,
  ValueTooHighError,
  ValueTooLowError
} from "../errors";
import { SaleConstants } from "./Sale";

describe("Sale", () => {
  it("should create a Sale instance with valid data", () => {
    const sale = makeSale({
      paymentMethod: SaleConstants.PaymentMethod.PIX,
      qrcode: "any_qrcode",
      expiration: new Date()
    });

    expect(sale.status).toBe(SaleConstants.Status.APPROVED);
    expect(sale.paymentMethod).toBe(SaleConstants.PaymentMethod.PIX);
    expect(sale.value).toBeGreaterThanOrEqual(500);
  });

  it("should throw ValueTooLowError for value below 500", () => {
    expect(() => makeSale({ value: 499 })).toThrow(ValueTooLowError);
  });

  it("should throw ValueTooHighError for value above 500000", () => {
    expect(() => makeSale({ value: 500001 })).toThrow(ValueTooHighError);
  });

  it("should throw MissingRequiredPropertyError for missing creditCardBrand when paymentMethod is CREDIT_CARD", () => {
    expect(() => makeSale({ creditCardBrand: null })).toThrow(MissingRequiredPropertyError);
  });

  it("should throw MissingRequiredPropertyError for missing installments", () => {
    expect(() => makeSale({ installments: null })).toThrow(MissingRequiredPropertyError);
  });

  it("should throw MissingRequiredPropertyError for missing installmentsValue", () => {
    expect(() => makeSale({ installmentsValue: null })).toThrow(MissingRequiredPropertyError);
  });

  it("should throw MissingRequiredPropertyError for missing digitableLine when paymentMethod is BANK_SLIP", () => {
    expect(() =>
      makeSale({
        paymentMethod: SaleConstants.PaymentMethod.BANK_SLIP,
        digitableLine: null,
        barcode: "1234567890",
        expiration: new Date()
      })
    ).toThrow(MissingRequiredPropertyError);
  });

  it("should throw MissingRequiredPropertyError for missing barcode when paymentMethod is BANK_SLIP", () => {
    expect(() =>
      makeSale({
        paymentMethod: SaleConstants.PaymentMethod.BANK_SLIP,
        digitableLine: "1234567890",
        barcode: null,
        expiration: new Date()
      })
    ).toThrow(MissingRequiredPropertyError);
  });

  it("should throw MissingRequiredPropertyError for missing qrcode when paymentMethod is PIX", () => {
    expect(() =>
      makeSale({
        paymentMethod: SaleConstants.PaymentMethod.PIX,
        qrcode: null,
        expiration: new Date()
      })
    ).toThrow(MissingRequiredPropertyError);
  });

  it("should throw MissingRequiredPropertyError for missing expiration when not credit card and not refused", () => {
    expect(() =>
      makeSale({
        paymentMethod: SaleConstants.PaymentMethod.PIX,
        qrcode: "any_qrcode",
        expiration: null
      })
    ).toThrow(MissingRequiredPropertyError);
  });

  it("should throw TooManyPaymentAttemptsError for attempts > 5", () => {
    expect(() => makeSale({ attempts: 6 })).toThrow(TooManyPaymentAttemptsError);
  });

  it("should map products correctly into Product entities", () => {
    const sale = makeSale({
      paymentMethod: SaleConstants.PaymentMethod.PIX,
      qrcode: "any_qrcode",
      expiration: new Date()
    });

    const product1 = makeProduct({ name: "Product 1", price: 1000 });
    const product2 = makeProduct({ name: "Product 2", price: 2000 });
    sale.products = [product1, product2];

    expect(sale.products).toHaveLength(2);
    expect(sale.products[0].name).toBe("Product 1");
    expect(sale.products[1].price).toBe(2000);
  });
});
