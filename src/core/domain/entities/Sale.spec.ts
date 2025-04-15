import { describe, expect, it } from "vitest";
import {
  MissingRequiredPropertyError,
  TooManyPaymentAttemptsError,
  ValueTooHighError,
  ValueTooLowError
} from "../errors";
import { Sale, SaleConstants } from "./Sale";

describe("Sale", () => {
  it("should create a Sale instance with valid data", () => {
    const sale = new Sale({
      status: SaleConstants.Status.APPROVED,
      paymentMethod: SaleConstants.PaymentMethod.PIX,
      attempts: 1,
      gatewayTransactionId: "any_transaction_id",
      qrcode: "any_qrcode",
      expiration: new Date(),
      value: 5000
    });

    expect(sale.status).toBe(SaleConstants.Status.APPROVED);
    expect(sale.paymentMethod).toBe(SaleConstants.PaymentMethod.PIX);
    expect(sale.value).toBe(5000);
  });

  it("should throw ValueTooLowError for value below 500", () => {
    expect(() => {
      new Sale({
        status: SaleConstants.Status.PENDING,
        paymentMethod: SaleConstants.PaymentMethod.BANK_SLIP,
        attempts: 1,
        gatewayTransactionId: "any_transaction_id",
        expiration: new Date(),
        value: 499
      });
    }).toThrow(ValueTooLowError);
  });

  it("should throw ValueTooHighError for value above 500000", () => {
    expect(() => {
      new Sale({
        status: SaleConstants.Status.REFUSED,
        paymentMethod: SaleConstants.PaymentMethod.CREDIT_CARD,
        attempts: 1,
        gatewayTransactionId: "any_transaction_id",
        value: 500001
      });
    }).toThrow(ValueTooHighError);
  });

  it("should throw MissingRequiredPropertyError for missing creditCardBrand when paymentMethod is CREDIT_CARD", () => {
    expect(() => {
      new Sale({
        status: SaleConstants.Status.APPROVED,
        paymentMethod: SaleConstants.PaymentMethod.CREDIT_CARD,
        attempts: 1,
        gatewayTransactionId: "any_transaction_id",
        value: 5000,
        installments: 1,
        installmentsValue: 5000
      });
    }).toThrow(MissingRequiredPropertyError);
  });

  it("should throw MissingRequiredPropertyError for missing installments when paymentMethod is CREDIT_CARD", () => {
    expect(() => {
      new Sale({
        status: SaleConstants.Status.APPROVED,
        paymentMethod: SaleConstants.PaymentMethod.CREDIT_CARD,
        attempts: 1,
        gatewayTransactionId: "any_transaction_id",
        value: 5000,
        creditCardBrand: "VISA",
        installmentsValue: 5000
      });
    }).toThrow(MissingRequiredPropertyError);
  });

  it("should throw MissingRequiredPropertyError for missing installmentsValue when paymentMethod is CREDIT_CARD", () => {
    expect(() => {
      new Sale({
        status: SaleConstants.Status.APPROVED,
        paymentMethod: SaleConstants.PaymentMethod.CREDIT_CARD,
        attempts: 1,
        gatewayTransactionId: "any_transaction_id",
        value: 5000,
        creditCardBrand: "VISA",
        installments: 1
      });
    }).toThrow(MissingRequiredPropertyError);
  });

  it("should throw MissingRequiredPropertyError for missing digitableLine when paymentMethod is BANK_SLIP", () => {
    expect(() => {
      new Sale({
        status: SaleConstants.Status.APPROVED,
        paymentMethod: SaleConstants.PaymentMethod.BANK_SLIP,
        attempts: 1,
        gatewayTransactionId: "any_transaction_id",
        value: 5000,
        expiration: new Date(),
        barcode: "1234567890"
      });
    }).toThrow(MissingRequiredPropertyError);
  });

  it("should throw MissingRequiredPropertyError for missing barcode when paymentMethod is BANK_SLIP", () => {
    expect(() => {
      new Sale({
        status: SaleConstants.Status.APPROVED,
        paymentMethod: SaleConstants.PaymentMethod.BANK_SLIP,
        attempts: 1,
        gatewayTransactionId: "any_transaction_id",
        value: 5000,
        expiration: new Date(),
        digitableLine: "1234567890"
      });
    }).toThrow(MissingRequiredPropertyError);
  });

  it("should throw MissingRequiredPropertyError for missing qrcode when paymentMethod is PIX", () => {
    expect(() => {
      new Sale({
        status: SaleConstants.Status.APPROVED,
        paymentMethod: SaleConstants.PaymentMethod.PIX,
        attempts: 1,
        gatewayTransactionId: "any_transaction_id",
        value: 5000,
        expiration: new Date()
      });
    }).toThrow(MissingRequiredPropertyError);
  });

  it("should throw MissingRequiredPropertyError for missing expiration when paymentMethod is non-credit card", () => {
    expect(() => {
      new Sale({
        status: SaleConstants.Status.PENDING,
        paymentMethod: SaleConstants.PaymentMethod.PIX,
        attempts: 1,
        gatewayTransactionId: "any_transaction_id",
        value: 1000,
        qrcode: "qrcode"
      });
    }).toThrow(MissingRequiredPropertyError);
  });

  it("should throw TooManyPaymentAttemptsError for a number of attempts greater than 5", () => {
    expect(() => {
      new Sale({
        status: SaleConstants.Status.PENDING,
        paymentMethod: SaleConstants.PaymentMethod.CREDIT_CARD,
        attempts: 6,
        gatewayTransactionId: "any_transaction_id",
        value: 1000,
        creditCardBrand: "VISA",
        installments: 1,
        installmentsValue: 1000
      });
    }).toThrow(TooManyPaymentAttemptsError);
  });
});
