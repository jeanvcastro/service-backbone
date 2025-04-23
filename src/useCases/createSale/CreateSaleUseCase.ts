import { Customer } from "@/core/domain/entities/Customer";
import { Product } from "@/core/domain/entities/Product";
import { Sale } from "@/core/domain/entities/Sale";
import { CustomersRepository } from "@/core/domain/repositories/CustomersRepository";
import { ProductsRepository } from "@/core/domain/repositories/ProductsRepository";
import { SalesRepository } from "@/core/domain/repositories/SalesRepository";
import { TransactionContext, UnitOfWork } from "@/core/UnityOfWork";
import { CreateSaleInput } from "./CreateSaleInput";
import { CreateSaleOutput } from "./CreateSaleOutput";

export class CreateSaleUseCase {
  constructor(
    private readonly customersRepository: CustomersRepository,
    private readonly productsRepository: ProductsRepository,
    private readonly salesRepository: SalesRepository,
    private readonly unityOfWork: UnitOfWork<TransactionContext>
  ) {}

  async execute(input: CreateSaleInput): Promise<CreateSaleOutput> {
    const customer = await this.customersRepository.findOne(input.customerUuid);
    if (!customer) {
      throw Customer.notFoundError();
    }

    const products = await this.productsRepository.findMany(input.productUuids);

    if (products.length !== input.productUuids?.length) {
      throw Product.notFoundError();
    }

    const sale = new Sale({
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
      await this.salesRepository.create(sale, products, transactionContext);

      for (const product of products) {
        await this.productsRepository.incrementSalesCount(product.uuid, transactionContext);
      }
    });

    return {
      uuid: sale.uuid
    };
  }
}
