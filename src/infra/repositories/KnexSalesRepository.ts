import { Sale } from "@/core/domain/entities/Sale";
import { SaleMapper } from "@/core/domain/mappers/SaleMapper";
import { SalesRepository } from "@/core/domain/repositories";
import { Knex } from "knex";
import { objectToSnake } from "ts-case-convert";

export default class KnexSalesRepository implements SalesRepository {
  constructor(private readonly knex: Knex) {}

  async create(sale: Sale): Promise<boolean> {
    const data = SaleMapper.toPersistence(sale);
    const normalizedData = objectToSnake(data);

    const [id] = await this.knex("sales").insert(normalizedData).returning("id");

    return !!id;
  }
}
