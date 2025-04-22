import { TransactionContext } from "@/core/UnityOfWork";
import { Product } from "../entities/Product";

export interface ProductsRepository {
  findMany(uuids: string[]): Promise<Product[]>;
  incrementSalesCount(uuid: string, ctx?: TransactionContext, by?: number): Promise<void>;
}
