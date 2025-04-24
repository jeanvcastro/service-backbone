import { Order, OrderConstants, type OrderProps } from "@/domain/entities/Order";
import { faker } from "@faker-js/faker";

export const makeOrder = ({ ...override }: Partial<OrderProps> = {}): Order => {
  const value = faker.number.int({
    min: 500,
    max: 500000
  });

  const instance = new Order({
    id: faker.number.int(),
    uuid: faker.string.uuid(),

    customerId: faker.number.int(),
    status: OrderConstants.Status.APPROVED,
    paymentMethod: OrderConstants.PaymentMethod.CREDIT_CARD,
    value,
    attempts: 1,
    gatewayTransactionId: faker.string.uuid(),
    creditCardBrand: "any_brand",
    installments: 1,
    installmentsValue: value,

    createdAt: faker.date.recent(),
    updatedAt: faker.date.recent(),

    ...override
  });

  return instance;
};
