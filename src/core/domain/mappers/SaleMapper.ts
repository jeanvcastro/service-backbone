import { Sale, SaleProps } from "../entities/Sale";

export class SaleMapper {
  static toDomain(raw: SaleProps): Sale {
    return new Sale(raw);
  }

  static toPersistence(sale: Sale): SaleProps {
    return {
      uuid: sale.uuid.toString(),
      createdAt: sale.createdAt,
      updatedAt: sale.updatedAt,
      status: sale.status,
      paymentMethod: sale.paymentMethod,
      value: sale.value,
      attempts: sale.attempts,
      gatewayTransactionId: sale.gatewayTransactionId,
      creditCardBrand: sale.creditCardBrand,
      installments: sale.installments,
      installmentsValue: sale.installmentsValue,
      digitableLine: sale.digitableLine,
      barcode: sale.barcode,
      qrcode: sale.qrcode,
      expiration: sale.expiration
    };
  }
}
