import { OrderConstants } from "@/core/domain/entities/Order";
import { z } from "zod";

export const CreateOrderInputValidator = z.object({
  customerUuid: z.string().uuid(),
  productUuids: z.array(z.string().uuid()).min(1),

  status: z.nativeEnum(OrderConstants.Status),
  paymentMethod: z.nativeEnum(OrderConstants.PaymentMethod),
  value: z.number().min(500).max(500_000),
  gatewayTransactionId: z.string().min(1),

  creditCardBrand: z.string().min(1).nullable().optional(),
  installments: z.number().int().positive().nullable().optional(),
  installmentsValue: z.number().min(1).nullable().optional(),

  digitableLine: z.string().min(1).nullable().optional(),
  barcode: z.string().min(1).nullable().optional(),
  qrcode: z.string().min(1).nullable().optional(),
  expiration: z.date().nullable().optional()
});
