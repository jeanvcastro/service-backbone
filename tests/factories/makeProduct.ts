import { Product, type ProductProps } from "@/domain/entities/Product";
import { faker } from "@faker-js/faker";

export const makeProduct = ({ ...override }: Partial<ProductProps> = {}): Product => {
  const instance = new Product({
    id: faker.number.int(),
    uuid: faker.string.uuid(),

    name: faker.commerce.productName(),
    price: faker.number.int({
      min: 500,
      max: 500000
    }),

    createdAt: faker.date.recent(),
    updatedAt: faker.date.recent(),

    ...override
  });

  return instance;
};
