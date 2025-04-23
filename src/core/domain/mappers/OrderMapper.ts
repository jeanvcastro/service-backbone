import { Order, OrderProps } from "../entities/Order";

export class OrderMapper {
  static toDomain(raw: OrderProps): Order {
    return new Order(raw);
  }

  static toPersistence(order: Order): OrderProps {
    return {
      uuid: order.uuid,
      customerId: order.customerId,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      status: order.status,
      paymentMethod: order.paymentMethod,
      value: order.value,
      attempts: order.attempts,
      gatewayTransactionId: order.gatewayTransactionId,
      creditCardBrand: order.creditCardBrand,
      installments: order.installments,
      installmentsValue: order.installmentsValue,
      digitableLine: order.digitableLine,
      barcode: order.barcode,
      qrcode: order.qrcode,
      expiration: order.expiration
    };
  }
}
