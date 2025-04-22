import { TransactionContext } from "@/core/UnityOfWork";
import { Product, Sale } from "../entities";

export interface SalesRepository {
  create(sale: Sale, products: Product[], ctx?: TransactionContext): Promise<boolean>;
}
