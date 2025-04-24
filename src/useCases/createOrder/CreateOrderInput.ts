import { OrderConstants } from "@/domain/entities/Order";

export type CreateOrderInput = {
  customerUuid: string;
  productUuids: string[];
  status: OrderConstants.Status;
  paymentMethod: OrderConstants.PaymentMethod;
  value: number;
  gatewayTransactionId: string;
  creditCardBrand?: string | null;
  installments?: number | null;
  installmentsValue?: number | null;
  digitableLine?: string | null;
  barcode?: string | null;
  qrcode?: string | null;
  expiration?: Date | null;
};
