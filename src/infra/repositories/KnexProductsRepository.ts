import { Product } from "@/core/domain/entities/Product";
import { ProductMapper } from "@/core/domain/mappers/ProductMapper";
import { ProductsRepository } from "@/core/domain/repositories/ProductsRepository";
import { Knex } from "knex";

export default class KnexProductsRepository implements ProductsRepository {
  constructor(private readonly knex: Knex) {}

  async findMany(uuids: string[]): Promise<Product[]> {
    const data = await this.knex("products") //
      .select("*")
      .whereIn("uuid", uuids)
      .whereNull("deleted_at");

    return data.map(item => ProductMapper.toDomain(item));
  }

  async incrementSalesCount(uuid: string, by = 1): Promise<void> {
    await this.knex("products").where({ uuid }).increment("sales_count", by);
  }
}
