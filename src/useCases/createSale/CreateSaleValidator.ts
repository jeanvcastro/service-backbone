import { SaleConstants } from "@/core/domain/entities/Sale";
import { z } from "zod";

export const createSaleSchema = z.object({
  status: z.nativeEnum(SaleConstants.Status),
  paymentMethod: z.nativeEnum(SaleConstants.PaymentMethod),
  value: z.number().min(500).max(500_000),
  gatewayTransactionId: z.string().min(1),

  creditCardBrand: z.string().min(1).nullable().optional(),
  installments: z.number().int().positive().nullable().optional(),
  installmentsValue: z.number().min(1).nullable().optional(),

  digitableLine: z.string().min(1).nullable().optional(),
  barcode: z.string().min(1).nullable().optional(),
  qrcode: z.string().min(1).nullable().optional(),
  expiration: z.date().nullable().optional(),

  products: z.array(z.string().uuid()).min(1)
});
