import { SaleConstants } from "@/core/domain/entities/Sale";

export type CreateSaleInput = {
  customerUuid: string;
  productUuids: string[];
  status: SaleConstants.Status;
  paymentMethod: SaleConstants.PaymentMethod;
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
