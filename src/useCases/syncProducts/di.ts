import { ProductsRepository } from "@/domain/repositories";
import { knexConnection } from "@/infra/db/knex/connection";
import WinstonLogger from "@/infra/logging/WinstonLogger";
import KnexProductsRepository from "@/infra/repositories/knex/KnexProductsRepository";
import { DIContainer } from "@/shared/kernel/DIContainer";
import Logger from "@/shared/kernel/Logger";
import { SyncProductsUseCase } from "./SyncProductsUseCase";

export function configureDI() {
  const container = new DIContainer<{
    knexConnection: typeof knexConnection;

    ProductsRepository: ProductsRepository;

    Logger: Logger;

    SyncProductsUseCase: SyncProductsUseCase;
  }>();

  // database
  container.add("knexConnection", () => knexConnection);

  // repositories
  container.add("ProductsRepository", ({ knexConnection }) => new KnexProductsRepository(knexConnection));

  // services
  container.add("Logger", () => new WinstonLogger());

  // use cases
  container.add("SyncProductsUseCase", ({ ProductsRepository }) => new SyncProductsUseCase(ProductsRepository));

  return container;
}
