import { TransactionContext } from "@/shared/kernel/UnityOfWork";
import { Product } from "../entities/Product";

export interface ProductsRepository {
  findOne(uuid: string): Promise<Product | null>;
  create(product: Product): Promise<boolean>;
  findMany(uuids: string[]): Promise<Product[]>;
  incrementOrdersCount(uuid: string, ctx?: TransactionContext, by?: number): Promise<void>;
}
