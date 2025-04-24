import { OrderConstants } from "../entities";
import { BaseDomainEvent } from "./BaseDomainEvent";

export type OrderCreatedEventData = {
  order: {
    uuid: string;
    status: OrderConstants.Status;
    paymentMethod: OrderConstants.PaymentMethod;
    value: number;
  };
  customer: {
    uuid: string;
    name: string;
    email: string;
  };
  products: {
    uuid: string;
    name: string;
    price: number;
  }[];
};

export class OrderCreatedEvent extends BaseDomainEvent<OrderCreatedEventData> {
  static readonly type = "order.created";

  constructor(data: OrderCreatedEventData) {
    super(OrderCreatedEvent.type, data);
  }
}
