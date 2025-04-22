import { DIContainer } from "@/core/DIContainer";
import { ProductsRepository, SalesRepository } from "@/core/domain/repositories";
import { ErrorHandler } from "@/core/ErrorHandler";
import Logger from "@/core/Logger";
import { connection } from "@/infra/db/knex/connection";
import { ExpressErrorHandler } from "@/infra/http/express/ExpressErrorHandler";
import WinstonLogger from "@/infra/logging/WinstonLogger";
import KnexProductsRepository from "@/infra/repositories/KnexProductsRepository";
import KnexSalesRepository from "@/infra/repositories/KnexSalesRepository";
import { CreateSaleController } from "./CreateSaleController";
import { CreateSaleUseCase } from "./CreateSaleUseCase";

export function configureDI() {
  const container = new DIContainer<{
    dbConnection: typeof connection;

    ProductsRepository: ProductsRepository;
    SalesRepository: SalesRepository;

    Logger: Logger;
    ErrorHandler: ErrorHandler;

    CreateSaleUseCase: CreateSaleUseCase;

    CreateSaleController: CreateSaleController;
  }>();

  // database
  container.add("dbConnection", () => connection);

  // repositories
  container.add("ProductsRepository", ({ dbConnection }) => new KnexProductsRepository(dbConnection));
  container.add("SalesRepository", ({ dbConnection }) => new KnexSalesRepository(dbConnection));

  // services
  container.add("Logger", () => new WinstonLogger());
  container.add("ErrorHandler", ({ Logger }) => new ExpressErrorHandler(Logger));

  // use cases
  container.add(
    "CreateSaleUseCase",
    ({ ProductsRepository, SalesRepository }) => new CreateSaleUseCase(ProductsRepository, SalesRepository)
  );

  // controllers
  container.add(
    "CreateSaleController",
    ({ CreateSaleUseCase, ErrorHandler }) => new CreateSaleController(CreateSaleUseCase, ErrorHandler)
  );

  return container;
}
