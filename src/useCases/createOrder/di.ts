import { DIContainer } from "@/core/DIContainer";
import { ErrorHandler } from "@/core/ErrorHandler";
import Logger from "@/core/Logger";
import { TransactionContext, UnitOfWork } from "@/core/UnityOfWork";
import { OrdersRepository, ProductsRepository } from "@/domain/repositories";
import { CustomersRepository } from "@/domain/repositories/CustomersRepository";
import { connection } from "@/infra/db/knex/connection";
import { KnexUnitOfWork } from "@/infra/db/knex/KnexUnitOfWork";
import { ExpressErrorHandler } from "@/infra/http/express/ExpressErrorHandler";
import WinstonLogger from "@/infra/logging/WinstonLogger";
import KnexCustomersRepository from "@/infra/repositories/knex/KnexCustomersRepository";
import KnexOrdersRepository from "@/infra/repositories/knex/KnexOrdersRepository";
import KnexProductsRepository from "@/infra/repositories/knex/KnexProductsRepository";
import { CreateOrderController } from "./CreateOrderController";
import { CreateOrderUseCase } from "./CreateOrderUseCase";

export function configureDI() {
  const container = new DIContainer<{
    dbConnection: typeof connection;
    UnitOfWork: UnitOfWork<TransactionContext>;

    CustomersRepository: CustomersRepository;
    ProductsRepository: ProductsRepository;
    OrdersRepository: OrdersRepository;

    Logger: Logger;
    ErrorHandler: ErrorHandler;

    CreateOrderUseCase: CreateOrderUseCase;

    CreateOrderController: CreateOrderController;
  }>();

  // database
  container.add("dbConnection", () => connection);
  container.add("UnitOfWork", ({ dbConnection }) => new KnexUnitOfWork(dbConnection));

  // repositories
  container.add("CustomersRepository", ({ dbConnection }) => new KnexCustomersRepository(dbConnection));
  container.add("ProductsRepository", ({ dbConnection }) => new KnexProductsRepository(dbConnection));
  container.add("OrdersRepository", ({ dbConnection }) => new KnexOrdersRepository(dbConnection));

  // services
  container.add("Logger", () => new WinstonLogger());
  container.add("ErrorHandler", ({ Logger }) => new ExpressErrorHandler(Logger));

  // use cases
  container.add(
    "CreateOrderUseCase",
    ({ CustomersRepository, ProductsRepository, OrdersRepository, UnitOfWork }) =>
      new CreateOrderUseCase(CustomersRepository, ProductsRepository, OrdersRepository, UnitOfWork)
  );

  // controllers
  container.add(
    "CreateOrderController",
    ({ CreateOrderUseCase, ErrorHandler }) => new CreateOrderController(CreateOrderUseCase, ErrorHandler)
  );

  return container;
}
