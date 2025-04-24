import { ProductMapper } from "@/domain/mappers/ProductMapper";
import { ProductsRepository } from "@/domain/repositories/ProductsRepository";
import { SyncProductsInput } from "./SyncProductsInput";

export class SyncProductsUseCase {
  constructor(private readonly productsRepository: ProductsRepository) {}

  async execute(input: SyncProductsInput): Promise<void> {
    for (const inputProduct of input.products) {
      const existingProduct = await this.productsRepository.findOne(inputProduct.uuid);

      if (!existingProduct) {
        const product = ProductMapper.toDomain(inputProduct);

        await this.productsRepository.create(product);
      }
    }
  }
}
