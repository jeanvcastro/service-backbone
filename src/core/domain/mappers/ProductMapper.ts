import { Product, ProductProps } from "../entities/Product";

export class ProductMapper {
  static toDomain(raw: ProductProps): Product {
    return new Product(raw);
  }

  static toPersistence(product: Product): ProductProps {
    return {
      uuid: product.uuid.toString(),
      name: product.name,
      price: product.price,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt
    };
  }
}
