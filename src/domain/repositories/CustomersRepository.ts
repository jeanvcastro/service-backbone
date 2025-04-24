import { Customer } from "../entities/Customer";

export interface CustomersRepository {
  findOne(uuid: string): Promise<Customer | null>;
}
