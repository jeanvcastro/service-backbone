import { Product } from "../entities/Product";

export interface ProductsRepository {
  findMany(uuids: string[]): Promise<Product[]>;
}
