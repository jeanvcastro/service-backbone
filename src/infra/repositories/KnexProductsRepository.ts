import { Product } from "@/core/domain/entities/Product";
import { ProductMapper } from "@/core/domain/mappers/ProductMapper";
import { ProductsRepository } from "@/core/domain/repositories/ProductsRepository";
import { Knex } from "knex";
import { KnexTransactionContext } from "../db/KnexUnitOfWork";

export default class KnexProductsRepository implements ProductsRepository {
  constructor(private readonly knexInstance: Knex) {}

  async findMany(uuids: string[]): Promise<Product[]> {
    const data = await this.knexInstance("products") //
      .select("*")
      .whereIn("uuid", uuids)
      .whereNull("deleted_at");

    return data.map(item => ProductMapper.toDomain(item));
  }

  async incrementSalesCount(uuid: string, transactionContext?: KnexTransactionContext, by = 1): Promise<void> {
    const databaseExecutor = transactionContext?.transaction ?? this.knexInstance;

    await databaseExecutor("products").where({ uuid }).increment("sales_count", by);
  }
}
