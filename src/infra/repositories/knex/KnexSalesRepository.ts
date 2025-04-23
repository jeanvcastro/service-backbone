import { Product, Sale } from "@/core/domain/entities";
import { SaleMapper } from "@/core/domain/mappers/SaleMapper";
import { SalesRepository } from "@/core/domain/repositories";
import { Knex } from "knex";
import { objectToSnake } from "ts-case-convert";
import { KnexTransactionContext } from "../../db/knex/KnexUnitOfWork";

export default class KnexSalesRepository implements SalesRepository {
  constructor(private readonly knexInstance: Knex) {}

  async create(sale: Sale, products: Product[], transactionContext?: KnexTransactionContext): Promise<boolean> {
    const databaseExecutor = transactionContext?.transaction ?? this.knexInstance;

    const data = SaleMapper.toPersistence(sale);
    const normalizedData = objectToSnake(data);

    return databaseExecutor.transaction(async transaction => {
      const [created] = await transaction("sales").insert(normalizedData).returning("id");

      const saleProducts = products.map(product => ({
        sale_id: created.id,
        product_id: product.id,
        price: product.price
      }));

      await transaction("sale_products").insert(saleProducts);

      return !!created;
    });
  }
}
