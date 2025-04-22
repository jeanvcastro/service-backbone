import { Product, Sale } from "../entities";

export interface SalesRepository {
  create(sale: Sale, products: Product[]): Promise<boolean>;
}
