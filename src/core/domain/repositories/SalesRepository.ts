import { Sale } from "../entities/Sale";

export interface SalesRepository {
  create(sale: Sale): Promise<void>;
}
