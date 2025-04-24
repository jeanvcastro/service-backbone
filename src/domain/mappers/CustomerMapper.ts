import { Customer, CustomerProps } from "../entities/Customer";

export class CustomerMapper {
  static toDomain(raw: CustomerProps): Customer {
    return new Customer(raw);
  }

  static toPersistence(customer: Customer): CustomerProps {
    return {
      uuid: customer.uuid,
      name: customer.name,
      email: customer.email,
      createdAt: customer.createdAt,
      updatedAt: customer.updatedAt
    };
  }
}
