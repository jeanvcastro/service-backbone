import { TransactionContext } from "@/core/UnityOfWork";
import { Order, Product } from "../entities";

export interface OrdersRepository {
  create(order: Order, products: Product[], ctx?: TransactionContext): Promise<boolean>;
}
