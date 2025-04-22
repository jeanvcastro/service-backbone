import { Product } from "../entities/Product";

export interface ProductsRepository {
  findMany(uuids: string[]): Promise<Product[]>;
  incrementSalesCount(uuid: string, by?: number): Promise<void>;
}
