import { Order, Product } from "@/domain/entities";
import { OrderMapper } from "@/domain/mappers/OrderMapper";
import { OrdersRepository } from "@/domain/repositories";
import { Knex } from "knex";
import { objectToSnake } from "ts-case-convert";
import { KnexTransactionContext } from "../../db/knex/KnexUnitOfWork";

export default class KnexOrdersRepository implements OrdersRepository {
  constructor(private readonly knexInstance: Knex) {}

  async create(order: Order, products: Product[], transactionContext?: KnexTransactionContext): Promise<boolean> {
    const databaseExecutor = transactionContext?.transaction ?? this.knexInstance;

    const data = OrderMapper.toPersistence(order);
    const normalizedData = objectToSnake(data);

    return databaseExecutor.transaction(async transaction => {
      const [created] = await transaction("orders").insert(normalizedData).returning("id");

      const orderProducts = products.map(product => ({
        order_id: created.id,
        product_id: product.id,
        price: product.price
      }));

      await transaction("order_products").insert(orderProducts);

      return !!created;
    });
  }
}
