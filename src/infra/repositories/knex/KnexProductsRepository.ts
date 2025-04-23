import { Product } from "@/core/domain/entities/Product";
import { ProductMapper } from "@/core/domain/mappers/ProductMapper";
import { ProductsRepository } from "@/core/domain/repositories/ProductsRepository";
import { Knex } from "knex";
import { objectToSnake } from "ts-case-convert";
import { KnexTransactionContext } from "../../db/knex/KnexUnitOfWork";

export default class KnexProductsRepository implements ProductsRepository {
  constructor(private readonly knexInstance: Knex) {}

  async findOne(uuid: string): Promise<Product | null> {
    const data = await this.knexInstance("products") //
      .select("*")
      .where({ uuid })
      .whereNull("deleted_at")
      .first();

    if (!data) {
      return null;
    }

    return ProductMapper.toDomain(data);
  }

  async create(product: Product): Promise<boolean> {
    const data = ProductMapper.toPersistence(product);
    const normalizedData = objectToSnake(data);

    const [created] = await this.knexInstance("products").insert(normalizedData).returning("*");

    return !!created;
  }

  async findMany(uuids: string[]): Promise<Product[]> {
    const data = await this.knexInstance("products") //
      .select("*")
      .whereIn("uuid", uuids)
      .whereNull("deleted_at");

    return data.map(item => ProductMapper.toDomain(item));
  }

  async incrementOrdersCount(uuid: string, transactionContext?: KnexTransactionContext, by = 1): Promise<void> {
    const databaseExecutor = transactionContext?.transaction ?? this.knexInstance;

    await databaseExecutor("products").where({ uuid }).increment("orders_count", by);
  }
}
