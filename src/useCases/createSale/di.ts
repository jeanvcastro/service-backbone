import { DIContainer } from "@/core/DIContainer";
import { ProductsRepository, SalesRepository } from "@/core/domain/repositories";
import { CustomersRepository } from "@/core/domain/repositories/CustomersRepository";
import { ErrorHandler } from "@/core/ErrorHandler";
import Logger from "@/core/Logger";
import { TransactionContext, UnitOfWork } from "@/core/UnityOfWork";
import { connection } from "@/infra/db/knex/connection";
import { KnexUnitOfWork } from "@/infra/db/knex/KnexUnitOfWork";
import { ExpressErrorHandler } from "@/infra/http/express/ExpressErrorHandler";
import WinstonLogger from "@/infra/logging/WinstonLogger";
import KnexCustomersRepository from "@/infra/repositories/knex/KnexCustomersRepository";
import KnexProductsRepository from "@/infra/repositories/knex/KnexProductsRepository";
import KnexSalesRepository from "@/infra/repositories/knex/KnexSalesRepository";
import { CreateSaleController } from "./CreateSaleController";
import { CreateSaleUseCase } from "./CreateSaleUseCase";

export function configureDI() {
  const container = new DIContainer<{
    dbConnection: typeof connection;
    UnitOfWork: UnitOfWork<TransactionContext>;

    CustomersRepository: CustomersRepository;
    ProductsRepository: ProductsRepository;
    SalesRepository: SalesRepository;

    Logger: Logger;
    ErrorHandler: ErrorHandler;

    CreateSaleUseCase: CreateSaleUseCase;

    CreateSaleController: CreateSaleController;
  }>();

  // database
  container.add("dbConnection", () => connection);
  container.add("UnitOfWork", ({ dbConnection }) => new KnexUnitOfWork(dbConnection));

  // repositories
  container.add("CustomersRepository", ({ dbConnection }) => new KnexCustomersRepository(dbConnection));
  container.add("ProductsRepository", ({ dbConnection }) => new KnexProductsRepository(dbConnection));
  container.add("SalesRepository", ({ dbConnection }) => new KnexSalesRepository(dbConnection));

  // services
  container.add("Logger", () => new WinstonLogger());
  container.add("ErrorHandler", ({ Logger }) => new ExpressErrorHandler(Logger));

  // use cases
  container.add(
    "CreateSaleUseCase",
    ({ CustomersRepository, ProductsRepository, SalesRepository, UnitOfWork }) =>
      new CreateSaleUseCase(CustomersRepository, ProductsRepository, SalesRepository, UnitOfWork)
  );

  // controllers
  container.add(
    "CreateSaleController",
    ({ CreateSaleUseCase, ErrorHandler }) => new CreateSaleController(CreateSaleUseCase, ErrorHandler)
  );

  return container;
}
