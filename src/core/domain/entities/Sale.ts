import {
  EntityNotFoundError,
  MissingRequiredPropertyError,
  TooManyPaymentAttemptsError,
  UnableToCreateEntityError,
  UnableToUpdateEntityError,
  ValueNegativeError,
  ValueTooHighError,
  ValueTooLowError
} from "../errors";
import { ProductMapper } from "../mappers/ProductMapper";
import { BaseEntity, BaseEntityProps } from "./BaseEntity";
import { Product, ProductProps } from "./Product";

export namespace SaleConstants {
  export enum Status {
    INITIATED = "INITIATED",
    APPROVED = "APPROVED",
    PENDING = "PENDING",
    REFUSED = "REFUSED"
  }

  export enum PaymentMethod {
    CREDIT_CARD = "CREDIT_CARD",
    PIX = "PIX",
    BANK_SLIP = "BANK_SLIP"
  }
}

export type SaleProps = BaseEntityProps & {
  status: SaleConstants.Status;
  paymentMethod: SaleConstants.PaymentMethod;
  value: number;
  attempts: number;
  gatewayTransactionId: string;
  creditCardBrand?: string | null;
  installments?: number | null;
  installmentsValue?: number | null;
  digitableLine?: string | null;
  barcode?: string | null;
  qrcode?: string | null;
  expiration?: Date | null;
  products?: ProductProps[];
};

export class Sale extends BaseEntity {
  constructor(props: SaleProps) {
    super(props);
    this.status = props.status;
    this.paymentMethod = props.paymentMethod;
    this.value = props.value;
    this.attempts = props.attempts;
    this.gatewayTransactionId = props.gatewayTransactionId;
    this.creditCardBrand = props.creditCardBrand ?? null;
    this.installments = props.installments ?? null;
    this.installmentsValue = props.installmentsValue ?? null;
    this.digitableLine = props.digitableLine ?? null;
    this.barcode = props.barcode ?? null;
    this.qrcode = props.qrcode ?? null;
    this.expiration = props.expiration ?? null;
    this.products = props.products?.map(ProductMapper.toDomain) ?? [];
  }

  get status(): SaleConstants.Status {
    return this._status;
  }

  set status(value: SaleConstants.Status) {
    this._status = value;
  }

  get paymentMethod(): SaleConstants.PaymentMethod {
    return this._paymentMethod;
  }

  set paymentMethod(value: SaleConstants.PaymentMethod) {
    this._paymentMethod = value;
  }

  get value(): number {
    return this._value;
  }

  set value(value: number) {
    this.assertPositive(value);
    this.assertMin(value, 500);
    this.assertMax(value, 500000);
    this._value = value;
  }

  get attempts(): number {
    return this._attempts;
  }

  set attempts(value: number) {
    if (value > 5) {
      throw new TooManyPaymentAttemptsError();
    }
    this._attempts = value;
  }

  get gatewayTransactionId(): string {
    return this._gatewayTransactionId;
  }

  set gatewayTransactionId(value: string) {
    this._gatewayTransactionId = value;
  }

  get creditCardBrand(): string | null {
    return this._creditCardBrand;
  }

  set creditCardBrand(value: string | null) {
    if (this._paymentMethod === SaleConstants.PaymentMethod.CREDIT_CARD) {
      this.assertRequired(value, "creditCardBrand");
    }
    this._creditCardBrand = value;
  }

  get installments(): number | null {
    return this._installments;
  }

  set installments(value: number | null) {
    if (this._paymentMethod === SaleConstants.PaymentMethod.CREDIT_CARD) {
      this.assertRequired(value, "installments");
    }
    this._installments = value;
  }

  get installmentsValue(): number | null {
    return this._installmentsValue;
  }

  set installmentsValue(value: number | null) {
    if (this._paymentMethod === SaleConstants.PaymentMethod.CREDIT_CARD) {
      this.assertRequired(value, "installmentsValue");
    }
    this._installmentsValue = value;
  }

  get digitableLine(): string | null {
    return this._digitableLine;
  }

  set digitableLine(value: string | null) {
    if (this._paymentMethod === SaleConstants.PaymentMethod.BANK_SLIP) {
      this.assertRequired(value, "digitableLine");
    }
    this._digitableLine = value;
  }

  get barcode(): string | null {
    return this._barcode;
  }

  set barcode(value: string | null) {
    if (this._paymentMethod === SaleConstants.PaymentMethod.BANK_SLIP) {
      this.assertRequired(value, "barcode");
    }
    this._barcode = value;
  }

  get qrcode(): string | null {
    return this._qrcode;
  }

  set qrcode(value: string | null) {
    if (this._paymentMethod === SaleConstants.PaymentMethod.PIX) {
      this.assertRequired(value, "qrcode");
    }
    this._qrcode = value;
  }

  get expiration(): Date | null {
    return this._expiration;
  }

  set expiration(value: Date | null) {
    const needsExpiration =
      this._paymentMethod !== SaleConstants.PaymentMethod.CREDIT_CARD && this.status !== SaleConstants.Status.REFUSED;

    if (needsExpiration) {
      this.assertRequired(value, "expiration");
    }

    this._expiration = value;
  }

  get products(): Product[] {
    return this._products;
  }

  set products(value: Product[]) {
    this._products = value;
  }

  private assertRequired(value: unknown, property: string): void {
    if (value === undefined || value === null || value === "") {
      throw new MissingRequiredPropertyError("Sale", property);
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
    return new EntityNotFoundError(this.name, "Sale not found");
  }

  public static unableToCreateError(): UnableToCreateEntityError {
    return new UnableToCreateEntityError(this.name, "Sale not created");
  }

  public static unableToUpdateError(): UnableToUpdateEntityError {
    return new UnableToUpdateEntityError(this.name, "Sale not updated");
  }
}
