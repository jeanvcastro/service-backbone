import { ProductsRepository } from "@/domain/repositories";
import LoggingService from "@/domain/services/LoggingService";
import { knexConnection } from "@/infra/db/knex/connection";
import KnexProductsRepository from "@/infra/repositories/knex/KnexProductsRepository";
import WinstonLogger from "@/infra/services/logging/WinstonLogger";
import { DIContainer } from "@/shared/kernel/DIContainer";
import { SyncProductsUseCase } from "./SyncProductsUseCase";

export function configureDI() {
  const container = new DIContainer<{
    knexConnection: typeof knexConnection;

    ProductsRepository: ProductsRepository;

    LoggingService: LoggingService;

    SyncProductsUseCase: SyncProductsUseCase;
  }>();

  // database
  container.add("knexConnection", () => knexConnection);

  // repositories
  container.add("ProductsRepository", ({ knexConnection }) => new KnexProductsRepository(knexConnection));

  // services
  container.add("LoggingService", () => new WinstonLogger());

  // use cases
  container.add("SyncProductsUseCase", ({ ProductsRepository }) => new SyncProductsUseCase(ProductsRepository));

  return container;
}
