import { Customer } from "@/core/domain/entities/Customer";
import { CustomerMapper } from "@/core/domain/mappers/CustomerMapper";
import { CustomersRepository } from "@/core/domain/repositories/CustomersRepository";
import { Knex } from "knex";

export default class KnexCustomersRepository implements CustomersRepository {
  constructor(private readonly knexInstance: Knex) {}

  async findOne(uuid: string): Promise<Customer | null> {
    const data = await this.knexInstance("customers") //
      .select("*")
      .where({ uuid })
      .whereNull("deleted_at")
      .first();

    if (!data) {
      return null;
    }

    return CustomerMapper.toDomain(data);
  }
}
