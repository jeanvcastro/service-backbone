import { Customer } from "@/domain/entities/Customer";
import { Order } from "@/domain/entities/Order";
import { Product } from "@/domain/entities/Product";
import { OrderCreatedEvent } from "@/domain/events/OrderCreatedEvent";
import { CustomersRepository } from "@/domain/repositories/CustomersRepository";
import { OrdersRepository } from "@/domain/repositories/OrdersRepository";
import { ProductsRepository } from "@/domain/repositories/ProductsRepository";
import { EventBus } from "@/shared/kernel/EventBus";
import { TransactionContext, UnitOfWork } from "@/shared/kernel/UnityOfWork";
import { CreateOrderInput } from "./CreateOrderInput";
import { CreateOrderOutput } from "./CreateOrderOutput";

export class CreateOrderUseCase {
  constructor(
    private readonly customersRepository: CustomersRepository,
    private readonly productsRepository: ProductsRepository,
    private readonly ordersRepository: OrdersRepository,
    private readonly unityOfWork: UnitOfWork<TransactionContext>,
    private readonly eventBus: EventBus
  ) {}

  async execute(input: CreateOrderInput): Promise<CreateOrderOutput> {
    const customer = await this.customersRepository.findOne(input.customerUuid);
    if (!customer) {
      throw Customer.notFoundError();
    }

    const products = await this.productsRepository.findMany(input.productUuids);

    if (products.length !== input.productUuids?.length) {
      throw Product.notFoundError();
    }

    const order = new Order({
      customerId: customer.id,
      status: input.status,
      paymentMethod: input.paymentMethod,
      value: input.value,
      attempts: 1,
      gatewayTransactionId: input.gatewayTransactionId,
      creditCardBrand: input.creditCardBrand ?? null,
      installments: input.installments ?? null,
      installmentsValue: input.installmentsValue ?? null,
      digitableLine: input.digitableLine ?? null,
      barcode: input.barcode ?? null,
      qrcode: input.qrcode ?? null,
      expiration: input.expiration ?? null
    });

    await this.unityOfWork.start(async transactionContext => {
      await this.ordersRepository.create(order, products, transactionContext);

      for (const product of products) {
        await this.productsRepository.incrementOrdersCount(product.uuid, transactionContext);
      }
    });

    this.eventBus.publish(
      new OrderCreatedEvent({
        order: {
          uuid: order.uuid,
          status: order.status,
          paymentMethod: order.paymentMethod,
          value: order.value
        },
        customer: {
          uuid: customer.uuid,
          name: customer.name,
          email: customer.email
        },
        products: products.map(product => ({
          uuid: product.uuid,
          name: product.name,
          price: product.price
        }))
      })
    );

    return {
      uuid: order.uuid
    };
  }
}
