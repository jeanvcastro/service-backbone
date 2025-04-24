import { OrdersRepository, ProductsRepository } from "@/domain/repositories";
import { CustomersRepository } from "@/domain/repositories/CustomersRepository";
import { knexConnection } from "@/infra/db/knex/connection";
import { KnexUnitOfWork } from "@/infra/db/knex/KnexUnitOfWork";
import { createRabbitMQConnection } from "@/infra/eventBus/rabbitMQ/connection";
import { RabbitMQEventBus } from "@/infra/eventBus/rabbitMQ/RabbitMQEventBus";
import { ExpressErrorHandler } from "@/infra/http/express/ExpressErrorHandler";
import WinstonLogger from "@/infra/logging/WinstonLogger";
import KnexCustomersRepository from "@/infra/repositories/knex/KnexCustomersRepository";
import KnexOrdersRepository from "@/infra/repositories/knex/KnexOrdersRepository";
import KnexProductsRepository from "@/infra/repositories/knex/KnexProductsRepository";
import { DIContainer } from "@/shared/kernel/DIContainer";
import { ErrorHandler } from "@/shared/kernel/ErrorHandler";
import { EventBus } from "@/shared/kernel/EventBus";
import Logger from "@/shared/kernel/Logger";
import { TransactionContext, UnitOfWork } from "@/shared/kernel/UnityOfWork";
import { Knex } from "knex";
import { CreateOrderController } from "./CreateOrderController";
import { CreateOrderUseCase } from "./CreateOrderUseCase";

export function configureDI() {
  const container = new DIContainer<{
    EventBus: EventBus;

    knexConnection: Knex;
    UnitOfWork: UnitOfWork<TransactionContext>;

    CustomersRepository: CustomersRepository;
    ProductsRepository: ProductsRepository;
    OrdersRepository: OrdersRepository;

    Logger: Logger;
    ErrorHandler: ErrorHandler;

    CreateOrderUseCase: CreateOrderUseCase;

    CreateOrderController: CreateOrderController;
  }>();

  // events
  container.add("EventBus", () => {
    const bus = new RabbitMQEventBus(createRabbitMQConnection);
    bus.init();
    return bus;
  });

  // database
  container.add("knexConnection", () => knexConnection);
  container.add("UnitOfWork", ({ knexConnection }) => new KnexUnitOfWork(knexConnection));

  // repositories
  container.add("CustomersRepository", ({ knexConnection }) => new KnexCustomersRepository(knexConnection));
  container.add("ProductsRepository", ({ knexConnection }) => new KnexProductsRepository(knexConnection));
  container.add("OrdersRepository", ({ knexConnection }) => new KnexOrdersRepository(knexConnection));

  // services
  container.add("Logger", () => new WinstonLogger());
  container.add("ErrorHandler", ({ Logger }) => new ExpressErrorHandler(Logger));

  // use cases
  container.add(
    "CreateOrderUseCase",
    ({ CustomersRepository, ProductsRepository, OrdersRepository, UnitOfWork, EventBus }) =>
      new CreateOrderUseCase(CustomersRepository, ProductsRepository, OrdersRepository, UnitOfWork, EventBus)
  );

  // controllers
  container.add(
    "CreateOrderController",
    ({ CreateOrderUseCase, ErrorHandler }) => new CreateOrderController(CreateOrderUseCase, ErrorHandler)
  );

  return container;
}
