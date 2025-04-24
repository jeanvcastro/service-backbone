import { DIContainer } from "@/core/DIContainer";
import Logger from "@/core/Logger";
import { ProductsRepository } from "@/domain/repositories";
import { connection } from "@/infra/db/knex/connection";
import WinstonLogger from "@/infra/logging/WinstonLogger";
import KnexProductsRepository from "@/infra/repositories/knex/KnexProductsRepository";
import { SyncProductsUseCase } from "./SyncProductsUseCase";

export function configureDI() {
  const container = new DIContainer<{
    dbConnection: typeof connection;

    ProductsRepository: ProductsRepository;

    Logger: Logger;

    SyncProductsUseCase: SyncProductsUseCase;
  }>();

  // database
  container.add("dbConnection", () => connection);

  // repositories
  container.add("ProductsRepository", ({ dbConnection }) => new KnexProductsRepository(dbConnection));

  // services
  container.add("Logger", () => new WinstonLogger());

  // use cases
  container.add("SyncProductsUseCase", ({ ProductsRepository }) => new SyncProductsUseCase(ProductsRepository));

  return container;
}
