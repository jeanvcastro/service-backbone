import { Sale, SaleConstants, type SaleProps } from "@/core/domain/entities/Sale";
import { faker } from "@faker-js/faker";

export const makeSale = ({ ...override }: Partial<SaleProps> = {}): Sale => {
  const value = faker.number.int({
    min: 500,
    max: 500000
  });

  const instance = new Sale({
    id: faker.number.int(),
    uuid: faker.string.uuid(),

    status: SaleConstants.Status.APPROVED,
    paymentMethod: SaleConstants.PaymentMethod.CREDIT_CARD,
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
