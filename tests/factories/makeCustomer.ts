import { Customer, type CustomerProps } from "@/domain/entities/Customer";
import { faker } from "@faker-js/faker";

export const makeCustomer = ({ ...override }: Partial<CustomerProps> = {}): Customer => {
  const instance = new Customer({
    id: faker.number.int(),
    uuid: faker.string.uuid(),

    name: faker.commerce.productName(),
    email: faker.internet.email(),

    createdAt: faker.date.recent(),
    updatedAt: faker.date.recent(),

    ...override
  });

  return instance;
};
