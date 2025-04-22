import { Product } from "@/core/domain/entities/Product";
import { Sale } from "@/core/domain/entities/Sale";
import { ProductsRepository } from "@/core/domain/repositories/ProductsRepository";
import { SalesRepository } from "@/core/domain/repositories/SalesRepository";
import { CreateSaleInput } from "./CreateSaleInput";
import { CreateSaleOutput } from "./CreateSaleOutput";

export class CreateSaleUseCase {
  constructor(
    private readonly productsRepository: ProductsRepository,
    private readonly salesRepository: SalesRepository
  ) {}

  async execute(input: CreateSaleInput): Promise<CreateSaleOutput> {
    const products = await this.productsRepository.findMany(input.products);

    if (products.length !== input.products?.length) {
      throw Product.notFoundError();
    }

    const sale = new Sale({
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

    await this.salesRepository.create(sale, products);

    for (const product of products) {
      await this.productsRepository.incrementSalesCount(product.uuid);
    }

    return {
      uuid: sale.uuid
    };
  }
}
